import React, { CSSProperties, JSX, useCallback, useEffect, useRef, useState } from 'react';
import { CometChatPopover } from "../CometChatPopover/CometChatPopover";
import { CometChatActionsIcon, CometChatActionsView, CometChatOption } from '../../../modals';
import { Placement } from '../../../Enums/Enums';
interface ContextMenuProps {
    /* data to be used for the menu items. */
    data: Array<CometChatActionsIcon | CometChatActionsView | CometChatOption>,
    /* to specify how many menu items should be visible by default. */
    topMenuSize?: number,
    /* tooltip to be shown for the more menu button. */
    moreIconHoverText?: string,
    /* callback function which is triggered on click of menu item. */
    onOptionClicked?: (option: CometChatActionsIcon | CometChatActionsView | CometChatOption) => void,
    /* to specify the position of the menu. */
    placement?: Placement,
    /* Specifies whether the menu should close when clicking outside.*/
    closeOnOutsideClick?: boolean;
}

/**
 * CometChatContextMenu is a composite component used to display menu data in required format. 
 * It accepts a data array for displaying the menu items and topMenuSize to specify how many menu items should be visible by default. 
 * It also accepts a URL for the 'more' icon, placement and a menu click callback function for customization purposes.
 */
const CometChatContextMenu = (props: ContextMenuProps) => {
    const [showSubMenu, setShowSubMenu] = React.useState<boolean>(false);
    const {
        data,
        topMenuSize = 2,
        moreIconHoverText,
        onOptionClicked,
        placement = Placement.left,
        closeOnOutsideClick = false,
    } = props;
    const popoverRef = React.createRef<{
        openPopover: () => void;
        closePopover: () => void;
    }>();
    const moreButtonRef = useRef<HTMLDivElement>(null);
    const subMenuRef = useRef<HTMLDivElement>(null);
    const [positionStyleState, setPositionStyleState] = useState<CSSProperties>({});

    /**
    * useEffect to handle outside clicks for a submenu.
    *
    * - Adds an event listener to detect clicks outside the `moreButtonRef` element.
    * - Closes the submenu when a click is detected outside the element.
    *
    * @function
    * @param {void} None - This effect runs once when the component mounts.
    * @returns {void} Cleanup function to remove the click event listener when the component unmounts.
    */
    useEffect(() => {
        if (closeOnOutsideClick) {
            const handleClickOutside = (event: MouseEvent) => {
                if (moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
                    setShowSubMenu(false);
                }
            };
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [closeOnOutsideClick]);


    /* This function is used to show and hide the sub-menu. */
    const handleMenuClick = useCallback(() => {
        setShowSubMenu((showSubMenu: boolean) => !showSubMenu)
        setTimeout(() => {
            getPositionStyle()
        }, 0);
    }, [setPositionStyleState]);



    /* This function returns More button component. */
    const getMoreButton = useCallback(() => {
        return (
            <div
                title={moreIconHoverText}
                onClick={handleMenuClick}
                className="cometchat-menu-list__sub-menu"
                ref={moreButtonRef}
            >
                <div
                    className="cometchat-menu-list__sub-menu-icon"

                />
            </div>
        )
    }, [moreIconHoverText, handleMenuClick])

    /* This function uses menu data and generates menu components conditionally. */
    const getMenu = useCallback((menu: Array<CometChatActionsIcon | CometChatActionsView | CometChatOption>, isSubMenu: boolean) => {
        if (menu.length > 0) {
            return menu?.map((menuData, index: number) => {
                const className =
                index == 0 && !isSubMenu
                    ? ""
                    : "cometchat-menu-list__menu";
                let menuButton, moreButton = null;
                if (menuData instanceof CometChatActionsView && menuData?.customView) {
                    menuButton = (
                        <div id={menuData.id} >
                            <CometChatPopover
                                ref={popoverRef}
                                closeOnOutsideClick={closeOnOutsideClick}
                                placement={placement}
                                content={<>{menuData?.customView(()=>{
                                    popoverRef.current?.closePopover()
                                })}</>}
                            >
                                <div slot="children">
                                    <div
                                        onClick={() => {
                                            setPositionStyleState({});
                                            setShowSubMenu(false);
                                        }}
                                        title={menuData?.title}
                                        className={isSubMenu ? `cometchat-menu-list__sub-menu-list-item` : `cometchat-menu-list__main-menu-item`}
                                    >
                                        <div className={isSubMenu ? `cometchat-menu-list__sub-menu-list-item-icon cometchat-menu-list__sub-menu-list-item-icon-${menuData.id}` : `cometchat-menu-list__main-menu-item-icon cometchat-menu-list__main-menu-item-icon-${menuData.id}`} style={menuData?.iconURL ? { WebkitMask: `url(${menuData?.iconURL}), center, center, no-repeat`,display:"flex" } : undefined} />
                                        {isSubMenu ? <label className={`cometchat-menu-list__sub-menu-item-title cometchat-menu-list__sub-menu-item-title-${menuData.id}`}>{menuData?.title}</label> : ""}
                                    </div>
                                </div>
                            </CometChatPopover>
                        </div>);
                } else {
                    menuButton = (
                        <div id={menuData.id} className={className}>
                            <div
                                className={isSubMenu ? `cometchat-menu-list__sub-menu-list-item` : `cometchat-menu-list__main-menu-item`}
                                title={menuData?.title}
                                onClick={() => {
                                    setShowSubMenu(false);
                                    setPositionStyleState({});
                                    onOptionClicked?.(menuData)
                                }}
                            >
                                <div className={isSubMenu ? `cometchat-menu-list__sub-menu-list-item-icon cometchat-menu-list__sub-menu-list-item-icon-${menuData.id}` : `cometchat-menu-list__main-menu-item-icon cometchat-menu-list__main-menu-item-icon-${menuData.id}`} style={menuData?.iconURL ? { WebkitMask: `url(${menuData?.iconURL}), center, center, no-repeat` ,WebkitMaskSize:"contain",display:"flex"} : undefined} />
                                {isSubMenu ? <label className={`cometchat-menu-list__sub-menu-item-title cometchat-menu-list__sub-menu-item-title-${menuData.id}`}>{menuData?.title}</label> : ""}
                            </div>
                        </div>
                    );
                };

                if (!isSubMenu && data?.length > menu?.length && index === menu?.length - 1) {
                    moreButton = getMoreButton();
                }

                return (
                    <div key={menuData.title} className="cometchat-menu-list__menu-wrapper">
                        {menuButton}
                        {moreButton}
                    </div>
                )
            })
        } else {
            const moreButton = getMoreButton();
            return (
                <div className="cometchat-menu-list__menu-wrapper">
                    {moreButton}
                </div>
            )
        }
    }, [placement, data, onOptionClicked, getMoreButton])

    /* this function is used to trigger the getMenu function with main menu data. */
    const getTopMenu = useCallback(() => {
        return getMenu(data.slice(0, topMenuSize > 0 ? topMenuSize - 1 : 0), false);
    }, [getMenu, topMenuSize, data])

    /* this function is used to trigger the getMenu function with sub menu data. */
    const getSubMenu = useCallback(() => {
        return getMenu(data.slice(topMenuSize > 0 ? topMenuSize - 1 : 0), true);
    }, [getMenu, topMenuSize, data])

    const getPositionStyle = useCallback(() => {

        const rect = moreButtonRef.current?.getBoundingClientRect();
        const height = document.getElementById("subMenuContext")?.clientHeight || (48 * data.length);
        const width = document.getElementById("subMenuContext")?.clientWidth || 160;
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
    }, [showSubMenu, positionStyleState]);

    return (
        <div className="cometchat">
            <div className="cometchat-menu-list">
                <div className="cometchat-menu-list__main-menu">
                    {getTopMenu()}
                </div>
                {showSubMenu &&
                    <div
                        ref={subMenuRef}
                        className="cometchat-menu-list__sub-menu-list"
                        id="subMenuContext"
                        style={positionStyleState}
                    >
                    {getSubMenu()}
                </div>}
            </div>
        </div>
    )
}

export { CometChatContextMenu };