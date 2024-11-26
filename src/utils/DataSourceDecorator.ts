
import { DataSource } from "./DataSource";
import { ComposerId, MessagesDataSource } from "./MessagesDataSource";
import { CometChatUrlsFormatter } from "../formatters/CometChatFormatters/CometChatUrlsFormatter/CometChatUrlsFormatter";
import { CometChatMentionsFormatter } from "../formatters/CometChatFormatters/CometChatMentionsFormatter/CometChatMentionsFormatter";
import { CometChatTextFormatter } from "../formatters/CometChatFormatters/CometChatTextFormatter";
import { additionalParams } from "./ConversationUtils";
import {  CometChatActionsIcon, CometChatActionsView, CometChatMessageComposerAction, CometChatMessageTemplate} from "../modals";
import { DatePatterns, MessageBubbleAlignment } from "../Enums/Enums";

/**
 * This class is used in AI, calling and Extension modules.
 */
export abstract class DataSourceDecorator implements DataSource {
  dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  getTextMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    return (this.dataSource ?? new MessagesDataSource()).getTextMessageOptions(
      loggedInUser,
      messageObject,
      group
    );
  }
  getImageMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    return (this.dataSource ?? new MessagesDataSource()).getImageMessageOptions(
      loggedInUser,
      messageObject,
      group
    );
  }
  getVideoMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    return (this.dataSource ?? new MessagesDataSource()).getVideoMessageOptions(
      loggedInUser,
      messageObject,
      group
    );
  }
  getAudioMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    return (this.dataSource ?? new MessagesDataSource()).getAudioMessageOptions(
      loggedInUser,
      messageObject,
      group
    );
  }
  getFileMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    return (this.dataSource ?? new MessagesDataSource()).getFileMessageOptions(
      loggedInUser,
      messageObject,
      group
    );
  }

  getStatusInfoView(
    message: CometChat.BaseMessage,
    alignment: MessageBubbleAlignment,
    hideReceipt?: boolean,
    datePattern?: DatePatterns
  ) {
    return (this.dataSource ?? new MessagesDataSource()).getStatusInfoView(
      message,
      alignment,
      hideReceipt,
      datePattern
    );
  }
  getBottomView(
    message: CometChat.BaseMessage,
    alignment: MessageBubbleAlignment
  ) {
    return (this.dataSource ?? new MessagesDataSource()).getBottomView(
      message,
      alignment
    );
  }
  getTextMessageContentView(
    message: CometChat.TextMessage,
    alignment: MessageBubbleAlignment,
    additionalConfigurations?: Object | undefined
  ) {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getTextMessageContentView(
      message,
      alignment,
      additionalConfigurations
    );
  }
  getImageMessageContentView(
    message: CometChat.MediaMessage,
    alignment: MessageBubbleAlignment
  ) {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getImageMessageContentView(message, alignment);
  }
  getVideoMessageContentView(
    message: CometChat.MediaMessage,
    alignment: MessageBubbleAlignment
  ) {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getVideoMessageContentView(message, alignment);
  }
  getAudioMessageContentView(
    message: CometChat.MediaMessage,
    alignment: MessageBubbleAlignment
  ) {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getAudioMessageContentView(message, alignment);
  }
  getFileMessageContentView(
    message: CometChat.MediaMessage,
    alignment: MessageBubbleAlignment
  ) {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getFileMessageContentView(message, alignment);
  }

  getTextMessageTemplate(
    additionalConfigurations?: Object | undefined
  ): CometChatMessageTemplate {
    return (this.dataSource ?? new MessagesDataSource()).getTextMessageTemplate(
      additionalConfigurations
    );
  }
  getImageMessageTemplate(): CometChatMessageTemplate {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getImageMessageTemplate();
  }
  getVideoMessageTemplate(): CometChatMessageTemplate {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getVideoMessageTemplate();
  }
  getAudioMessageTemplate(): CometChatMessageTemplate {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getAudioMessageTemplate();
  }
  getFileMessageTemplate(): CometChatMessageTemplate {
    return (this.dataSource ?? new MessagesDataSource()).getFileMessageTemplate(

    );
  }
  getGroupActionTemplate(): CometChatMessageTemplate {
    return (this.dataSource ?? new MessagesDataSource()).getGroupActionTemplate(

    );
  }
  getAllMessageTemplates(
    additionalConfigurations?: Object | undefined
  ): CometChatMessageTemplate[] {
    return (this.dataSource ?? new MessagesDataSource()).getAllMessageTemplates(
      additionalConfigurations
    );
  }
  getMessageTemplate(
    messageType: string,
    messageCategory: string,
  ): CometChatMessageTemplate | null {
    return (this.dataSource ?? new MessagesDataSource()).getMessageTemplate(
      messageType,
      messageCategory
    );
  }
  getMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    return (this.dataSource ?? new MessagesDataSource()).getMessageOptions(
      loggedInUser,
      messageObject,
      group
    );
  }
  getCommonOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    return (this.dataSource ?? new MessagesDataSource()).getCommonOptions(
      loggedInUser,
      messageObject,
      group
    );
  }
  getAttachmentOptions(
    id: ComposerId
  ): CometChatMessageComposerAction[] {
    return (this.dataSource ?? new MessagesDataSource()).getAttachmentOptions(
      id
    );
  }
  getAllMessageTypes(): string[] {
    return (this.dataSource ?? new MessagesDataSource()).getAllMessageTypes();
  }
  getAllMessageCategories(): string[] {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getAllMessageCategories();
  }
  getAuxiliaryOptions(
    id: ComposerId,
    user?: CometChat.User,
    group?: CometChat.Group
  ): JSX.Element[] {
    return (this.dataSource ?? new MessagesDataSource()).getAuxiliaryOptions(
      id,
      user,
      group
    );
  }
  getId(): string {
    return (this.dataSource ?? new MessagesDataSource()).getId();
  }
  getDeleteMessageBubble(
    messageObject: CometChat.BaseMessage) {
    return (this.dataSource ?? new MessagesDataSource()).getDeleteMessageBubble(
      messageObject);
  }
  getGroupActionBubble(
    message: CometChat.BaseMessage
  ) {
    return (this.dataSource ?? new MessagesDataSource()).getGroupActionBubble(
      message
    );
  }
  getTextMessageBubble(
    messageText: string,
    message: CometChat.TextMessage,
    alignment: MessageBubbleAlignment,
    additionalConfigurations?: Object | undefined
  ) {
    return (this.dataSource ?? new MessagesDataSource()).getTextMessageBubble(
      messageText,
      message,
      alignment,
      additionalConfigurations
    );
  }
  getVideoMessageBubble(
    videoUrl: string,
    message: CometChat.MediaMessage,
    thumbnailUrl?: string,
    onClick?: Function) {
    return (this.dataSource ?? new MessagesDataSource()).getVideoMessageBubble(
      videoUrl,
      message,
      thumbnailUrl,
      onClick
    );
  }
  getImageMessageBubble(
    imageUrl: string,
    placeholderImage: string,
    message: CometChat.MediaMessage,
    onClick?: Function
  ) {
    return (this.dataSource ?? new MessagesDataSource()).getImageMessageBubble(
      imageUrl,
      placeholderImage,
      message,
      onClick
    );
  }
  getAudioMessageBubble(
    audioUrl: string,
    message: CometChat.MediaMessage,
    title?: string
  ) {
    return (this.dataSource ?? new MessagesDataSource()).getAudioMessageBubble(
      audioUrl,
      message,
      title
    );
  }
  getFileMessageBubble(
    fileUrl: string,
    message: CometChat.MediaMessage,
    title?: string
  ) {
    return (this.dataSource ?? new MessagesDataSource()).getFileMessageBubble(
      fileUrl,
      message,
      title
    );
  }
  getLastConversationMessage(
    conversation: CometChat.Conversation,
    loggedInUser: CometChat.User,
    additionalConfigurations?: additionalParams
  ): string {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getLastConversationMessage(
      conversation,
      loggedInUser,
      additionalConfigurations
    );
  }

  getAuxiliaryHeaderMenu(user?: CometChat.User, group?: CometChat.Group): Element[] | JSX.Element[] {
    return (this.dataSource ?? new MessagesDataSource()).getAuxiliaryHeaderMenu(
      user,
      group
    );
  }
  getAIOptions(
    user: CometChat.User | null,
    group: CometChat.Group | null,
    id?: ComposerId
  ): (CometChatMessageComposerAction | CometChatActionsView)[] {
    return (this.dataSource ?? new MessagesDataSource()).getAIOptions(
      user,
      group,
      id
    );
  }
  getAllTextFormatters(formatterParams: additionalParams): CometChatTextFormatter[] {
    let formatters = [];
    const mentionsFormatter = formatterParams.disableMentions ? null : (this.dataSource ?? new MessagesDataSource()).getMentionsTextFormatter(
      formatterParams
    );
    const urlTextFormatter = (this.dataSource ?? new MessagesDataSource()).getUrlTextFormatter(
      formatterParams
    );
    if (mentionsFormatter) {
      formatters.push(mentionsFormatter);
    }
    if (urlTextFormatter) {
      formatters.push(urlTextFormatter);
    }
    return formatters;
  }

  getMentionsTextFormatter(params: Object = {}): CometChatMentionsFormatter {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getMentionsTextFormatter(params);
  }
  getUrlTextFormatter(params: Object = {}): CometChatUrlsFormatter {
    return (this.dataSource ?? new MessagesDataSource()).getUrlTextFormatter(
      params
    );
  }
  getMentionsFormattedText(
    message: CometChat.TextMessage,
    subtitle: string,
    additionalConfigurations: Object
  ): string {
    return (
      this.dataSource ?? new MessagesDataSource()
    ).getMentionsFormattedText(message, subtitle, additionalConfigurations);
  }
}
