import { CometChatActions } from "./CometChatActions";

/**
 * CometChatActionsIcon is a pre-defined structure for creating actions 
 * that the user can perform on a message with an icon representation.
 * It is used in CometChatContextMenu, CometChatMessageBubble, CometChatMessageList components.
 */
export class CometChatActionsIcon extends CometChatActions {
    /**
     * Function invoked when the user clicks on the message action.
     * @type {(id: number) => void}
     */
    onClick: (id: number) => void;

    /**
     * Creates an instance of CometChatActionsIcon.
     */
    constructor(options: {
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
         * @type {string}
         */
        iconURL: string;

        /**
         * Function invoked when the user clicks on the message action. This function should handle the action related to the provided message id.
         * @type {(id: number) => void}
         */
        onClick: (id: number) => void;
    }) {
        super(options);
        this.onClick = options.onClick;
    }
}