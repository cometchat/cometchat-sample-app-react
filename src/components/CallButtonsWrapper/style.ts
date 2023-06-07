import { CSSProperties } from "react";
import { CometChatTheme } from "@cometchat/uikit-resources";
import { CallButtonsStyle } from "@cometchat/uikit-shared";

export function callButtonsWrapperStyle(theme : CometChatTheme) : CSSProperties {
    return {
        width: "100%",
        height: "100%",
        background: theme.palette.getBackground(),
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };
}

export function callButtonsStyle() : CallButtonsStyle {
    return {
        width: "fit-content",
        height: "fit-content"
    };
}
