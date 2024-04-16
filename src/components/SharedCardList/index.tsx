import { CometChatThemeContext } from "@cometchat/chat-uikit-react";
import { ResourcesCardList } from "../ResourcesCardList";
import { ViewsCardList } from "../ViewsCardList";
import { fontHelper } from "@cometchat/uikit-resources";
import { useContext } from "react";

export function SharedCardList() {
    const { theme } = useContext(CometChatThemeContext);

    return (
        <div
            style = {{
                display: "flex",
                flexDirection: "column",
                rowGap: "16px",
                height: "100%",
                paddingBottom: "16px",
                boxSizing: "border-box"
            }}
        >
            <div
                style = {{
                    font: fontHelper(theme.typography.heading),
                    color: theme.palette.getAccent(),
                    textTransform: "capitalize",
                    height: "22px"
                }}
            >
                Shared
            </div>
            <div
                style = {{
                    height: "calc(100% - 22px)",
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "16px"
                }}
            >
                <div>
                    <ResourcesCardList />
                </div>
                <div>
                    <ViewsCardList />
                </div>
            </div>
        </div>
    );
}
