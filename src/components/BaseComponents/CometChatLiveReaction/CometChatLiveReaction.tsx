import { useEffect } from "react";
import heartIcon from "./assets/heart-reaction.png";
import { useLiveReactionHook } from "./useLiveReactionHook";

interface BaseProps {
    /* url of the image for reaction icon. */
    reactionIconURL?: string;
}

/*
    CometChatLiveReaction is a generic component used to react on the messages.
    It accepts "reactionIconURL" which is the url of the image for reaction icon.
*/
const CometChatLiveReaction = (props: BaseProps) => {
    const {
        reactionIconURL = heartIcon,
    } = props;

    const {
        setVerticalSpeed,
        setHorizontalSpeed,
        setItems,
        updateItems,
        requestAnimation,
    } = useLiveReactionHook({});

    useEffect(() => {
        setVerticalSpeed(5);
        setHorizontalSpeed(2);
        setItems([]);
        updateItems();
        requestAnimation();
    }, []);

    return (
        <div className="cometchat">
            <div className="cometchat-live-reaction">
                {Array(5).fill(0).map(() => {
                    return <span id="reaction">
                        <img className="cometchat-live-reaction__icon" src={reactionIconURL} ></img>
                    </span>
                })}
            </div>
        </div>
    )
}

export { CometChatLiveReaction };