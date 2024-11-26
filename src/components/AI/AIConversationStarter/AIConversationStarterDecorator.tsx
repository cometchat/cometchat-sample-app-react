import { CometChat } from "@cometchat/chat-sdk-javascript";
import { DataSource } from "../../../utils/DataSource";
import { DataSourceDecorator } from "../../../utils/DataSourceDecorator";
import { AIConversationStarterView } from "./AIConversationStarterView";
import { AIConversationStarterConfiguration } from "./AIConversationStarterConfiguration";
import { PanelAlignment } from "../../../Enums/Enums";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";
import { CometChatUIEvents, IActiveChatChanged } from "../../../events/CometChatUIEvents";
import { CometChatMessageEvents } from "../../../events/CometChatMessageEvents";

export class AIConversationStarterDecorator extends DataSourceDecorator {
  public configuration?: AIConversationStarterConfiguration;
  public newDataSource!: DataSource;
  public currentMessage: CometChat.BaseMessage | null = null;
  public loggedInUser!: CometChat.User | null;
  public user!: CometChat.User;
  public group!: CometChat.Group;
  constructor(
    dataSource: DataSource,
    configuration?: AIConversationStarterConfiguration
  ) {
    super(dataSource);
    this.newDataSource = dataSource;
    this.configuration = configuration!;
    setTimeout(() => {
      this.addMessageListener();
    }, 1000);
  }

  override getId(): string {
    return "aiconversationstarter";
  }

  editReply(reply: string) {
    CometChatUIEvents.ccComposeMessage.next(reply);
    CometChatUIEvents.ccHidePanel.next(PanelAlignment.messageListFooter);
  }

  closeIfMessageReceived(message: CometChat.BaseMessage) {
    if (message?.getReceiverId() === this.loggedInUser?.getUid() && !this.currentMessage) {
      CometChatUIEvents.ccHidePanel.next(PanelAlignment.messageListFooter);
    }
  }

  getConversationStarter = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        let receiverId: string = this.user
          ? this.user?.getUid()
          : this.group?.getGuid();
        let receiverType: string = this.user
          ? CometChatUIKitConstants.MessageReceiverType.user
          : CometChatUIKitConstants.MessageReceiverType.group;
        let configuration;
        if (this.configuration?.apiConfiguration) {
          configuration = await this.configuration?.apiConfiguration(
            this.user,
            this.group
          );
        }
        const response = await CometChat.getConversationStarter(
          receiverId,
          receiverType,
          configuration ? configuration : {}
        );
        return resolve(response);
      } catch (e) {
        reject(e);
      }
    });
  };

  private loadConversationStarter(): void {
    CometChatUIEvents.ccShowPanel.next({ configuration: this.configuration, message: this.currentMessage!, child: <AIConversationStarterView configuration={this.configuration} getConversationStarterCallback={this.getConversationStarter} editReplyCallback={this.editReply} />, position: PanelAlignment.messageListFooter });
  }

  private addMessageListener(): void {
    CometChat.getLoggedinUser().then((user: CometChat.User | null) => {
      if (user) {
        this.loggedInUser = user;
      }
    });

    CometChatMessageEvents.onTextMessageReceived.subscribe((message) => {
      this.closeIfMessageReceived(message);
    });

    CometChatMessageEvents.onCustomMessageReceived.subscribe((message) => {
      this.closeIfMessageReceived(message);
    });

    CometChatMessageEvents.onMediaMessageReceived.subscribe((message) => {
      this.closeIfMessageReceived(message);
    });

    CometChatUIEvents.ccActiveChatChanged.subscribe(
      (data: IActiveChatChanged) => {
        this.currentMessage = data.message!;
        this.user = data.user!;
        this.group = data.group!;
        if (!this.currentMessage) {
          this.loadConversationStarter();
        }
      }
    );

    CometChatMessageEvents.ccMessageSent.subscribe(() => {
      if (!this.currentMessage) {
        CometChatUIEvents.ccHidePanel.next(PanelAlignment.messageListFooter);
        this.currentMessage = null;
      }
    });
  }
}
