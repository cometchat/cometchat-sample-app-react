import { CometChatButton, localize } from "@cometchat/chat-uikit-react";
import "../../styles/CometChatAlertPopup/CometChatAlertPopup.css";

export const CometChatAlertPopup = (props: { onConfirmClick?: () => void, title?: string, description?: string }) => {
    const { onConfirmClick, title, description } = props;

    return (
        <div className="cometchat-alert-popup__backdrop">
            <div className="cometchat-alert-popup-wrapper">
                <div className="cometchat-alert-popup">
                    <div className="cometchat-alert-popup__icon-wrapper">
                        <div className="cometchat-alert-popup__icon" />
                    </div>
                    <div className="cometchat-alert-popup__text">
                        <div className="cometchat-alert-popup__text-title">
                            {title}
                        </div>
                        <div className="cometchat-alert-popup__text-subtitle">
                            {description}
                        </div>
                    </div>

                    <div className="cometchat-alert-popup__button-wrapper">
                        <CometChatButton
                            text={localize("UNDERSTOOD")}
                            onClick={onConfirmClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}