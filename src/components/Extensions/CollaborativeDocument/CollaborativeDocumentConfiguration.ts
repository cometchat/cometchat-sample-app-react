/**
 * Configuration class for collaborative document settings.
 * 
 * This class encapsulates the configuration required for rendering document bubbles
 * and options in the collaborative document feature.
 */
export class CollaborativeDocumentConfiguration {
    private iconURL: string;
    private optionIconURL: string;

    /**
    * Constructs a CollaborativeDocumentConfiguration instance.
    * 
    * @param configuration - An object containing optional configuration properties.
    * @param configuration.style - Custom styling for the document bubble.
    * @param configuration.iconURL - URL for the document icon.
    * @param configuration.optionIconURL - URL for the options icon.
    * @param configuration.optionStyle - Custom styling for the options.
    */
    constructor(configuration: { iconURL?: string, optionIconURL?: string }) {
        let { iconURL, optionIconURL } = configuration;
        this.iconURL = (iconURL as string);
        this.optionIconURL = (optionIconURL as string);
    }


    /**
     * Retrieves the URL for the document icon.
     * 
     * @returns The icon URL as a string.
     */
    getIconURL(): string {
        return this.iconURL;
    }

    /**
     * Retrieves the URL for the options icon.
     * 
     * @returns The options icon URL as a string.
     */
    getOptionIconURL(): string {
        return this.optionIconURL;
    }



}