import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { ExtensionsDataSource } from "../ExtensionsDataSource";
import { ExtensionsId } from "../ExtensionsId";
import { LinkPreviewExtensionDecorator } from "./LinkPreviewExtensionDecorator";

/**
 * The `LinkPreviewExtension` class is responsible for enabling the link preview feature within the chat application.
 * It extends the `ExtensionsDataSource` class and utilizes a configuration object to customize the behavior of the link preview extension.
 */
export class LinkPreviewExtension extends ExtensionsDataSource {

  /**
   * Creates an instance of the `LinkPreviewExtension` class.
   * 
   * @param {LinkPreviewConfiguration} [configuration] - Optional configuration settings for the link preview extension.
   */
  constructor() {
    super();
  }

  /**
   * Adds the link preview extension to the chat application by enabling it within the `ChatConfigurator`.
   * This method overrides the base class method to provide specific implementation for the link preview extension.
   */
  override addExtension(): void {
    ChatConfigurator.enable(
      (dataSource: any) => new LinkPreviewExtensionDecorator(dataSource)
    );
  }

  /**
   * Retrieves the unique identifier for the link preview extension.
   * 
   * @returns {string} The unique identifier for the link preview extension.
   */
  override getExtensionId(): string {
    return ExtensionsId.linkPreview;
  }
}
