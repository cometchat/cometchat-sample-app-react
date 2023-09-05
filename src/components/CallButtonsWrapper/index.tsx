import { CometChatCallButtons, CometChatThemeContext } from "@cometchat/chat-uikit-react";
import { callButtonsStyle, callButtonsWrapperStyle } from "./style";
import { useContext, useEffect, useState } from "react";

import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useNavigate } from "react-router-dom";

type CallButtonsWrapperProps = { setSomeInterestingAsyncOpStarted : React.Dispatch<React.SetStateAction<boolean>> };

export function CallButtonsWrapper(props : CallButtonsWrapperProps) {
    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
    const navigate = useNavigate();
    const { theme } = useContext(CometChatThemeContext);
    const { setSomeInterestingAsyncOpStarted, ...otherProps } = props;
    
    function handleClick(message : string) {
        console.log(message);
        navigate("/home/calls-module");
    }

    useEffect(() => {
        (async () => {
            try {
                setSomeInterestingAsyncOpStarted(true);
                setLoggedInUser(await CometChat.getLoggedinUser());
            }
            catch(error) {
                console.log(error);
            }
            finally {
                setSomeInterestingAsyncOpStarted(false);
            }
        })();
    }, [setSomeInterestingAsyncOpStarted]);

    return (
        <div
            style = {callButtonsWrapperStyle(theme)}
        >
            <CometChatCallButtons
                user = {loggedInUser ?? undefined} 
                onVoiceCallClick = {() => handleClick("Voice call button clicked")}
                onVideoCallClick = {() => handleClick("Video call button clicked")}
                callButtonsStyle = {callButtonsStyle()}
                {...otherProps}
            />
        </div>
    );
}