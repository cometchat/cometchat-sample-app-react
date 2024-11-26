/**
 * Configuration class for Collaborative Whiteboard.
 * This class provides methods to retrieve styles and URLs associated with the whiteboard component.
 */
export class CollaborativeWhiteboardConfiguration {

    /**
     * The URL of the icon to be used for the whiteboard.
     * @type {string}
     */
    private iconURL: string;

    /**
     * The URL of the icon to be used for the whiteboard option.
     * @type {string}
     */
    private optionIconURL: string;


    /**
     * Creates an instance of CollaborativeWhiteboardConfiguration.
     */
    constructor(configuration: { iconURL?: string, optionIconURL?: string }) {
        let { iconURL, optionIconURL } = configuration;
        this.iconURL = (iconURL as string);
        this.optionIconURL = (optionIconURL as string);
    }



    /**
     * Retrieves the URL of the icon used for the whiteboard.
     *
     * @returns {string} The URL of the icon.
     */
    getIconURL(): string {
        return this.iconURL;
    }

    /**
     * Retrieves the URL of the icon used for the whiteboard option.
     *
     * @returns {string} The URL of the option icon.
     */
    getOptionIconURL(): string {
        return this.optionIconURL;
    }



}