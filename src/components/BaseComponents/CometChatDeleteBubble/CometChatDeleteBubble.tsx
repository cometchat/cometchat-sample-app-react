import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
interface DeleteBubbleProps {
    /* To provide sender or receiver styling to the bubble. */
    isSentByMe: boolean;

    /**
     * Optional. The text to display. If not provided, a default
     * localized "DELETE_MSG_TEXT" will be used.
     */
    text?:string;
}

/**
 * CometChatDeleteBubble is a generic component used to indicate that a message has been deleted.
 * It accepts the isSentByMe prop and applies sender or receiver styling based on its value.
 */
const CometChatDeleteBubble = (props: DeleteBubbleProps) => {
    const {
        isSentByMe = false,
        text= localize("DELETE_MSG_TEXT"),
    } = props;

    return (
        <div className="cometchat">
            <div className={`cometchat-delete-bubble ${isSentByMe ? "cometchat-delete-bubble-outgoing" : "cometchat-delete-bubble-incoming"}`}>
                <div className="cometchat-delete-bubble__body">
                    <div
                        className={`cometchat-delete-bubble__icon`}
                    />
                    <label className={`cometchat-delete-bubble__text`}>
                       {text}
                    </label>
                </div>
            </div>
        </div>
    )
}

export { CometChatDeleteBubble }