import "./index.css";
import "@cometchat/uikit-elements";

import { App } from "./components/App";
import { AppConstants } from "./AppConstants";
import {CometChat} from '@cometchat/chat-sdk-javascript'
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import ReactDOM from "react-dom/client";
import { UIKitSettingsBuilder } from '@cometchat/uikit-shared';
import { metaInfo } from "./metaInfo";

(async () => {
  const uiKitSettings = new UIKitSettingsBuilder()
  .setAppId(AppConstants.APP_ID)
  .setRegion(AppConstants.REGION)
  .setAuthKey(AppConstants.AUTH_KEY)
  .subscribePresenceForAllUsers()
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
