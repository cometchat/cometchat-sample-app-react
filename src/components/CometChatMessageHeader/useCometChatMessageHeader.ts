import React, { useEffect } from "react";
import { CometChatUIKitLoginListener } from "../../CometChatUIKit/CometChatUIKitLoginListener";

function useCometChatMessageHeader(
    loggedInUser: CometChat.User | null,
    setLoggedInUser: Function,
    attachListeners: Function,
    userRef: React.MutableRefObject<CometChat.User | undefined>,
    groupRef: React.MutableRefObject<CometChat.Group | undefined>,
    updateSubtitle: Function,
    subscribeToEvents: Function,
    user?: CometChat.User, group?: CometChat.Group,

) {
    /** 
   * Effect to set the secondary class when either user or group changes.
   */
    useEffect(() => {
        setLoggedInUser(CometChatUIKitLoginListener.getLoggedInUser())
    }, [user, group]);

    /** 
       * Effect to attach event listeners when the logged-in user changes.
       * It ensures to remove listeners on cleanup.
       */
    useEffect(() => {
        const removeListenerFns: (() => void)[] = [];
        if (loggedInUser) {
            removeListenerFns.push(subscribeToEvents());

            removeListenerFns.push(attachListeners());
        }
        return () => {
            for (let i = 0; i < removeListenerFns.length; i++) {
                return removeListenerFns[i]();
            }
        }
    }, [loggedInUser, attachListeners,subscribeToEvents]);

    /** 
       * Effect to update the subtitle whenever the user or group reference changes.
       */
    useEffect(() => {
        updateSubtitle();
    }, [userRef.current, groupRef.current, updateSubtitle])
}

export { useCometChatMessageHeader };
