import { CometChat } from "@cometchat/chat-sdk-javascript";
import { SelectionMode } from "@cometchat/chat-uikit-react";
import React, { useEffect } from "react";

type Args = {
    loggedInUserRef : React.MutableRefObject<CometChat.User | null>,
    errorHandler : (error : unknown) => void,
    selectionMode : SelectionMode,
    selectionModeRef : React.MutableRefObject<SelectionMode>,
    membersToAddRef : React.MutableRefObject<CometChat.GroupMember[]>
};

export function useCometChatAddMembers(args : Args) {
    const {
        loggedInUserRef,
        errorHandler,
        selectionMode,
        selectionModeRef,
        membersToAddRef
    } = args;

    useEffect(() => {
        if (selectionModeRef.current !== selectionMode) {
            selectionModeRef.current = selectionMode;
            membersToAddRef.current = [];
        }
    }, [selectionMode, membersToAddRef, selectionModeRef]);

    useEffect(
        /**
         * Sets `loggedInUserRef` to the currently logged-in user
         */
        () => {
            (async () => {
                try {
                    loggedInUserRef.current = await CometChat.getLoggedinUser();
                }
                catch(error) {
                    errorHandler(error);
                }
            })();
    }, [errorHandler, loggedInUserRef]);
}
