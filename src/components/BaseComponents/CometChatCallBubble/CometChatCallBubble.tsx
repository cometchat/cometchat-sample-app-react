import React from "react";

interface CallBubbleProps {
    /* title text for the call bubble. */
    title?: string;
    /* url of the call to be shown. */
    sessionId?: string;
    /* description of the call. */
    subtitle?: React.ReactNode;
    /* text which is used to display on the button. */
    buttonText?: string;
    /* icon used to show call type */
    iconURL?: string;
    /* callback function that triggeres on click of button. */
    onClicked?: ((url: string) => void) | undefined;
    /* boolean value to toggle styling for sender and receiver message */
    isSentByMe?: boolean;

}

/*
    CometChatCallBubble is a base component used to display call messages.
    It is generally used in user or group chats as a wrapper for call messages.
*/
const CometChatCallBubble = (props: CallBubbleProps) => {
    const {
        title = "",
        sessionId = "",
        subtitle = null,
        buttonText = "",
        onClicked = () => { },
        isSentByMe = true,
        iconURL
    } = props;

    return (
        <div className="cometchat">
            <div className={`cometchat-call-bubble ${isSentByMe ? 'cometchat-call-bubble-outgoing' : 'cometchat-call-bubble-incoming'}`}>
                <div className="cometchat-call-bubble__body"
                >
                    <div className="cometchat-call-bubble__icon-wrapper
">
                        <div className="cometchat-call-bubble__icon-wrapper-icon" style={iconURL ? {
                            WebkitMask: `url(${iconURL}) center center no-repeat`
                        } : undefined}>
                        </div>
                    </div>
                    <div className="cometchat-call-bubble__body-content">
                        <div className="cometchat-call-bubble__body-content-title
">
                            {title}
                        </div>
                        <div className="cometchat-call-bubble__body-content-subtitle">
                            {subtitle}
                        </div>
                    </div>
                </div>
                {buttonText?.trim() && buttonText.trim()?.length > 0 ? <button className="cometchat-call-bubble__button" title={buttonText} onClick={() => onClicked ? onClicked(sessionId) : null}> {buttonText}</button> : null}

            </div>
        </div>
    )
}

export { CometChatCallBubble };
