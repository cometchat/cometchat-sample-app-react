import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { ExtensionsDataSource } from "../ExtensionsDataSource";
import { ExtensionsId } from "../ExtensionsId";
import { PollsConfiguration } from "./PollsConfiguration";
import { PollsExtensionDecorator } from "./PollsExtensionDecorator";

export class PollsExtension extends ExtensionsDataSource {
  private configuration?: PollsConfiguration;

  constructor(configuration?: PollsConfiguration) {
    super();
    this.configuration = configuration;
  }

  override addExtension(): void {
    ChatConfigurator.enable(
      (dataSource: any) => new PollsExtensionDecorator(dataSource, this.configuration)
    );
  }

  override getExtensionId(): string {
    return ExtensionsId.polls;
  }
}
