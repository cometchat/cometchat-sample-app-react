import React, { useEffect } from "react";
import { CometChatUIKitLoginListener } from "../../CometChatUIKit/CometChatUIKitLoginListener";
import { CometChatUIEvents, IActiveChatChanged } from "../../events/CometChatUIEvents";

function useCometChatMessageHeader(
    loggedInUser: CometChat.User | null,
    setLoggedInUser: Function,
    attachListeners: Function,
    userRef: React.MutableRefObject<CometChat.User | undefined>,
    groupRef: React.MutableRefObject<CometChat.Group | undefined>,
    updateSubtitle: Function,
    subscribeToEvents: Function,
    onErrorCallback: (error: unknown, source?: string | undefined) => void,
    user?: CometChat.User, group?: CometChat.Group,
    enableAutoSummaryGeneration?:boolean,
    loadConversationSummary?:Function,
) {
    /** 
   * Effect to set the secondary class when either user or group changes.
   */
    useEffect(() => {
        try {
            setLoggedInUser(CometChatUIKitLoginListener.getLoggedInUser())
        } catch (error) {
            onErrorCallback(error, 'useEffect');
        }
    }, [user, group]);
        /** 
   * Use Effect to fetch conversation summary on message list loading.
   */
        useEffect(() => {
            try {
                let activeChatChanged = CometChatUIEvents.ccActiveChatChanged.subscribe((activeChat:IActiveChatChanged)=>{
                    if(activeChat.unreadMessageCount && activeChat.unreadMessageCount >= 15 && loadConversationSummary && enableAutoSummaryGeneration){
                     loadConversationSummary();
                    }
                })
                return()=> activeChatChanged?.unsubscribe();
            } catch (error) {
                onErrorCallback(error, 'useEffect');
            }
        }, [user, group,enableAutoSummaryGeneration]);

    /** 
       * Effect to attach event listeners when the logged-in user changes.
       * It ensures to remove listeners on cleanup.
       */
    useEffect(() => {
        try {
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
        } catch (error) {
            onErrorCallback(error, 'useEffect');
        }
    }, [loggedInUser, attachListeners, subscribeToEvents]);

    /** 
       * Effect to update the subtitle whenever the user or group reference changes.
       */
    useEffect(() => {
        updateSubtitle();
    }, [userRef.current, groupRef.current, updateSubtitle])
}

export { useCometChatMessageHeader };
