/**
 * CometChatActions is a pre-defined structure for creating actions 
 * that the user can perform on a message, with properties to customize 
 * the appearance and behavior of the action.
 * It is used in CometChatActionsIcon and CometChatActionsView components.
 */
export class CometChatActions {
    /**
     * Unique identifier for the message action.
     * @type {string}
     */
    id: string;

    /**
     * Heading text for the message action.
     * @type {string}
     */
    title: string;

    /**
     * Asset URL for the icon to symbolize a message action.
     * @type {string | undefined}
     */
    iconURL?: string;





    /**
     * Creates an instance of CometChatActions.
     * 
     * @param {Object} options - Options to initialize the action.
     * @param {string} options.id - Unique identifier for the message action.
     * @param {string} options.title - Heading text for the message action.
     * @param {string} [options.iconURL] - Asset URL for the icon to symbolize a message action.
     */
    constructor(options: {
        id: string;
        title: string;
        iconURL?: string;
    }) {
        this.id = options.id;
        this.title = options.title;
        this.iconURL = options.iconURL;
    }
}