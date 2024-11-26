import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { ExtensionsDataSource } from "../ExtensionsDataSource";
import { ExtensionsId } from "../ExtensionsId";
import { CollaborativeDocumentConfiguration } from "./CollaborativeDocumentConfiguration";
import { CollaborativeDocumentExtensionDecorator } from "./CollaborativeDocumentExtensionDecorator";

/**
 * Class representing the Collaborative Document Extension.
 * 
 * This extension is responsible for enabling collaborative document features within the chat application.
 * It extends the `ExtensionsDataSource` class and utilizes a configuration to customize its behavior.
 */
export class CollaborativeDocumentExtension extends ExtensionsDataSource {

  /** @private Configuration for the collaborative document extension. */
  private configuration?: CollaborativeDocumentConfiguration;

  /**
   * Constructs a new CollaborativeDocumentExtension.
   * 
   * @param {CollaborativeDocumentConfiguration} [configuration] - The configuration for customizing the collaborative document extension.
   */
  constructor(configuration?: CollaborativeDocumentConfiguration) {
    super();
    this.configuration = configuration;
  }

  /**
   * Adds the collaborative document extension to the chat configurator.
   * 
   * This method overrides the `addExtension` method from `ExtensionsDataSource` and enables the collaborative document feature
   * by creating a new `CollaborativeDocumentExtensionDecorator`.
   * 
   * @override
   */
  override addExtension(): void {
    ChatConfigurator.enable((dataSource: any) => new CollaborativeDocumentExtensionDecorator(dataSource, this.configuration));
  }

  /**
   * Retrieves the extension ID for the collaborative document extension.
   * 
   * This method overrides the `getExtensionId` method from `ExtensionsDataSource`
   * and returns the unique ID associated with the collaborative document extension.
   * 
   * @returns {string} The unique ID of the collaborative document extension.
   * @override
   */
  override getExtensionId(): string {
    return ExtensionsId.document;
  }
}
