
import { CometChat } from '@cometchat/chat-sdk-javascript'
import { CometChatTextFormatter } from '../formatters/CometChatFormatters/CometChatTextFormatter';
import deleteIcon from '../assets/delete.svg';
import { CometChatUIKitUtility } from '../CometChatUIKit/CometChatUIKitUtility';
import { localize } from '../resources/CometChatLocalize/cometchat-localize';
import { MessageBubbleAlignment } from '../Enums/Enums';
import { CometChatUIKitConstants } from '../constants/CometChatUIKitConstants';
import {  CometChatOption } from '../modals';
import { CometChatMentionsFormatter } from '../formatters/CometChatFormatters/CometChatMentionsFormatter/CometChatMentionsFormatter';

export interface additionalParams {
  disableMentions?: boolean;
  mentionsTargetElement?: number;
  textFormatters?: [];
  alignment?: MessageBubbleAlignment;
  textFormattersList?: CometChatTextFormatter[];
}
export interface lastConversationParams {
  textFormatters: CometChatMentionsFormatter[];
  disableMentions?: boolean;
  mentionsTargetElement?: number;
  alignment?: MessageBubbleAlignment;
  textFormattersList?: CometChatTextFormatter[];
}

/**
 * Utility class for handling conversations in CometChat.
 * It is used in CometChatConversations component and dataSource utils.
 */
export class ConversationUtils {

  private static additionalParams?: additionalParams | lastConversationParams;
  /**
   * Returns the default conversation options.
   *
   * @returns {CometChatOption[]} - An array of default conversation options.
   */
  static getDefaultOptions() {
    return [new CometChatOption({
      id: CometChatUIKitConstants.ConversationOptions.delete,
      title: localize("DELETE"),
      onClick: null,
    })]
  }

  /**
   * Retrieves the last conversation message for a given conversation object.
   *
   * @param {CometChat.Conversation} conversationObject - The conversation object.
   * @param {CometChat.User} loggedInUser - The logged-in user.
   * @param {additionalParams} [additionalParams] - Additional parameters for message formatting.
   * @returns {string} - The last conversation message as a string.
   */
  static getLastConversationMessage(conversationObject: CometChat.Conversation, loggedInUser: CometChat.User, additionalParams?: lastConversationParams) {
    let msgObject: CometChat.BaseMessage = conversationObject?.getLastMessage();

    if (additionalParams) {
      this.additionalParams = additionalParams
    }

    let message: string = "";
    if (!msgObject) {
      message = localize("CLICK_TO_START_CONVERSATION");
    }
    else if (msgObject?.getDeletedAt()) {
      message = localize("MESSAGE_IS_DELETED");
    }
    else if (msgObject?.getCategory() == CometChatUIKitConstants.MessageCategory.message && !msgObject?.getDeletedAt()) {
      message = this.getLastMessage(conversationObject)
    }
    else if (msgObject?.getCategory() == CometChatUIKitConstants.MessageCategory.action) {
      message = this.getLastMessageAction(conversationObject)
    }
    else if (msgObject?.getCategory() == CometChatUIKitConstants.MessageCategory.call) {
      message = this.getLastMessageCall(conversationObject)
    }
    else if (msgObject?.getCategory() == CometChatUIKitConstants.MessageCategory.custom) {
      message = this.getLastMessageCustom(conversationObject)
    }
    return message;
  }

  /**
   * Retrieves the last message for a given conversation.
   *
   * @param {CometChat.Conversation} conversation - The conversation object.
   * @returns {string} - The last message as a string.
   */
  static getLastMessage(conversation: CometChat.Conversation) {
    let message: string;
    let messageObject: CometChat.BaseMessage = conversation.getLastMessage()
    switch (messageObject?.getType()) {
      case CometChatUIKitConstants.MessageTypes.text: {
        if (this.additionalParams) {
          const formatters = this.additionalParams?.["textFormatters"] || [];
          const regexList = formatters?.map((f: CometChatMentionsFormatter) => {
            return f?.getRegexPatterns()
          })
          const lastMessage = (messageObject as CometChat.TextMessage)?.getText() || ""
          message = CometChatUIKitUtility.sanitizeHtml(lastMessage, regexList?.flat());
        } else {
          message = (messageObject as CometChat.TextMessage).getText() || ""
        }
      }
        break;
      case CometChatUIKitConstants.MessageTypes.image:
        message = localize("MESSAGE_IMAGE");
        break;
      case CometChatUIKitConstants.MessageTypes.file:
        message = localize("MESSAGE_FILE");
        break;
      case CometChatUIKitConstants.MessageTypes.video:
        message = localize("MESSAGE_VIDEO");
        break;
      case CometChatUIKitConstants.MessageTypes.audio:
        message = localize("MESSAGE_AUDIO");
        break;
      default:
        message = messageObject.getType();
        break;
    }
    return message

  }

  /**
   * Retrieves the last custom message for a given conversation.
   *
   * @param {CometChat.Conversation} conversation - The conversation object.
   * @returns {string} - The custom message type as a string.
   */
  static getLastMessageCustom(conversation: CometChat.Conversation) {
    let msgObject: CometChat.CustomMessage = conversation.getLastMessage()
    return msgObject.getType()

  }

  /**
  * Retrieves the last action message for a given conversation.
  *
  * @param {CometChat.Conversation} conversation - The conversation object.
  * @returns {string} - The action message as a string.
  */
  static getLastMessageAction(conversation: CometChat.Conversation) {
    let message: CometChat.Action = conversation?.getLastMessage()
    let actionMessage = '';
    if (message.hasOwnProperty("actionBy") === false || message.hasOwnProperty("actionOn") === false) {
      return actionMessage;
    }
    if (message.getAction() !== CometChatUIKitConstants.groupMemberAction.JOINED && message.getAction() !== CometChatUIKitConstants.groupMemberAction.LEFT && (message.getActionBy().hasOwnProperty("name") === false || message.getActionOn().hasOwnProperty("name") === false)) {
      return actionMessage;
    }
    if (message.getAction() === CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE) {
      if (message.hasOwnProperty("data") && message.getData().hasOwnProperty("extras")) {
        if (message.getData().extras.hasOwnProperty("scope")) {
          if (message.getData().extras.scope.hasOwnProperty("new") === false) {
            return actionMessage;
          }
        } else {
          return actionMessage;
        }
      } else {
        return actionMessage;
      }
    }
    if (message.getAction() === CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE && message.getData().extras.hasOwnProperty("scope") === false) {
      return actionMessage;
    }
    if (message.getAction() === CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE && message.getData().extras.scope.hasOwnProperty("new") === false) {
      return actionMessage;
    }
    const byEntity: any = message.getActionBy();
    const onEntity: any = message.getActionOn();
    const byString: string = byEntity.name;
    const forString: string = message.getAction() !== CometChatUIKitConstants.groupMemberAction.JOINED && message.getAction() !== CometChatUIKitConstants.groupMemberAction.LEFT ? onEntity.name : "";
    switch (message.getAction()) {
      case CometChatUIKitConstants.groupMemberAction.ADDED:
        actionMessage = `${byString} ${localize("ADDED")} ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.JOINED:
        actionMessage = `${byString} ${localize("JOINED")}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.LEFT:
        actionMessage = `${byString} ${localize("LEFT")}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.KICKED:
        actionMessage = `${byString} ${localize("KICKED")} ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.BANNED:
        actionMessage = `${byString} ${localize("BANNED")} ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.UNBANNED:
        actionMessage = `${byString} ${localize("UNBANNED")} ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE: {
        const newScope = message["data"]["extras"]["scope"]["new"];
        actionMessage = `${byString} ${localize("MADE")} ${forString} ${newScope}`;
        break;
      }
      default:
        break;
    }
    return actionMessage;

  }

 

  /**
   * Retrieves the last call message from a conversation.
   * Differentiates between audio and video calls.
   *
   * @param {CometChat.Conversation} conversation - The conversation object to retrieve the last call message from.
   * @returns {string} - A localized string indicating the type of call (audio or video).
   */
  static getLastMessageCall(conversation: CometChat.Conversation) {
    let messageObject: CometChat.Action = conversation?.getLastMessage()
    if (messageObject?.getType() === "audio") {
      return localize("AUDIO_CALL")
    } else if (messageObject?.getType() === "video") {
      return localize("VIDEO_CALL")
    } else {
      return messageObject?.getType()
    }
  }
}