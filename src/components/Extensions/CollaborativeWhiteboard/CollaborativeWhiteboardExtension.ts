import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { ExtensionsDataSource } from "../ExtensionsDataSource";
import { ExtensionsId } from "../ExtensionsId";
import { CollaborativeWhiteboardConfiguration } from "./CollaborativeWhiteboardConfiguration";
import { CollaborativeWhiteBoardExtensionDecorator } from "./CollaborativeWhiteboardExtensionDecorator";

/**
 * Class representing a Collaborative Whiteboard Extension.
 * This class extends the `ExtensionsDataSource` to add support for collaborative whiteboard functionality.
 */
export class CollaborativeWhiteboardExtension extends ExtensionsDataSource {

  /**
   * Configuration for the collaborative whiteboard extension.
   * @type {CollaborativeWhiteboardConfiguration | undefined}
   */
  private configuration?: CollaborativeWhiteboardConfiguration;

  /**
   * Creates an instance of the CollaborativeWhiteboardExtension.
   * @param {CollaborativeWhiteboardConfiguration} [configuration] - The configuration for the whiteboard extension.
   */
  constructor(configuration?: CollaborativeWhiteboardConfiguration) {
    super();
    this.configuration = configuration;
  }

  /**
   * Adds the collaborative whiteboard extension to the chat configurator.
   * This method enables the extension by passing a new `CollaborativeWhiteBoardExtensionDecorator`
   * instance to the `ChatConfigurator`.
   */
  override addExtension(): void {
    ChatConfigurator.enable(
      (dataSource: any) => new CollaborativeWhiteBoardExtensionDecorator(dataSource, this.configuration)
    );
  }

  /**
   * Gets the unique identifier for the whiteboard extension.
   * @returns {string} The extension ID for the whiteboard.
   */
  override getExtensionId(): string {
    return ExtensionsId.whiteboard;
  }
}
