import { CometChat } from "@cometchat/chat-sdk-javascript";
import React, { useEffect } from "react";

function useCallButtons(
    loggedInUser: any,
    setLoggedInUser: Function,
    user: any,
    group: any,
    onErrorCallback: Function,
    attachListeners: Function,
    removeListener: Function,
    setActiveUser: any,
    setActiveGroup: any,
    initiateAudioCall: Function,
    initiateVideoCall: Function,
    onVoiceCallClickRef: React.MutableRefObject<Function | undefined>,
    onVideoCallClickRef: React.MutableRefObject<Function | undefined>,
    subscribeToEvents: Function,

) {
    useEffect(
        () => {
            CometChat.getLoggedinUser().then(
                (user: CometChat.User | null) => {
                    if (user) {
                        setLoggedInUser(user);
                    }
                }, (error: CometChat.CometChatException) => {
                    onErrorCallback(error);
                }
            );
        }, [setLoggedInUser, onErrorCallback]
    )

    useEffect(() => {
        let unsubscribeFromEvents: () => void;
        if (loggedInUser) {
            unsubscribeFromEvents = subscribeToEvents();
            attachListeners();
        }
        return () => {
            unsubscribeFromEvents?.();
            removeListener();
        }
    }, [loggedInUser, attachListeners, removeListener, subscribeToEvents])

    useEffect(
        () => {
            if (user) {
                setActiveUser(user);
                setActiveGroup(null);
            }
        }, [user, setActiveUser, setActiveGroup]
    )

    useEffect(
        () => {
            if (group) {
                setActiveUser(null);
                setActiveGroup(group);
            }
        }, [group, setActiveUser, setActiveGroup]
    )

    const audioCallButtonClicked = () => {
        const onVoiceCallClick = onVoiceCallClickRef.current;
        if (onVoiceCallClick) {
            onVoiceCallClick();
        }
        else {
            initiateAudioCall();
        }
    }

    const videoCallButtonClicked = () => {
        const onVideoCallClick = onVideoCallClickRef.current;
        if (onVideoCallClick) {
            onVideoCallClick();
        }
        else {
            initiateVideoCall();
        }
    }

    return {
        audioCallButtonClicked,
        videoCallButtonClicked
    }

}

export { useCallButtons };