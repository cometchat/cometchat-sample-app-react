import {CometChatThemeContext, fontHelper} from "@cometchat/chat-uikit-react"

import { useContext } from "react";
export function senderBubbleStyle() {
    const { theme } = useContext(CometChatThemeContext);
    return {
        borderRadius:"8px",
        background:theme.palette.getPrimary(),
        textFont: fontHelper(theme.typography.text2),
        textColor: theme.palette.getAccent("dark"),
    };
}

export function receiverBubbleStyle() {
    const { theme } = useContext(CometChatThemeContext);
    return {
        borderRadius:"8px",
        background:theme.palette.getAccent200(),
        textFont: fontHelper(theme.typography.text2),
        textColor: theme.palette.getAccent(),
    };
}