import { CometChat } from "@cometchat/chat-sdk-javascript";
import { DataSource } from "../../../utils/DataSource";
import { DataSourceDecorator } from "../../../utils/DataSourceDecorator";
import { AIConversationSummaryView } from "./AIConversationSummaryView";
import { AIConversationSummaryConfiguration } from "./AIConversationSummaryConfiguration";
import { CometChatActionsView } from "../../../modals/CometChatActionsView";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatMessageComposerAction } from "../../../modals";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";
import { PanelAlignment } from "../../../Enums/Enums";
import AiSummaryIcon from '../../../assets/ai_conversation_summary.svg';
import { CometChatUIEvents, IActiveChatChanged } from "../../../events/CometChatUIEvents";

export class AIConversationSummaryDecorator extends DataSourceDecorator {
  public configuration?: AIConversationSummaryConfiguration;
  public newDataSource!: DataSource;
  public currentMessage: CometChat.BaseMessage | null = null;
  public unreadMessageCount: number = 0;
  public loggedInUser!: CometChat.User | null;
  public user!: CometChat.User;
  public group!: CometChat.Group;
  private LISTENER_ID: string = "aiconversationsummary__listener";

  constructor(
    dataSource: DataSource,
    configuration?: AIConversationSummaryConfiguration
  ) {
    super(dataSource);
    this.newDataSource = dataSource;
    this.configuration = configuration!;
    setTimeout(() => {
      this.addMessageListener();
    }, 1000);
  }

  override getId(): string {
    return "aiconversationsummary";
  }

  closePanel = () => {
    CometChatUIEvents.ccHidePanel.next(PanelAlignment.messageListFooter);
  };

  getConversationSummary = (): Promise<string> => {
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
        const response = await CometChat.getConversationSummary(
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

  private loadConversationSummary(): void {
    CometChatUIEvents.ccShowPanel.next({ configuration: this.configuration, message: this.currentMessage!, child: <AIConversationSummaryView configuration={this.configuration} getConversationSummaryCallback={this.getConversationSummary} closeCallback={this.closePanel} />, position: PanelAlignment.messageListFooter });
  }

  override getAIOptions(user: CometChat.User | null, group: CometChat.Group | null, id?: any): (CometChatMessageComposerAction | CometChatActionsView)[] {
    this.user = user!;
    this.group = group!;
    if (!id?.parentMessageId) {
      const messageComposerActions: (CometChatMessageComposerAction | CometChatActionsView)[] = super.getAIOptions(user, group, id);
      let newAction: CometChatMessageComposerAction = new CometChatMessageComposerAction({
        title: localize("CONVERSATION_SUMMARY"),
        onClick: () => { this.loadConversationSummary() },
        id: "ai-conversation-summary",
        iconURL: AiSummaryIcon,
      });
      messageComposerActions.push(newAction);
      return messageComposerActions;
    } else {
      return super.getAIOptions(user, group, id);
    }
  }

  private addMessageListener(): void {
    CometChat.getLoggedinUser().then((user: CometChat.User | null) => {
      if (user) {
        this.loggedInUser = user;
      }
    });

    CometChatUIEvents.ccActiveChatChanged.subscribe(
      (data: IActiveChatChanged) => {
        this.currentMessage = data.message!;
        this.user = data.user!;
        this.group = data.group!;
        this.unreadMessageCount = data.unreadMessageCount ?? 0;
        if (this.unreadMessageCount > (this.configuration?.unreadMessageThreshold ?? 30)) {
          this.loadConversationSummary();
        }
      }
    );
  }
}
