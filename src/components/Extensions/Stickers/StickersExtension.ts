import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { ExtensionsDataSource } from "../ExtensionsDataSource";
import { ExtensionsId } from "../ExtensionsId";
import { StickersExtensionDecorator } from './StickersExtensionDecorator';

/**
 * The StickersExtension class extends the ExtensionsDataSource and is responsible for 
 * configuring and adding the Stickers extension to the chat application.
 * 
 * @class
 * @extends {ExtensionsDataSource}
 */
export class StickersExtension extends ExtensionsDataSource {


  /**
   * Creates an instance of StickersExtension.
   * 
   * @param {StickersConfiguration} [configuration] - Optional configuration for the Stickers extension.
   */
  constructor() {
    super();
  }

  /**
   * Adds the Stickers extension by enabling it in the ChatConfigurator.
   * This method is called to register the Stickers extension with the chat application.
   * 
   * @override
   * @returns {void}
   */
  override addExtension(): void {
    ChatConfigurator.enable(
      (dataSource: any) => new StickersExtensionDecorator(dataSource)
    );
  }

  /**
  * Returns the unique ID of the Stickers extension.
  * 
  * @override
  * @returns {string} The ID of the Stickers extension.
  */
  override getExtensionId(): string {
    return ExtensionsId.stickers;
  }
}
