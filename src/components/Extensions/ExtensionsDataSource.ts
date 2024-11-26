import { CometChat } from "@cometchat/chat-sdk-javascript";

/**
 * Abstract class representing a data source for extensions.
 * Provides methods to enable and add extensions, and to get the extension ID.
 */
abstract class ExtensionsDataSource {

  /**
   * Abstract method to add an extension. Implementations must provide their own logic.
   * 
   * @abstract
   */
  abstract addExtension(): void;

  /**
   * Abstract method to get the unique identifier for the extension.
   * Implementations must provide their own logic to return the extension ID.
   * 
   * @abstract
   * @returns {string} The unique identifier for the extension.
   */
  abstract getExtensionId(): string;

  /**
   * Enables the extension if it is not already enabled.
   * Checks if the extension is enabled using `CometChat.isExtensionEnabled()` and 
   * adds the extension if it is enabled.
   * 
   * @returns {void}
   */
  enable(): void {
    CometChat.isExtensionEnabled(this.getExtensionId()).then(
      (enabled: Boolean) => {
        if (enabled) this.addExtension();
      }, error => { }
    );
  }
}

export { ExtensionsDataSource };
