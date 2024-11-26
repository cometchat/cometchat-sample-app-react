


import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatMentionsFormatter } from "../formatters/CometChatFormatters/CometChatMentionsFormatter/CometChatMentionsFormatter";
import { CometChatTextFormatter } from "../formatters/CometChatFormatters/CometChatTextFormatter";
import { CometChatUrlsFormatter } from "../formatters/CometChatFormatters/CometChatUrlsFormatter/CometChatUrlsFormatter";
import { additionalParams } from "./ConversationUtils";
import {  CometChatActionsIcon, CometChatActionsView, CometChatMessageComposerAction, CometChatMessageTemplate} from "../modals/";
import { DatePatterns, MessageBubbleAlignment } from "../Enums/Enums";
import { ComposerId } from "./MessagesDataSource";
/**
 * Class for providing message options and views.
 * It is used in AI and calling module and utils related to messages.
 */
export abstract class DataSource {
  abstract getTextMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView>;
  abstract getImageMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView>;
  abstract getVideoMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView>;
  abstract getAudioMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView>;
  abstract getFileMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView>;
  abstract getBottomView(
    message: CometChat.BaseMessage,
    alignment: MessageBubbleAlignment
  ): Element | JSX.Element | null;
  abstract getStatusInfoView(
    message: CometChat.BaseMessage,
    alignment: MessageBubbleAlignment,
    hideReceipt?: boolean,
    datePattern?: DatePatterns
  ): Element | JSX.Element | null;
  abstract getTextMessageContentView(
    message: CometChat.TextMessage,
    alignment: MessageBubbleAlignment,
    otherParams: Object | undefined
  ): Element | JSX.Element;
  abstract getImageMessageContentView(
    message: CometChat.MediaMessage,
    alignment: MessageBubbleAlignment,

  ): Element | JSX.Element;
  abstract getVideoMessageContentView(
    message: CometChat.MediaMessage,
    alignment: MessageBubbleAlignment,

  ): Element | JSX.Element;
  abstract getAudioMessageContentView(
    message: CometChat.MediaMessage,
    alignment: MessageBubbleAlignment,

  ): Element | JSX.Element;
  abstract getFileMessageContentView(
    message: CometChat.MediaMessage,
    alignment: MessageBubbleAlignment,

  ): Element | JSX.Element;
  abstract getTextMessageTemplate(
    additionalConfigurations?: Object | undefined
  ): CometChatMessageTemplate;
  abstract getImageMessageTemplate(

  ): CometChatMessageTemplate;
  abstract getVideoMessageTemplate(

  ): CometChatMessageTemplate;
  abstract getAudioMessageTemplate(

  ): CometChatMessageTemplate;
  abstract getFileMessageTemplate(

  ): CometChatMessageTemplate;
  abstract getGroupActionTemplate(

  ): CometChatMessageTemplate;
  abstract getAllMessageTemplates(
    additionalConfigurations?: Object | undefined
  ): Array<CometChatMessageTemplate>;
  abstract getMessageTemplate(
    messageType: string,
    messageCategory: string,
  ): CometChatMessageTemplate | null;
  abstract getMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView>;
  abstract getCommonOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView>;
  abstract getAttachmentOptions(
    id: ComposerId
  ): CometChatMessageComposerAction[];
  abstract getAllMessageTypes(): Array<string>;
  abstract getAllMessageCategories(): Array<string>;
  abstract getAuxiliaryOptions(
    id: ComposerId,
    user?: CometChat.User,
    group?: CometChat.Group
  ): JSX.Element[];
  abstract getId(): string;
  abstract getDeleteMessageBubble(
    messageObject: CometChat.BaseMessage,
  ): Element | JSX.Element;
  abstract getGroupActionBubble(
    message: CometChat.BaseMessage,
  ): Element | JSX.Element;
  abstract getTextMessageBubble(
    messageText: string,
    message: CometChat.TextMessage,
    alignment: MessageBubbleAlignment,
    additionalConfigurations?: Object | undefined
  ): Element | JSX.Element;
  abstract getVideoMessageBubble(
    videoUrl: string,
    message: CometChat.MediaMessage,
    thumbnailUrl?: string,
    onClick?: Function,
  ): Element | JSX.Element;
  abstract getImageMessageBubble(
    imageUrl: string,
    placeholderImage: string,
    message: CometChat.MediaMessage,
    onClick?: Function,
  ): Element | JSX.Element;
  abstract getAudioMessageBubble(
    audioUrl: string,
    message: CometChat.MediaMessage,
    title?: string,
  ): Element | JSX.Element;
  abstract getFileMessageBubble(
    fileUrl: string,
    message: CometChat.MediaMessage,
    title?: string,
  ): Element | JSX.Element;
  abstract getLastConversationMessage(
    conversation: CometChat.Conversation,
    loggedInUser: CometChat.User,
    additionalConfigurations?: additionalParams
  ): string;

  abstract getAuxiliaryHeaderMenu(
    user?: CometChat.User,
    group?: CometChat.Group
  ): Element[] | JSX.Element[];
  abstract getAIOptions(
    user: CometChat.User | null,
    group: CometChat.Group | null,
    id?: ComposerId,
  ): (CometChatMessageComposerAction | CometChatActionsView)[];
  abstract getAllTextFormatters(formatterParams: additionalParams): CometChatTextFormatter[];
  abstract getMentionsTextFormatter(
    params: Object
  ): CometChatMentionsFormatter;
  abstract getUrlTextFormatter(params: Object): CometChatUrlsFormatter;
  abstract getMentionsFormattedText(
    message: CometChat.TextMessage,
    subtitle: string,
    additionalConfigurations?: Object | undefined
  ): string;
}
