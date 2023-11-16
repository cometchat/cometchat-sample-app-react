import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./components/App";
import { CometChatConstants } from "./constants"; 
import "@cometchat/uikit-elements";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { UIKitSettingsBuilder } from '@cometchat/uikit-shared';
import {CometChat} from '@cometchat/chat-sdk-javascript'
import { metaInfo } from "./metaInfo";
(async () => {
  const uiKitSettings = new UIKitSettingsBuilder()
  .setAppId(CometChatConstants.appId)
  .setRegion(CometChatConstants.region)
  .setAuthKey(CometChatConstants.authKey)
  .subscribePresenceForFriends()
  .build();
  try {
    await CometChatUIKit.init(uiKitSettings);
    try{CometChat.setDemoMetaInfo(metaInfo)}catch(err){}
    console.log("Initialization completed successfully");
    const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
    root.render(<App />);
  }
  catch(error) {
    console.log("Initialization failed with error:", error);
  }
})();
