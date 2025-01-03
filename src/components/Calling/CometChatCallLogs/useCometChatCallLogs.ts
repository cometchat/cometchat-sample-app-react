/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
// import { CometChatUIKit } from "../../../CometChatUIKit/CometChatUIKit";
import { CometChatUIKitLoginListener } from "../../../CometChatUIKit/CometChatUIKitLoginListener";

function useCometChatCallLogs(
  loggedInUser: CometChat.User | null,
  setLoggedInUser: Function,
  requestBuilder: any,
  setCallBuilder: Function,
  getCallList: Function,
  attachListeners: Function,
  subscribeToEvents: Function,
  detachListeners: Function,
  onErrorCallback: (error: unknown, source?: string | undefined) => void,
) {
  useEffect(() => {
    /**
     * Sets the logged-in user state from the CometChat UIKit login listener.
     */
    setLoggedInUser(CometChatUIKitLoginListener.getLoggedInUser());
  }, [setLoggedInUser, onErrorCallback]);

  useEffect(() => {
    /**
     * Initializes the call builder, fetches the call list, attaches listeners, and subscribes to events when the user logs in.
     *
     * @returns {Function} - Cleanup function to detach listeners when the component unmounts or when the user changes.
    */
    try {
      if (loggedInUser) {
        requestBuilder.current = setCallBuilder();
        getCallList?.();
        attachListeners?.();
        subscribeToEvents?.();
      }
      return () => {
        detachListeners?.();
      };
    } catch (e) {
      onErrorCallback(e, 'useEffect');
    }
  }, [loggedInUser]);
}

export { useCometChatCallLogs };
