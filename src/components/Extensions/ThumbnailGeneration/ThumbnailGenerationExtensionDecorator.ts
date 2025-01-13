import { CometChat } from "@cometchat/chat-sdk-javascript";
import { ChatConfigurator } from "../../../utils/ChatConfigurator";
import { DataSourceDecorator } from "../../../utils/DataSourceDecorator";
import PlaceholderImage from '../../../assets/image_placeholder.png';

/**
 * Class representing a Thumbnail Generation extension decorator.
 * Extends the `DataSourceDecorator` to handle thumbnail generation for images and videos.
 * 
 * @extends {DataSourceDecorator}
 */
export class ThumbnailGenerationExtensionDecorator extends DataSourceDecorator {

    /**
     * Gets the unique identifier for the Thumbnail Generation extension decorator.
     * 
     * @returns {string} The unique identifier for the Thumbnail Generation extension decorator.
     */
    override getId(): string {
        return "thumbnailgeneration";
    }

    /**
    * Provides the image message bubble with support for thumbnail generation.
    * If the "imagemoderation" extension is included, it uses the default image bubble.
    * Otherwise, it checks for a thumbnail URL in the message metadata and uses it if available.
    * 
    * @param {string} imageUrl - The URL of the image.
    * @param {string} placeholderImage - The URL of the placeholder image.
    * @param {CometChat.MediaMessage} message - The media message containing the image.
    * @param {Function} [onClick] - Optional click event handler.
    * @param {ImageBubbleStyle} [style] - Optional style for the image bubble.
    * @returns {React.ReactNode} The rendered image message bubble.
    */
    override getImageMessageBubble(imageUrl: string, placeholderImage: string, message: CometChat.MediaMessage, onClick?: Function) {
        if (ChatConfigurator.names.includes("imagemoderation")) {
            return super.getImageMessageBubble(imageUrl, placeholderImage, message);
        } else {
            let imageUrl = message.getAttachments() ? message?.getAttachments()[0]?.getUrl() : (message.getData() as any)?.url;
            let metadata: any = message.getMetadata();
            if (metadata && metadata.hasOwnProperty("@injected") && metadata["@injected"].hasOwnProperty("extensions") && metadata["@injected"]["extensions"].hasOwnProperty("thumbnail-generation") && metadata["@injected"]["extensions"]["thumbnail-generation"]["url_medium"]) {
                imageUrl = metadata["@injected"]["extensions"]["thumbnail-generation"]["url_medium"];
            }
            return super.getImageMessageBubble(imageUrl, PlaceholderImage, message);
        }
    }

    /**
     * Provides the video message bubble with support for thumbnail generation.
     * It checks for a thumbnail URL in the message metadata and uses it if available.
     * 
     * @param {string} videoUrl - The URL of the video.
     * @param {CometChat.MediaMessage} message - The media message containing the video.
     * @param {string} [thumbnailUrl] - Optional URL of the thumbnail image.
     * @param {Function} [onClick] - Optional click event handler.
     * @returns {React.ReactNode} The rendered video message bubble.
     */
    override getVideoMessageBubble(videoUrl: string, message: CometChat.MediaMessage, thumbnailUrl?: string, onClick?: Function) {
        let metadata: any = message.getMetadata();
        let thumbnailImage = thumbnailUrl;
        if (metadata && metadata.hasOwnProperty("@injected") && metadata["@injected"].hasOwnProperty("extensions") && metadata["@injected"]["extensions"].hasOwnProperty("thumbnail-generation") && metadata["@injected"]["extensions"]["thumbnail-generation"]["url_small"]) {
            thumbnailImage = metadata["@injected"]["extensions"]["thumbnail-generation"]["url_small"];
        }
        return super.getVideoMessageBubble(videoUrl, message, thumbnailImage);
    }
}
