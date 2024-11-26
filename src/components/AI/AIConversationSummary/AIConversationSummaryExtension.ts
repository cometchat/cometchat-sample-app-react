import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { AIExtensionDataSource } from "../AIExtensionDataSource";
import { AIConversationSummaryConfiguration } from "./AIConversationSummaryConfiguration";
import { AIConversationSummaryDecorator } from "./AIConversationSummaryDecorator";

export class AIConversationSummaryExtension extends AIExtensionDataSource {
  private configuration?: AIConversationSummaryConfiguration;

  constructor(configuration?: AIConversationSummaryConfiguration) {
    super();
    this.configuration = configuration;
  }

  override addExtension(): void {
    ChatConfigurator.enable((dataSource: any) => new AIConversationSummaryDecorator(dataSource, this.configuration));
  }

  override getExtensionId(): string {
    return "conversation-summary";
  }
}
