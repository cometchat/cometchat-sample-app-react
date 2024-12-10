import { JSX, ReactNode, useCallback, useRef, useState } from "react";
import { useCometChatErrorHandler, useRefSync } from "../../CometChatCustomHooks";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useCometChatMessageHeader } from "./useCometChatMessageHeader";
import { ChatConfigurator } from '../../utils/ChatConfigurator';
import { localize } from '../../resources/CometChatLocalize/cometchat-localize';
import { MessageUtils } from "../../utils/MessageUtils";
import { CometChatListItem } from '../BaseComponents/CometChatListItem/CometChatListItem';
import { CometChatUIKitConstants } from "../../constants/CometChatUIKitConstants";
import { CometChatGroupEvents, IGroupLeft, IGroupMemberAdded, IGroupMemberJoined, IGroupMemberKickedBanned, IOwnershipChanged } from "../../events/CometChatGroupEvents";
/**
 * Interface for the props accepted by the CometChatMessageHeader component.
 */
interface MessageHeaderProps {
    /** Custom subtitle view, allowing you to render a JSX element as the subtitle */
    subtitleView?: JSX.Element,
    /** Disables showing the user's online/offline presence if set to true */

    disableUsersPresence?: boolean,
    /** Disables showing the typing indicator if set to true */

    disableTyping?: boolean,
    /** Custom JSX element for the menu, which can be used for additional options or actions */

    menu?: JSX.Element,
    /** The user object from CometChat, used to show user-specific information (e.g., status) */

    user?: CometChat.User,
    /** The group object from CometChat, used to show group-specific information (e.g., member count) */

    group?: CometChat.Group,
    /** Custom JSX element for rendering a list item view, often used to display user/group details */

    listItemView?: JSX.Element,
    /** Callback function to handle any errors related to CometChat operations */

    onError?: ((error: CometChat.CometChatException) => void) | null,
    /** Callback function triggered when the back action is performed (e.g., navigating to the previous view) */

    onBack?: () => void,

    /** Controls the visibility of the back button. */
    hideBackButton?: boolean,
}

/** Functional component for rendering the CometChatMessageHeader */

export const CometChatMessageHeader = (props: MessageHeaderProps) => {
    /** Destructures props with default values */

    const {
        subtitleView = null,
        disableUsersPresence = false,
        disableTyping = false,
        menu = null,
        user,
        group,
        listItemView = null,
        onError,
        onBack = () => { },
        hideBackButton,
    } = props;

    /** States and ref used in the component */
    const [subtitleText, setSubtitleText] = useState('');
    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
    const userRef = useRefSync(user);
    const groupRef = useRefSync(group);
    const classNameRef = useRef("");
    const onBackRef = useRefSync(onBack);
    const isTypingRef = useRef(false);
    const onErrorCallback = useCometChatErrorHandler(onError);
    const updateSubtitle = useCallback(() => {
        const user = userRef.current;
        const group = groupRef.current;
        if (user && !disableUsersPresence) {
            updateLastActiveInfo(user);
        }
        else if (group) {
            const count = group.getMembersCount();
            const membersText = localize(count > 1 ? "MEMBERS" : "MEMBER");
            setSubtitleText(`${count} ${membersText}`);
        }
    }, [props.user, props.group]);
    const subscribeToEvents = useCallback(() => {
        try {
            const ccGroupMemberAdded = CometChatGroupEvents.ccGroupMemberAdded.subscribe(
                (item: IGroupMemberAdded) => {
                    if (groupRef?.current?.getGuid() === item?.userAddedIn?.getGuid()) {
                        if (item?.usersAdded.length > 0) {
                            item?.usersAdded.forEach(
                                (userAdded: CometChat.User) => {
                                    if (userAdded?.getUid() === loggedInUser?.getUid()) {
                                        groupRef?.current?.setHasJoined(true);
                                    }
                                }
                            )
                        }
                        groupRef?.current?.setMembersCount(item?.userAddedIn?.getMembersCount());
                        updateSubtitle();
                    }
                }
            )
            const ccGroupMemberBanned = CometChatGroupEvents.ccGroupMemberBanned.subscribe(
                (item: IGroupMemberKickedBanned) => {
                    if (groupRef?.current?.getGuid() === item?.kickedFrom?.getGuid()) {
                        if (loggedInUser?.getUid() === item?.kickedUser?.getUid()) {
                            groupRef?.current?.setHasJoined(false);
                        }
                        groupRef?.current?.setMembersCount(item?.kickedFrom?.getMembersCount());
                        updateSubtitle();
                    }
                }
            )
            const ccGroupMemberJoined = CometChatGroupEvents.ccGroupMemberJoined.subscribe(
                (item: IGroupMemberJoined) => {
                    if (groupRef?.current?.getGuid() === item?.joinedGroup?.getGuid()) {
                        if (loggedInUser?.getUid() === item?.joinedUser?.getUid()) {
                            groupRef?.current?.setHasJoined(true);
                        }
                        groupRef?.current?.setMembersCount(item?.joinedGroup?.getMembersCount());
                        updateSubtitle();
                    }
                }
            )
            const ccGroupMemberKicked = CometChatGroupEvents.ccGroupMemberKicked.subscribe(
                (item: IGroupMemberKickedBanned) => {
                    if (groupRef?.current?.getGuid() === item?.kickedFrom?.getGuid()) {
                        if (loggedInUser?.getUid() === item?.kickedUser?.getUid()) {
                            groupRef?.current?.setHasJoined(false);
                        }
                        groupRef?.current?.setMembersCount(item?.kickedFrom?.getMembersCount());
                        updateSubtitle();
                    }
                }
            )
            const ccOwnershipChanged = CometChatGroupEvents.ccOwnershipChanged.subscribe(
                (item: IOwnershipChanged) => {
                    if (groupRef?.current?.getGuid() === item?.group?.getGuid()) {
                        groupRef?.current?.setOwner(item?.group?.getOwner());
                        updateSubtitle();
                    }
                }
            )
            const ccGroupLeft = CometChatGroupEvents.ccGroupLeft.subscribe(
                (item: IGroupLeft) => {
                    if (groupRef?.current?.getGuid() === item?.leftGroup?.getGuid()) {
                        if (loggedInUser?.getUid() === item?.userLeft?.getUid()) {
                            groupRef?.current?.setHasJoined(false);
                        }
                        groupRef?.current?.setMembersCount(item?.leftGroup?.getMembersCount());
                        updateSubtitle();
                    }
                }
            )

            return () => {
                try {
                    ccGroupMemberAdded.unsubscribe();
                    ccGroupMemberBanned.unsubscribe();
                    ccGroupMemberJoined.unsubscribe();
                    ccGroupMemberKicked.unsubscribe();
                    ccOwnershipChanged.unsubscribe();
                    ccGroupLeft.unsubscribe();
                } catch (error: any) {
                    onErrorCallback(error);
                }
            }
        } catch (error: any) {
            onErrorCallback(error);
        }
    }, [groupRef, updateSubtitle, onErrorCallback, loggedInUser]);

    /* The purpose of this function is to update the subtitle text with the user status and last activity. */
    const updateLastActiveInfo = (user: CometChat.User) => {
        if (user.getStatus() === CometChatUIKitConstants.userStatusType.online) {
            setSubtitleText(localize(user.getStatus().toUpperCase()));
        } else {
            if (user.getLastActiveAt()) {
                const date = new Date(user.getLastActiveAt() * 1000);
                const timeDifferenceInMinutes = (new Date().getTime() - date.getTime()) / 1000 / 60
                if (timeDifferenceInMinutes < 60) {
                    const roundedMinutes = Math.ceil(timeDifferenceInMinutes);
                    setSubtitleText(
                        `Last seen ${roundedMinutes} ${roundedMinutes === 1 ? "minute" : "minutes"} ago`
                    );
                } else if (timeDifferenceInMinutes == 60) {
                    setSubtitleText("Last seen 1 hour ago")
                } else {
                    const dateString = date.getDate();
                    const monthString = date.toLocaleString('en-Us', { month: "short" });
                    let timeString: number | string = date.getHours();
                    let postString = "AM";
                    if (timeString > 11) {
                        postString = "PM";
                        timeString = timeString !== 12 ? timeString % 12 : timeString;
                    }
                    if (timeString < 10) {
                        timeString = `0${timeString}`;
                    }
                    setSubtitleText("Last seen " + dateString + " " + monthString + " at " + timeString + ":" + getMinute(date) + postString);
                }
            } else {
                setSubtitleText(localize(user.getStatus().toUpperCase()));
            }
        }
    }

    /* This function retuns the minutes from the given date string. */
    const getMinute = (date: Date) => {
        if (date.getMinutes() < 10) {
            return `0${date.getMinutes()}`;
        } else { return date.getMinutes() };
    };

    /** Updates subtitle text based on user or group status */
    const updateUserStatus = useCallback((userObject: CometChat.User) => {
        const user = userRef.current;
        if (user && !disableUsersPresence) {
            user.setStatus(userObject.getStatus());
            updateLastActiveInfo(user);
        }
    }, [userRef]);
    /** Updates user status and subtitle text */

    const setTypingIndicatorText = useCallback((typing: CometChat.TypingIndicator) => {
        try {
            const sender = typing?.getSender();
            const receiverId = typing?.getReceiverId();
            if (isTypingForCurrentChat(typing)) {
                classNameRef.current = "cometchat-message-header__subtitle-typing";

                if (loggedInUser?.getUid() == receiverId) {
                    let isBlocked = new MessageUtils().getUserStatusVisible(userRef?.current);
                    if (isBlocked) {
                        return;
                    }
                    isTypingRef.current = true;
                    setSubtitleText(localize("TYPING"));
                }
                if (groupRef?.current?.getGuid() === receiverId) {
                    isTypingRef.current = true;
                    setSubtitleText(`${sender?.getName()}: ${localize("TYPING")}`);
                }
            }

        } catch (error: any) {
            onErrorCallback(error);
        }
    }, [userRef, groupRef, onErrorCallback, loggedInUser]);

    /** Sets the typing indicator text */

    const isTypingForCurrentChat = (typing: CometChat.TypingIndicator) => {
        const sender = typing?.getSender();
        const receiverId = typing?.getReceiverId();
        return sender?.getUid() === userRef?.current?.getUid() && loggedInUser?.getUid() === receiverId || (groupRef.current && groupRef.current.getGuid() == receiverId);
    }
    /** Checks if the typing indicator corresponds to the current chat */

    const attachListeners = useCallback(() => {
        const userListenerId = "userList_" + Date.now();
        const groupsListenerId = "groupsList_" + Date.now();
        const connectionListenerId = "connection_" + Date.now();
        const messagelistenerId = `CometChatHeaderMessage__${new Date().getTime()}`;

        if (!disableUsersPresence) {
            CometChat.addUserListener(
                userListenerId,
                new CometChat.UserListener({
                    onUserOnline: (onlineUser: CometChat.User) => {
                        if (userRef.current?.getUid() === onlineUser.getUid()) {
                            updateUserStatus(onlineUser);
                        }
                    },
                    onUserOffline: (offlineUser: CometChat.User) => {
                        if (userRef.current?.getUid() === offlineUser?.getUid()) {
                            updateUserStatus(offlineUser);
                        }
                    },
                })
            );
        }
        if (!disableTyping) {
            CometChat.addMessageListener(messagelistenerId, new CometChat.MessageListener({
                onTypingStarted: (typingIndicator: CometChat.TypingIndicator) => {
                    setTypingIndicatorText(typingIndicator);
                },
                onTypingEnded: (typingIndicator: CometChat.TypingIndicator) => {
                    if (typingIndicator && isTypingForCurrentChat(typingIndicator)) {
                        isTypingRef.current = false;
                        classNameRef.current = "";
                        updateSubtitle();
                    }
                },
            }))

        }
        CometChat.addGroupListener(
            groupsListenerId,
            new CometChat.GroupListener({
                onGroupMemberScopeChanged: (message: CometChat.Action, changedUser: CometChat.User, newScope: CometChat.GroupMemberScope, oldScope: CometChat.GroupMemberScope, changedGroup: CometChat.Group) => {
                    if (groupRef.current?.getGuid() === changedGroup?.getGuid() && changedUser.getUid() === loggedInUser?.getUid()) {
                        groupRef.current?.setScope(newScope);
                    }
                    updateSubtitle();
                },
                onGroupMemberKicked: (message: CometChat.Action, kickedUser: CometChat.User, kickedBy: CometChat.User, kickedFrom: CometChat.Group) => {
                    if (groupRef.current?.getGuid() === kickedFrom?.getGuid()) {
                        if (kickedUser.getUid() === loggedInUser?.getUid()) {
                            groupRef.current?.setHasJoined(false);
                        }
                        groupRef.current?.setMembersCount(kickedFrom?.getMembersCount());
                        updateSubtitle();
                    }
                },
                onMemberAddedToGroup: (message: CometChat.Action, userAdded: CometChat.User, userAddedBy: CometChat.User, userAddedIn: CometChat.Group) => {
                    if (groupRef.current?.getGuid() === userAddedIn.getGuid()) {
                        if (userAdded.getUid() === loggedInUser?.getUid()) {
                            groupRef.current?.setHasJoined(true);
                        }
                        groupRef.current?.setMembersCount(userAddedIn?.getMembersCount());
                        updateSubtitle();
                    }
                },
                onGroupMemberLeft: (message: CometChat.Action, leavingUser: CometChat.User, groupObject: CometChat.Group) => {
                    if (groupRef.current?.getGuid() === groupObject.getGuid()) {
                        if (leavingUser.getUid() === loggedInUser?.getUid()) {
                            groupRef.current?.setHasJoined(false);
                        }
                        groupRef.current?.setMembersCount(groupObject.getMembersCount());
                        updateSubtitle();
                    }
                },
                onGroupMemberJoined: (message: CometChat.Action, joinedUser: CometChat.User, joinedGroup: CometChat.Group) => {
                    if (groupRef.current?.getGuid() === joinedGroup.getGuid()) {
                        if (joinedUser.getUid() === loggedInUser?.getUid()) {
                            groupRef.current?.setHasJoined(true);
                        }
                        groupRef.current?.setMembersCount(joinedGroup.getMembersCount());
                        updateSubtitle();
                    }
                },
                onGroupMemberBanned: (message: CometChat.Action, bannedUser: CometChat.User, bannedBy: CometChat.User, bannedFrom: CometChat.Group) => {
                    if (groupRef.current?.getGuid() === bannedFrom.getGuid()) {
                        if (bannedUser.getUid() === loggedInUser?.getUid()) {
                            groupRef.current?.setHasJoined(false);
                        }
                        groupRef.current?.setMembersCount(bannedFrom.getMembersCount());
                        updateSubtitle();
                    }
                }
            })
        );
        CometChat.addConnectionListener(
            connectionListenerId,
            new CometChat.ConnectionListener({
                onConnected: () => {
                    console.log("ConnectionListener => On Connected");
                },

            })
        );
        return () => {
            CometChat.removeUserListener(userListenerId);
            CometChat.removeGroupListener(groupsListenerId);
            CometChat.removeConnectionListener(connectionListenerId);
        };
    }, [userRef, groupRef, updateUserStatus, disableTyping, updateSubtitle, setTypingIndicatorText, loggedInUser, disableUsersPresence]);
    /** 
     * Retrieves the subtitle view for the message header. 
     * If a custom subtitle view is provided, it returns that. 
     * Otherwise, it checks if the user is blocked and returns a default subtitle if not blocked.
     */
    const getSubtitleView = useCallback(() => {
        if (subtitleView) {
            return subtitleView;
        }
        let userBlockedFlag = new MessageUtils().getUserStatusVisible(userRef.current);
        return !userBlockedFlag ? (
            <div className={`cometchat-message-header__subtitle ${classNameRef.current ?? ""}`}>
                {subtitleText}
            </div>
        ) : null;
    }, [userRef, subtitleView, subtitleText]);
    /** 
     * Retrieves the list item view for the message header. 
     * If a custom list item view is provided, it returns that. 
     * Otherwise, it creates a default list item with the user's or group's information.
     */
    const getListItemView = useCallback(() => {
        if (listItemView) {
            return listItemView;
        } else {
            return (
                <CometChatListItem avatarName={userRef.current?.getName() || groupRef.current?.getName()}
                    avatarURL={userRef.current?.getAvatar() || groupRef.current?.getIcon() || ""}
                    title={userRef.current?.getName() || groupRef.current?.getName() || ""} subtitleView={getSubtitleView()} />
            )
        }
    }, [userRef, groupRef, listItemView, getSubtitleView]);
    /** 
     * Generates the back button for the message header. 
     * Currently, it returns an empty div but can be extended with back button functionality.
     */
    const getBackButton = () => {
        
        if (hideBackButton) return null;

        return (
            <div onClick={()=>{
                if(onBack){
                    onBack()
                }
            }} className="cometchat-message-header__back-button">
            </div>
        );
    };
    /** 
     * Retrieves the menu for the message header. 
     * Combines the auxiliary header menu and the provided menu into a single menu component.
     */
    const getMenu = useCallback(() => {
        return (
            <div className="cometchat-message-header__menu">
                {ChatConfigurator.getDataSource().getAuxiliaryHeaderMenu(userRef.current, groupRef.current) as ReactNode}
                {menu}
            </div>
        );

    }, [menu]);

    useCometChatMessageHeader(
        loggedInUser,
        setLoggedInUser,
        attachListeners,
        userRef,
        groupRef,
        updateSubtitle,
        subscribeToEvents

    )

    return (
        <div className="cometchat" style={{
            height:"fit-content",
            width: "100%",
            display: "flex"
        }}>
            <div className="cometchat-message-header">
                <div>
                    {getBackButton()}
                    <div className="cometchat-message-header__listitem">
                        {getListItemView()}
                    </div>
                </div>
                {getMenu() as Element & Element[] & ReactNode}
            </div>
        </div>

    );
}
