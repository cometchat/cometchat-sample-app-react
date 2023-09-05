import {
  CometChatMessageBubble,
  CometChatMessageInformation,
  CometChatPalette,
  CometChatTheme,
  CometChatThemeContext,
  MessageBubbleAlignment,
  fontHelper,
} from "@cometchat/chat-uikit-react";
import { useContext, useMemo } from "react";

import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useLocation } from "react-router-dom";

export function MessageInformationWrapper() {
  const { state } = useLocation();
  const changeThemeToCustom = state?.changeThemeToCustom;
  const { theme } = useContext(CometChatThemeContext);

  const themeContext = useMemo(() => {
    let res = theme;
    if (changeThemeToCustom) {
      res = new CometChatTheme({
        palette: new CometChatPalette({
          mode: theme.palette.mode,
          primary: {
            light: "#D422C2",
            dark: "#D422C2",
          },
          accent: {
            light: "#07E676",
            dark: "#B6F0D3",
          },
          accent50: {
            light: "#39f",
            dark: "#141414",
          },
          accent900: {
            light: "white",
            dark: "black",
          },
        }),
      });
    }
    return { theme: res };
  }, [theme, changeThemeToCustom]);
  const getContentView = (message: CometChat.TextMessage) => {
    return (
      <cometchat-text-bubble
        text={message?.getText()}
        textStyle={JSON.stringify({
          textFont: fontHelper(theme.typography.text3),
          textColor: theme.palette.getAccent("dark"),
        })}
      ></cometchat-text-bubble>
    );
  };
  const getBubbleView = (item: CometChat.BaseMessage) => {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          padding: "8px",
          background: "inherit",
          boxSizing: "border-box",
        }}
      >
        <CometChatMessageBubble
          leadingView={null}
          footerView={null}
          headerView={null}
          bottomView={null}
          contentView={getContentView(item as CometChat.TextMessage)}
          id={item?.getId() || item?.getMuid()}
          messageBubbleStyle={{
            background: theme.palette.getPrimary(),
            border: `none`,
            borderRadius: "12px",
          }}
          alignment={MessageBubbleAlignment.right}
          replyView={null}
          threadView={null}
          options={[]}
        ></CometChatMessageBubble>
      </div>
    );
  };
  const messageObject: any = {
    getReceiver: () => {
      return {
        getAvatar: () =>
          "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
        getBlockedByMe: () => false,
        getDeactivatedAt: () => 0,
        getHasBlockedMe: () => false,
        getLastActiveAt: () => 1693306209,
        getName: () => "Iron Man",
        getRole: () => "default",
        getStatus: () => "online",
        getUid: () => "superhero2",
      };
    },
    getSender: () => {
      return {
        getAvatar: () =>
          "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
        getBlockedByMe: () => false,
        getDeactivatedAt: () => 0,
        getHasBlockedMe: () => false,
        getLastActiveAt: () => 1693306209,
        getName: () => "Iron Man",
        getRole: () => "default",
        getStatus: () => "online",
        getUid: () => "superhero1",
      };
    },
    getConversationId: () => "conversationId1234",
    getText: () => "Hello, how are you.",
    getSentAt: () => 1693322055785,
    getReadAt: () => 1693322055785,
    getDeliveredAt: () => 1693322055765,
    getReceiverType: () => "user",
    getReceiverId: () => "superhero2",
    getId: () => 1234,
    getType: () => "text",
    getCategory: () => "message",
  };
  return (
    <CometChatThemeContext.Provider value={themeContext}>
      <CometChatMessageInformation
        message={messageObject as CometChat.BaseMessage}
        bubbleView={(message: CometChat.BaseMessage) => getBubbleView(message)}
      />
    </CometChatThemeContext.Provider>
  );
}
