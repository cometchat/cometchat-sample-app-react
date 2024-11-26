import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { AIExtensionDataSource } from "../AIExtensionDataSource";
import { AISmartRepliesConfiguration } from "./AISmartRepliesConfiguration";
import { AISmartRepliesDecorator } from "./AISmartRepliesDecorator";

export class AISmartRepliesExtension extends AIExtensionDataSource {
  private configuration?: AISmartRepliesConfiguration;

  constructor(configuration?: AISmartRepliesConfiguration) {
    super();
    this.configuration = configuration;
  }

  override addExtension(): void {
    ChatConfigurator.enable((dataSource: any) => new AISmartRepliesDecorator(dataSource, this.configuration));
  }

  override getExtensionId(): string {
    return "smart-replies";
  }
}
