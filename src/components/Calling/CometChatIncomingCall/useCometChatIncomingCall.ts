import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useEffect } from "react";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";

function useCometChatIncomingCall(
    loggedInUser: any,
    setLoggedInUser: any,
    call: CometChat.Call,
    attachListeners: Function,
    removeListener: Function,
    acceptCallButtonRef: any,
    rejectCallButtonRef: any,
    showCall: any,
    callRef: any,
    acceptIncomingCall: Function,
    rejectIncomingCall: Function,
    showIncomingCallScreen: boolean,
    subscribeToEvents: Function,
    errorHandler:(error: unknown, source?: string) => void

) {
    useEffect(
        () => {
         try {
            CometChat.getLoggedinUser().then(
                (user: CometChat.User | null) => {
                    if (user) {
                        setLoggedInUser(user);
                    }
                }
            ).catch((error)=>{
            errorHandler(error,"getLoggedinUser")
            })
         } catch (error) {
            errorHandler(error,"useEffect")

         }
        }, [setLoggedInUser]
    );

    useEffect(
        () => {
       try {
        let unsubscribeFromEvents: () => void;
        if (loggedInUser) {
            unsubscribeFromEvents = subscribeToEvents();

            attachListeners();
        }
        return () => {
            removeListener();
            unsubscribeFromEvents?.();
        }
       } catch (error) {
        errorHandler(error,"useEffect")

       }
        }, [loggedInUser, attachListeners, removeListener]
    )

    useEffect(
        () => {
            try {
                if (call) {
                    callRef.current = call;
                    showCall(callRef.current);
                }   
            } catch (error) {
                errorHandler(error,"useEffect")

            }
        }, [call, callRef, showCall]
    )

    useEffect(
        () => {try {
            
            const acceptCallButton = acceptCallButtonRef?.current;
            const rejectCallButton = rejectCallButtonRef?.current;

            if (!acceptCallButton && !rejectCallButton) return;

            const acceptCall = () => {
                acceptIncomingCall();
            }
            const rejectCall = () => {
                rejectIncomingCall(CometChatUIKitConstants.calls.rejected);
            }

            if (showIncomingCallScreen) {
                acceptCallButton?.addEventListener("cc-button-clicked", acceptCall);
                rejectCallButton?.addEventListener("cc-button-clicked", rejectCall);
            } else {
                acceptCallButton?.removeEventListener("cc-button-clicked", acceptCall);
                rejectCallButton?.removeEventListener("cc-button-clicked", rejectCall);
            }
            return () => {
                acceptCallButton?.removeEventListener("cc-button-clicked", acceptCall);
                rejectCallButton?.removeEventListener("cc-button-clicked", rejectCall);
            }
        } catch (error) {
            errorHandler(error,"useEffect")

        }
        }, [showIncomingCallScreen, acceptIncomingCall, rejectIncomingCall, acceptCallButtonRef, rejectCallButtonRef]
    );

}

export { useCometChatIncomingCall };