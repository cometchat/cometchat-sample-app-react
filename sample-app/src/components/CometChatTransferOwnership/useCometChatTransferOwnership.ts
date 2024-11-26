import { CometChat } from "@cometchat/chat-sdk-javascript";
import React, { useEffect } from "react";

type Args = {
    errorHandler : (error : unknown) => void,
    setLoggedInUser : React.Dispatch<React.SetStateAction<CometChat.User | null>>
};

export function useCometChatTransferOwnership(args : Args) {
    const {
        errorHandler,
        setLoggedInUser
    } = args;

    useEffect(
        /**
         * Sets `loggedInUser` state to the currently logged-in user
         */
        () => {
            (async () => {
                try {
                    setLoggedInUser(await CometChat.getLoggedinUser());
                }
                catch(error) {
                    errorHandler(error);
                }
            })();
    }, [errorHandler, setLoggedInUser]);
}
