import { Dispatch, SetStateAction, useEffect, useState } from "react";
import chatIcon from '../../assets/start_chat.svg';
import createGroupIcon from '../../assets/create-group.svg';
import logoutIcon from '../../assets/logout.svg';
import userIcon from '../../assets/user.svg';
import { Call, Conversation, Group, User } from "@cometchat/chat-sdk-javascript";
import "../../styles/CometChatSelector/CometChatSelector.css";
import { CometChatJoinGroup } from "../CometChatJoinGroup/CometChatJoinGroup";
import CometChatCreateGroup from "../CometChatCreateGroup/CometChatCreateGroup";
import { CometChatButton, CometChatCallLogs, CometChatConversations, CometChatGroups, CometChatOption, CometChatUIKit, CometChatUIKitLoginListener, CometChatUsers, localize } from "@cometchat/chat-uikit-react";
import { CometChatContextMenu, Placement } from "@cometchat/chat-uikit-react";
import { useNavigate } from "react-router-dom";

interface SelectorProps {
    group?: Group;
    showJoinGroup?: boolean;
    activeTab?: string;
    activeItem?: User | Group | Conversation | Call;
    onSelectorItemClicked?: (input: User | Group | Conversation | Call, type: string) => void;
    onProtectedGroupJoin?: (group: Group) => void;
    showCreateGroup?: boolean;
    setShowCreateGroup?: Dispatch<SetStateAction<boolean>>;
    onHide?: () => void;
    onNewChatClicked?: () => void;
    onGroupCreated?: (group: Group) => void;
}

export const CometChatSelector = (props: SelectorProps) => {
    const {
        group,
        showJoinGroup,
        activeItem,
        activeTab,
        onSelectorItemClicked = () => { },
        onProtectedGroupJoin = () => { },
        showCreateGroup,
        setShowCreateGroup = () => { },
        onHide = () => { },
        onNewChatClicked = () => { },
        onGroupCreated = () => { },
    } = props;

    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>();
    const navigate = useNavigate();


    useEffect(() => {
        let loggedInUsers = CometChatUIKitLoginListener.getLoggedInUser();
        setLoggedInUser(loggedInUsers)
    }, [CometChatUIKitLoginListener?.getLoggedInUser()])

    const getOptions = (): CometChatOption[] => {
        return [
            new CometChatOption({
                id: "logged-in-user",
                title: loggedInUser && loggedInUser.getName() || "",
                iconURL: userIcon,
            }),
            new CometChatOption({
                id: "create-conversation",
                title: localize("CREATE_CONVERSATION"),
                iconURL: chatIcon,
                onClick: () => {
                    onNewChatClicked()
                },
            }),
            new CometChatOption({
                id: "log-out",
                title: localize("LOG_OUT"),
                iconURL: logoutIcon,
                onClick: () => {
                    logOut();
                },
            })
        ]
    };

    const logOut = () => {
        CometChatUIKit.logout().then(() => {
            setLoggedInUser(null)
            navigate('/login', { replace: true });
        }).catch((error) => {
            console.log("error", error)
        })
    }

    return (
        <>
            {loggedInUser && <>
                {showJoinGroup && group && (
                    <CometChatJoinGroup
                        group={group}
                        onHide={onHide}
                        onProtectedGroupJoin={(group) => onProtectedGroupJoin(group)}
                    />
                )}
                {activeTab == "chats" ? (
                    <CometChatConversations
                        activeConversation={activeItem as Conversation}
                        menu={
                            <div className="chat-menu">
                                <CometChatContextMenu
                                 key="delete-button"
                                 closeOnOutsideClick={true}
                                 placement={Placement.left}
                                 data={getOptions() as CometChatOption[]}
                                 topMenuSize={1}
                                 onOptionClicked={(e: CometChatOption) => {
                                    const { id, onClick } = e;
                                    if (onClick) {
                                        onClick();
                                    }
                                }}
                                />
                            </div>
                        }
                        onItemClick={(e) => {
                            onSelectorItemClicked(e, "updateSelectedItem");
                        }}
                    />
                ) : activeTab == "calls" ? (
                    <CometChatCallLogs
                        activeCall={activeItem as Call}
                        onItemClick={(e: Call) => {
                            onSelectorItemClicked(e, "updateSelectedItemCall");
                        }}
                    />
                ) : activeTab == "users" ? (
                    <CometChatUsers
                        activeUser={activeItem as User}
                        onItemClick={(e) => {
                            onSelectorItemClicked(e, "updateSelectedItemUser");
                        }}
                    />
                ) : activeTab == "groups" ? (
                    <CometChatGroups
                        activeGroup={activeItem as Group}
                        menu={
                            <>
                                <CometChatButton
                                    onClick={() => {
                                        setShowCreateGroup(true);
                                    }}
                                    iconURL={createGroupIcon}
                                />
                            </>
                        }
                        onItemClick={(e) => {
                            onSelectorItemClicked(e, "updateSelectedItemGroup");
                        }}
                    />
                ) : null}
                {showCreateGroup && (
                    <>
                        <CometChatCreateGroup
                            setShowCreateGroup={setShowCreateGroup}
                            onGroupCreated={(group) => onGroupCreated(group)}
                        />
                    </>
                )}
            </>}
        </>
    );
}