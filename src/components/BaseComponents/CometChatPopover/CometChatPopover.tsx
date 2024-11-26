import  { useState, useRef, useEffect, ReactNode, useCallback, forwardRef, useImperativeHandle, CSSProperties, useLayoutEffect } from 'react';

export enum Placement {
    top = 'top',
    right = 'right',
    bottom = 'bottom',
    left = 'left',
}

interface PopoverProps {
    placement?: Placement;
    closeOnOutsideClick?: boolean;
    showOnHover?: boolean;
    debounceOnHover?: number;
    children: ReactNode;
    content: ReactNode;
    hasToolTip?: boolean;
    childClickHandler?: (openContent: Function, event: Event) => void;
    onOutsideClick?: () => void;
    overrideStyleProps?: CSSProperties;
}

const CometChatPopover = forwardRef<{
    openPopover: () => void;
    closePopover: () => void;
}, PopoverProps>(
    (
        {
            placement = Placement.bottom,
            closeOnOutsideClick = true,
            showOnHover = false,
            debounceOnHover = 500,
            children,
            content,
            hasToolTip,
            onOutsideClick,
            childClickHandler,
            overrideStyleProps,
        },
        ref
    ) => {

        const onMouseHoverRef = useRef<any>(null);
        const [isOpen, setIsOpen] = useState(false);
        const [positionStyleState, setPositionStyleState] = useState<CSSProperties>({});
        const popoverRef = useRef<HTMLDivElement>(null);
        const childRef = useRef<HTMLDivElement>(null);

        useImperativeHandle(ref, () => ({
            openPopover() {
                getPopoverPositionStyle();
                setIsOpen(true);
            },
            closePopover() {
                
                setIsOpen(false);
            },
        }));
   
        const handleWindowChange = debounce(() => {
            if (!popoverRef.current) return;

            if (!isOpen) return;

            if (childRef.current && !isElementVisibleWithScrollableAncestor(childRef.current)) {
                setIsOpen(false);
                return;
            }
        }, 100);

        const togglePopover = useCallback((e?: any) => {
            setIsOpen(prev => !prev);
        }, []);

        useEffect(() => {
            if (closeOnOutsideClick) {
                const handleClickOutside = (event: MouseEvent) => {
                    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                        setIsOpen(false);
                        if (onOutsideClick) {
                            onOutsideClick()
                        }
                    }
                };
                document.addEventListener('click', handleClickOutside);
                return () => document.removeEventListener('click', handleClickOutside);
            }
        }, [closeOnOutsideClick]);

        useEffect(() => {
            window.addEventListener('resize', handleWindowChange);
            window.addEventListener('scroll', handleWindowChange, true);
            return () => {
                window.removeEventListener('resize', handleWindowChange);
                window.removeEventListener('scroll', handleWindowChange, true);
            };
        }, [isOpen]);

        /**
         * Updates the popover's position when opened and resets it when closed.
         * Uses useLayoutEffect to ensure the position is set before the browser repaints, 
         * preventing visual flickering.
         *
         * @param {boolean} isOpen - Whether the popover is open.
         * @param {string} content - The popover's content, affecting its size and position.
         * @param {Function} getPopoverPositionStyle - Calculates and sets the popover's position.
         * @param {Function} setPositionStyleState - Updates the popover's position style.
         */
        useLayoutEffect(() => {
            if (isOpen) {
    getPopoverPositionStyle()
            } else {
                setPositionStyleState({});
            }
        }, [content, isOpen]);

        /**
         * Debounces a function, ensuring it is only executed after a specified wait time has passed since the last invocation.
         * @param func The function to debounce.
         * @param wait The wait time in milliseconds.
         * @returns A debounced version of the function.
         */
        function debounce<T extends (...args: any[]) => any>(
            func: T,
            wait: number
        ) {
            let timeout: ReturnType<typeof setTimeout>;
            return function executedFunction(this: any, ...args: Parameters<T>) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        /**
         * Checks if an element is scrollable.
         * @param ele - The HTML element to check.
         * @returns True if the element is scrollable, false otherwise.
         */
        function isScrollable(ele: HTMLElement) {
            const hasScrollableContent =
                ele.scrollHeight > ele.clientHeight || ele.scrollWidth > ele.clientWidth;

            // Check for overflow styles and handle potential edge cases
            const overflowYStyle = window.getComputedStyle(ele).overflowY;
            const overflowXStyle = window.getComputedStyle(ele).overflowX;
            const isOverflowHidden =
                overflowYStyle.indexOf("hidden") !== -1 ||
                overflowXStyle.indexOf("hidden") !== -1;
            const isOverflowAuto =
                (overflowYStyle === "auto" || overflowXStyle === "auto") &&
                hasScrollableContent;

            // Consider potential non-standard overflow values and nested overflow
            const isNonStandardOverflow =
                (overflowYStyle !== "visible" &&
                    overflowYStyle !== "hidden" &&
                    overflowYStyle !== "scroll") ||
                (overflowXStyle !== "visible" &&
                    overflowXStyle !== "hidden" &&
                    overflowXStyle !== "scroll");

            // Return true if scrollable content exists and overflow is not primarily hidden
            return (
                (hasScrollableContent && !isOverflowHidden) ||
                isOverflowAuto ||
                isNonStandardOverflow
            );
        }

        /**
         * Returns the closest scrollable ancestor of the given element.
         * If no scrollable ancestor is found, the document element is returned as the default fallback.
         * @param ele - The element for which to find the closest scrollable ancestor.
         * @returns The closest scrollable ancestor element or the document element if none is found.
         */
        function getClosestScrollableAncestor(ele: HTMLElement | null) {
            while (ele) {
                // Get the root node of the current element
                const rootNode = ele.getRootNode();

                // Check if the root node is a shadow root
                if (rootNode instanceof ShadowRoot) {
                    // If the root node is a shadow root, traverse to its host
                    ele = rootNode.host as HTMLElement;
                } else {
                    // If not in shadow DOM, move to the parent element
                    ele = ele.parentElement;
                }

                // Check if the current element is scrollable
                if (ele && isScrollable(ele)) {
                    return ele; // Return the scrollable element
                }
            }

            // No scrollable ancestor found, return document as default fallback
            return document.documentElement;
        }

        /**
         * Checks if an element is visible within its scrollable ancestor.
         *
         * @param element - The element to check visibility for.
         * @returns A boolean indicating whether the element is visible.
         */
        function isElementVisibleWithScrollableAncestor(element: HTMLElement) {
            // Get closest scrollable ancestor
            const scrollableAncestor = getClosestScrollableAncestor(element);

            const elemRect = element.getBoundingClientRect();
            const contRect = scrollableAncestor.getBoundingClientRect();

            // Check visibility within the scrollable ancestor, considering potential edge cases
            const isVisible =
                elemRect.top >= contRect.top && // Top within scrollable area
                elemRect.left >= contRect.left && // Left within scrollable area
                elemRect.bottom <= contRect.bottom && // Bottom within scrollable area
                elemRect.right <= contRect.right && // Right within scrollable area
                elemRect.bottom > contRect.top && // Some element height within view
                elemRect.right > contRect.left; // Some element width within view

            return isVisible;
        }

        const getPopoverPositionStyle = useCallback(() => {
            const height = popoverRef.current?.scrollHeight!;
            const width = popoverRef.current?.scrollWidth!;
            const rect = childRef.current?.getBoundingClientRect();
            const x_left = rect?.left!,
                x_right = rect?.right!,
                y_bot = rect?.bottom!,
                y_top = rect?.top!;

            const positionStyle = { top: "", right: "", bottom: "", left: "", };
            const viewportHeight = window.innerHeight, viewportWidth = window.innerWidth;
            if (Object.keys(positionStyleState).length == 0) {
                if (placement === Placement.top || placement === Placement.bottom) {
                    if (placement === Placement.top) {
                        if (y_top - height - 10 < 0) {
                            positionStyle["top"] = `${y_bot + 10}px`;
                        } else {
                            positionStyle["bottom"] = `${viewportHeight - y_top}px`;
                        }
                    } else if (placement === Placement.bottom) {
                        if ((y_bot + height + 10) > viewportHeight) {
                            positionStyle["top"] = `${y_top - height - 10}px`;
                        } else {
                            positionStyle["top"] = `${y_bot + 10}px`;
                        }
                    }

                    if (((x_left + width) - 10) > viewportWidth) {
                        positionStyle["left"] = `${viewportWidth - width - 10}px`;
                    } else {
                        positionStyle["left"] = `${x_left - 10}px`;
                    }
                } else if (placement === Placement.left || placement === Placement.right) {
                    if (placement === Placement.left) {
                        if (x_left - width - 10 < 0) {
                            positionStyle["left"] = `${x_right + 10}px`;
                        } else {
                            positionStyle["left"] = `${x_left - width - 10}px`;
                        }
                    } else if (placement === Placement.right) {
                        if (x_right + width + 10 > viewportWidth) {
                            positionStyle["left"] = `${x_left - width - 10}px`;
                        } else {
                            positionStyle["left"] = `${x_right + 10}px`;
                        }
                    }

                    if (((y_top + height) - 10) > viewportHeight) {
                        positionStyle["top"] = `${viewportHeight - height - 10}px`;
                    } else {
                        positionStyle["top"] = `${y_top - 10}px`;
                    }
                }
                setPositionStyleState(positionStyle);
            }
        }, [isOpen, positionStyleState]);

        const onPopoverMouseEnter = () => {
            if (onMouseHoverRef.current) {
                clearTimeout(onMouseHoverRef.current);
                onMouseHoverRef.current = null;
            }
            if (showOnHover && !isOpen) {
                onMouseHoverRef.current = setTimeout(() => {
                    getPopoverPositionStyle()
                    setIsOpen(true)
                }, debounceOnHover);
                return onMouseHoverRef.current;
            }
        }

        const onPopoverMouseLeave = () => {
            if (onMouseHoverRef.current) {
                clearTimeout(onMouseHoverRef.current);
                onMouseHoverRef.current = null;
            }
            if (showOnHover && isOpen) {
                onMouseHoverRef.current = setTimeout(() => setIsOpen(false), debounceOnHover);
                return onMouseHoverRef.current;
            }
        }

        return (
            <div className="cometchat">
                <div className="cometchat-popover">
                    <div
                        ref={childRef}
                        onClick={(e: any) => {
                            e.stopPropagation();
                            if (!showOnHover) {
                                if (childClickHandler) {
                                    childClickHandler(togglePopover, e);
                                } else {
                                    return togglePopover();
                                }
                            }
                        }}
                        className="cometchat-popover__button"
                        onMouseEnter={onPopoverMouseEnter}
                        onMouseLeave={onPopoverMouseLeave }
                    >
                        {children}
                    </div>
                    {isOpen &&
                        <div
                            ref={popoverRef}
                            style={positionStyleState}
                            className="cometchat-popover__content">
                            {content}
                        </div>
                    }
                </div>
            </div>
        );
    }
)

export { CometChatPopover };