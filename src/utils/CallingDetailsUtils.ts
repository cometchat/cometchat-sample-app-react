import { CometChatUIKitConstants } from "../constants/CometChatUIKitConstants"
import { localize } from "../resources/CometChatLocalize/cometchat-localize"

/**
 * Utility class for handling call-related details in CometChat.
 * It is used in CallingExtensionDecorator component.
 */
export class CallingDetailsUtils {

  /**
   * Retrieves the default message types used in calling.
   * 
   * @returns {string[]} An array of default message types for audio, video, and meeting calls.
   */
  static getDefaultMessageTypes = () => {
    return [CometChatUIKitConstants.MessageTypes.audio, CometChatUIKitConstants.MessageTypes.video, CometChatUIKitConstants.calls.meeting]
  }

  /**
   * Retrieves the default categories associated with calling.
   * 
   * @returns {string[]} An array of default message categories for calls and custom messages.
   */
  static getDefaultCategories = () => {
    return [CometChatUIKitConstants.MessageCategory.call, CometChatUIKitConstants.MessageCategory.custom]
  }

  /**
   * Checks if the call was sent by the logged-in user.
   * 
   * @param {CometChat.Call} call - The call object.
   * @param {CometChat.User} loggedInUser - The logged-in user object.
   * @returns {boolean} True if the call was sent by the logged-in user, otherwise false.
   */
  static isSentByMe(call: CometChat.Call, loggedInUser: CometChat.User) {
    const senderUid: string = call.getSender()?.getUid();
    return !senderUid || senderUid === loggedInUser?.getUid();
  }

  /**
  * Checks if the call is a missed call for the logged-in user.
  * 
  * @param {CometChat.Call} call - The call object.
  * @param {CometChat.User} loggedInUser - The logged-in user object.
  * @returns {boolean} True if the call is missed, otherwise false.
  */
  static isMissedCall(call: CometChat.Call, loggedInUser: CometChat.User) {
    const senderUid: string = call.getCallInitiator()?.getUid();
    const callStatus: string = call.getStatus();
    if (!senderUid || senderUid === loggedInUser?.getUid()) {
      return false;
    } else {
      return [CometChatUIKitConstants.calls.busy, CometChatUIKitConstants.calls.unanswered, CometChatUIKitConstants.calls.cancelled].includes(callStatus);
    }
  }

  /**
   * Retrieves the localized call status message based on the call status and the user.
   * 
   * @param {CometChat.Call} call - The call object.
   * @param {CometChat.User} loggedInUser - The logged-in user object.
   * @returns {string} The localized call status message.
   */
  static getCallStatus(call: CometChat.Call, loggedInUser: CometChat.User): string {
    const callStatus: string = call.getStatus();
    const isSentByMe: boolean = CallingDetailsUtils.isSentByMe(call, loggedInUser!);
    if (isSentByMe) {
      switch (callStatus) {
        case CometChatUIKitConstants.calls.initiated:
          return localize("OUTGOING_CALL");
        case CometChatUIKitConstants.calls.cancelled:
          return localize("CALL_CANCELLED");
        case CometChatUIKitConstants.calls.rejected:
          return localize("CALL_REJECTED");
        case CometChatUIKitConstants.calls.busy:
          return localize("MISSED_CALL");
        case CometChatUIKitConstants.calls.ended:
          return localize("CALL_ENDED");
        case CometChatUIKitConstants.calls.ongoing:
          return localize("CALL_ANSWERED");
        case CometChatUIKitConstants.calls.unanswered:
          return localize("CALL_UNANSWERED");
        default:
          return localize("OUTGOING_CALL");
      }
    } else {
      switch (callStatus) {
        case CometChatUIKitConstants.calls.initiated:
          return localize("INCOMING_CALL");
        case CometChatUIKitConstants.calls.ongoing:
          return localize("CALL_ANSWERED");
        case CometChatUIKitConstants.calls.ended:
          return localize("CALL_ENDED");
        case CometChatUIKitConstants.calls.unanswered:
        case CometChatUIKitConstants.calls.cancelled:
          return localize("MISSED_CALL");
        case CometChatUIKitConstants.calls.busy:
          return localize("CALL_BUSY");
        case CometChatUIKitConstants.calls.rejected:
          return localize("CALL_REJECTED");
        default:
          return localize("OUTGOING_CALL");
      }
    }
  }

}
