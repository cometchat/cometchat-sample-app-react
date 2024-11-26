import { CometChatUIKitCalls } from "../../CometChatUIKit/CometChatCalls";
import { CallButtonConfiguration } from "./CallButtonConfiguration";

export class CallingConfiguration {
    public groupCallSettingsBuilder?: (message: CometChat.CustomMessage) => typeof CometChatUIKitCalls.CallSettingsBuilder;
    callButtonConfiguration?: CallButtonConfiguration = new CallButtonConfiguration({})
    constructor(configuration?: CallingConfiguration) {
        this.groupCallSettingsBuilder = configuration?.groupCallSettingsBuilder;
        this.callButtonConfiguration = configuration?.callButtonConfiguration;
    }
}
