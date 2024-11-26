
import { Subject } from 'rxjs';
import { CometChat } from '@cometchat/chat-sdk-javascript';

/**
 * Call event subjects for handling various call-related actions (like outgoing calls, call acceptance, rejections, etc.)
 */
export class CometChatCallEvents {
    static ccOutgoingCall: Subject<CometChat.Call> = new Subject<CometChat.Call>();
    static ccCallAccepted: Subject<CometChat.Call> = new Subject<CometChat.Call>();
    static ccCallRejected: Subject<CometChat.Call> = new Subject<CometChat.Call>();
    static ccCallEnded: Subject<CometChat.Call> = new Subject<CometChat.Call>();
}