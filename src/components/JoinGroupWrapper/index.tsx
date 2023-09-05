import { useContext, useEffect, useRef } from "react";

import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatThemeContext } from "@cometchat/chat-uikit-react";
import { joinGroupStyle } from "./style";
import { useNavigate } from "react-router-dom";

export function JoinGroupWrapper() {
    const joinGroupRef = useRef<JSX.IntrinsicElements["cometchat-join-group"] | null>(null);
    const navigate = useNavigate();
    const { theme } = useContext(CometChatThemeContext); 

    useEffect(() => {
        const joinGroupElement = joinGroupRef.current;
        if (!joinGroupElement) {
            return;
        }
        const handleEvent = (group : CometChat.Group | undefined, password : string) => {
            console.log("Group:", group);
            console.log("Entered password:", password);
            navigate("/home/groups-module");
        };
        joinGroupElement.joinClick = handleEvent;
        return () => {
            joinGroupElement.joinClick = null;
        };
    }, [navigate]);

    return (
        <cometchat-join-group
            ref = {joinGroupRef}
            joinGroupStyle = {JSON.stringify(joinGroupStyle(theme))}
        />
    );
}
