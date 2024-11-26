import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { ExtensionsDataSource } from "../ExtensionsDataSource";
import { ExtensionsId } from "../ExtensionsId";
import { ThumbnailGenerationExtensionDecorator } from "./ThumbnailGenerationExtensionDecorator";

/**
 * Class representing a Thumbnail Generation extension for managing thumbnail generation functionality.
 * 
 * @extends {ExtensionsDataSource}
 */
export class ThumbnailGenerationExtension extends ExtensionsDataSource {

  /**
   * Adds the Thumbnail Generation extension by configuring the ChatConfigurator.
   * 
   * This method enables the Thumbnail Generation extension by creating and adding a 
   * `ThumbnailGenerationExtensionDecorator` to the `ChatConfigurator`.
   */
  override addExtension(): void {
    ChatConfigurator.enable(
      (dataSource: any) => new ThumbnailGenerationExtensionDecorator(dataSource)
    );
  }

  /**
   * Gets the unique identifier for the Thumbnail Generation extension.
   * 
   * @returns {string} The unique identifier for the Thumbnail Generation extension.
   */
  override getExtensionId(): string {
    return ExtensionsId.thumbnailGeneration;
  }
}
