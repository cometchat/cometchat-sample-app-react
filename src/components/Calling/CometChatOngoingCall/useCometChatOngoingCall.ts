import { useEffect } from "react";
import { CometChatUIKit } from "../../../CometChatUIKit/CometChatUIKit";

function useCometChatOngoingCall(
    setLoggedInUser: any,
    sessionID: string,
    startCall: any,
) {
    useEffect(
        () => {
            CometChatUIKit.getLoggedinUser().then(
                (user: CometChat.User | null) => {
                    if (user) {
                        setLoggedInUser(user);
                    }
                }
            )
        }, [setLoggedInUser]
    );

    useEffect(
        () => {
            if (sessionID !== "") {
                startCall();

            }
        }, [sessionID, startCall]
    )
}

export { useCometChatOngoingCall };
