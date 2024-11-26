import { useState } from "react";

interface customItem {
    element: HTMLElement;
    elementHeight: number;
    elementWidth: number;
    ySpeed: number;
    omega: number;
    random: number;
    x: Function;
    y: number;
}

export const useLiveReactionHook = ({}) => {
    const [items, setItems] = useState<customItem[]>([]);
    const [horizontalSpeed, setHorizontalSpeed] = useState(0);
    const [verticalSpeed, setVerticalSpeed] = useState(0);

    /* This function is used to update the reaction items with required configs. */
    const updateItems: () => void = () => {
        try {
            const width = document!.querySelector("#reaction")!.parentElement!.offsetWidth;
            const height = document?.querySelector("#reaction")!.parentElement!.offsetHeight;
            const elements: any = document?.querySelector("#reaction")!.parentElement!.querySelectorAll(
                ".cometchat-live-reaction__icon"
            );
            const tempItems = [];
            for (let i = 0; i < elements!.length; i++) {
                const element = elements![i],
                    elementWidth = element.offsetWidth,
                    elementHeight = element.offsetHeight;
                const itemOmega = (2 * Math.PI * horizontalSpeed) / (width * 60);
                const itemRandom = (Math.random() / 2 + 0.5) * i * 10000;
                const item = {
                    element: element,
                    elementHeight: elementHeight,
                    elementWidth: elementWidth,
                    ySpeed: -verticalSpeed,
                    omega: itemOmega,
                    random: itemRandom,
                    x: function (time: number) {
                        return (
                            ((Math.sin(itemOmega * (time + itemRandom)) + 1) / 2) *
                            (width - elementWidth)
                        );
                    },
                    y: height + (Math.random() + 0.2) * i * elementHeight,
                };
                tempItems.push(item);
            }
            setItems(tempItems);
        } catch (error: unknown) {
            console.error(error);
        }
    }

    /* This function is used to initiate the animation function after an interval. */
    const requestAnimation: () => void = () => {
        try {
            setTimeout(() => {
                animateReaction();
            }, 1000 / 60);
        } catch (error: unknown) {
            console.error(error);
        }
    }

    /* This function animates the reactions with required configs. */
    const animateReaction: () => boolean = () => {
        try {
            if (!document?.querySelector("#reaction")!.parentElement) {
                return false;
            }
            const time = +new Date();
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const transformString =
                    "translate3d(" + item.x(time) + "px, " + item.y + "px, 0px)";
                item.element.style.transform = transformString;
                item.element.style.visibility = "visible";
                item.y += item.ySpeed;
            }
            requestAnimation();
        } catch (error: unknown) {
            console.error(error);
        }
        return true;
    }

    return {
        setVerticalSpeed,
        setHorizontalSpeed,
        setItems,
        updateItems,
        requestAnimation,
    }
}