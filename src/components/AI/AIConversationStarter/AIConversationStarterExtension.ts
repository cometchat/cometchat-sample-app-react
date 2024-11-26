import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { AIExtensionDataSource } from "../AIExtensionDataSource";
import { AIConversationStarterConfiguration } from "./AIConversationStarterConfiguration";
import { AIConversationStarterDecorator } from "./AIConversationStarterDecorator";

export class AIConversationStarterExtension extends AIExtensionDataSource {
  private configuration?: AIConversationStarterConfiguration;

  constructor(configuration?: AIConversationStarterConfiguration) {
    super();
    this.configuration = configuration;
  }

  override addExtension(): void {
    ChatConfigurator.enable((dataSource: any) => new AIConversationStarterDecorator(dataSource, this.configuration));
  }

  override getExtensionId(): string {
    return "conversation-starter";
  }
}
