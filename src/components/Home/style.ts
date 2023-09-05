import { CometChatTheme, fontHelper } from "@cometchat/uikit-resources";
import { ListStyle } from "@cometchat/uikit-shared";

export function listStyle(theme : CometChatTheme) : ListStyle {
    return {
        background: theme.palette.getBackground(),
        titleTextFont: fontHelper(theme.typography.heading),
        titleTextColor: theme.palette.getAccent()
    };
}
