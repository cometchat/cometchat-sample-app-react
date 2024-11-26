import { localize } from "@cometchat/chat-uikit-react";
import "../../styles/CometChatMessages/CometChatEmptyStateView.css";

export const CometChatEmptyStateView = (props: { activeTab?: string }) => {
    const { activeTab } = props;

    return (
        <div className="cometchat-empty-state-view">
            <div className={activeTab !== "calls" ? "cometchat-empty-state-view__icon" : "cometchat-empty-state-view__icon-call"} />
            <div className="cometchat-empty-state-view__text">
                <div className="cometchat-empty-state-view__text-title">
                    {activeTab !== "calls" ?
                        localize("WELCOME_TO_CONVERSATION")
                        : localize("NICE_TO_TALK")
                    }
                </div>
                {activeTab !== "calls" ?
                  localize("SELECT_CHAT_TO_START")
                    :     localize("PICK_USER_OR_GROUP")}
            </div>
        </div>
    )
}