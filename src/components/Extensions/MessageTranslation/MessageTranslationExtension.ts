import { MessageTranslationExtensionDecorator } from "./MessageTranslationExtensionDecorator";
import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { ExtensionsDataSource } from "../ExtensionsDataSource";
import { ExtensionsId } from "../ExtensionsId";

/**
 * Class for handling message translation extensions.
 * 
 * @class MessageTranslationExtension
 * @extends {ExtensionsDataSource}
 */
export class MessageTranslationExtension extends ExtensionsDataSource {

  /**
  * Creates an instance of MessageTranslationExtension.
  * 
  * @param {MessageTranslationConfiguration} [configuration] - Optional configuration for message translation.
  */
  constructor() {
    super();
  }

  /**
   * Adds the message translation extension by enabling the ChatConfigurator with
   * a new MessageTranslationExtensionDecorator instance.
   * 
   * @override
   * @returns {void}
   */
  override addExtension(): void {
    ChatConfigurator.enable(
      (dataSource: any) => new MessageTranslationExtensionDecorator(dataSource)
    );
  }

  /**
   * Retrieves the unique identifier for the message translation extension.
   * 
   * @override
   * @returns {string} The unique identifier for the message translation extension.
   */
  override getExtensionId(): string {
    return ExtensionsId.messageTranslation;
  }
}
