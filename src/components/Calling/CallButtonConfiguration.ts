import { CometChatUIKitCalls } from "../../CometChatUIKit/CometChatCalls";
import { OutgoingCallConfiguration } from "./OutgoingCallConfiguration";

export class CallButtonConfiguration {
    public callSettingsBuilder?: (isAudioOnlyCall: boolean, user?: CometChat.User, group?: CometChat.Group) => typeof CometChatUIKitCalls.CallSettingsBuilder;
    onVoiceCallClick?: () => void;
    onVideoCallClick?: () => void;
    onError?: ((error: CometChat.CometChatException) => void) | null;
    public outgoingCallConfiguration?: OutgoingCallConfiguration = new OutgoingCallConfiguration({})
    constructor(configuration?: CallButtonConfiguration) {
        this.callSettingsBuilder = configuration?.callSettingsBuilder;
        this.onVoiceCallClick = configuration?.onVoiceCallClick;
        this.onVideoCallClick = configuration?.onVideoCallClick;
        this.onError = configuration?.onError;
        this.outgoingCallConfiguration = configuration?.outgoingCallConfiguration;
    }
}
