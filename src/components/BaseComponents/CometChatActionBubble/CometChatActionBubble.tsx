interface ActionBubbleProps {
    /* To show action message in the  bubble. */
    messageText: string;
}

/**
 * CometChatActionBubble is a generic component used to show an action message
 */
const CometChatActionBubble = (props: ActionBubbleProps) => {
    const {
        messageText
    } = props;
    return <>
        {messageText ? <div className="cometchat" style={{
            height: "fit-content",
            width: "inherit"
        }}>
            <div className="cometchat-action-bubble">
                <div className='cometchat-action-bubble__icon'></div>
                <span className={`cometchat-action-bubble__text`}>
                    {messageText}
                </span>
            </div>
        </div> : null}
    </>


}

export { CometChatActionBubble }