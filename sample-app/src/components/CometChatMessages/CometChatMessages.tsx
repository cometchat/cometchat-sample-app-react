import { CometChatMessageComposer, CometChatMessageHeader, CometChatMessageList, localize } from "@cometchat/chat-uikit-react";
import "../../styles/CometChatMessages/CometChatMessages.css";
import { useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUserEvents } from "@cometchat/chat-uikit-react";
interface MessagesViewProps {
    user?: CometChat.User;
    group?: CometChat.Group;
    headerMenu: () => JSX.Element;
    onThreadRepliesClick: (message: CometChat.BaseMessage) => void;
    showComposer?: boolean;
    onBack?: () => void;
}

export const CometChatMessages = (props: MessagesViewProps) => {
    const {
        user,
        group,
        headerMenu,
        onThreadRepliesClick,
        showComposer,
        onBack = () => { }
    } = props;
    return (
        <div className="cometchat-messages-wrapper">
            <div className="cometchat-header-wrapper">
                <CometChatMessageHeader
                    user={user}
                    group={group}
                    menu={headerMenu()}
                    onBack={onBack}
                />
            </div>
            <div className="cometchat-message-list-wrapper">
                <CometChatMessageList
                    user={user}
                    group={group}
                    onThreadRepliesClick={(message: CometChat.BaseMessage) => onThreadRepliesClick(message)}
                />
            </div>
            {showComposer ? <div className="cometchat-composer-wrapper">
                <CometChatMessageComposer
                    user={user}
                    group={group}
                />
            </div> : <div className="message-composer-blocked">
                <div className="message-composer-blocked__text">
                    {localize("CANNOT_SEND_MESSAGE_TO_BLOCKED_USER")}
                    <a onClick={() => {
                        if (user) {
                            CometChat.unblockUsers([user?.getUid()]).then(() => {
                                user.setBlockedByMe(false);
                                CometChatUserEvents.ccUserUnblocked.next(user);
                            })
                        }
                    }}>
                        {localize("CLICK_TO_UNBLOCK")}
                    </a>
                </div>
            </div>}
        </div>
    )
}