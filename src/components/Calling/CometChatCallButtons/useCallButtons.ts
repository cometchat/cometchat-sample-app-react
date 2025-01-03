import { CometChat } from "@cometchat/chat-sdk-javascript";
import React, { useEffect } from "react";

function useCallButtons(
    loggedInUser: any,
    setLoggedInUser: Function,
    user: any,
    group: any,
    errorHandler: Function,
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
     try {
        CometChat.getLoggedinUser().then(
            (user: CometChat.User | null) => {
                if (user) {
                    setLoggedInUser(user);
                }
            }, (error: CometChat.CometChatException) => {
                errorHandler(error,"getLoggedinUser")
            }
        );
     } catch (error) {
        errorHandler(error,"getLoggedinUser")
     }
        }, [setLoggedInUser]
    )

    useEffect(() => {
   try {
    let unsubscribeFromEvents: () => void;
    if (loggedInUser) {
        unsubscribeFromEvents = subscribeToEvents();
        attachListeners();
    }
    return () => {
        unsubscribeFromEvents?.();
        removeListener();
    }
   } catch (error) {
    errorHandler(error,"useEffect")
   }
    }, [loggedInUser, attachListeners, removeListener, subscribeToEvents])

    useEffect(() => {
        try {
            if (user) {
                setActiveUser(user);
                setActiveGroup(null);
            }
        } catch (error) {
            errorHandler(error, "setActiveUser");
        }
    }, [user, setActiveUser, setActiveGroup]);

    useEffect(() => {
        try {
            if (group) {
                setActiveUser(null);
                setActiveGroup(group);
            }
        } catch (error) {
            errorHandler(error, "setActiveGroup");
        }
    }, [group, setActiveUser, setActiveGroup]);

    const audioCallButtonClicked = () => {
        try {
            const onVoiceCallClick = onVoiceCallClickRef.current;
            if (onVoiceCallClick) {
                onVoiceCallClick();
            } else {
                initiateAudioCall();
            }
        } catch (error) {
            errorHandler(error, "audioCallButtonClicked");
        }
    };

    const videoCallButtonClicked = () => {
        try {
            const onVideoCallClick = onVideoCallClickRef.current;
            if (onVideoCallClick) {
                onVideoCallClick();
            } else {
                initiateVideoCall();
            }
        } catch (error) {
            errorHandler(error, "videoCallButtonClicked");
        }
    };

    return {
        audioCallButtonClicked,
        videoCallButtonClicked
    }

}

export { useCallButtons };