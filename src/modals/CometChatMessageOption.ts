import { CometChatOption } from './CometChatOption';

/**
 * CometChatMessageOption is a pre-defined structure for creating an option 
 * that can be used to perform an action on a message, such as edit, delete, etc.
 * It is used in CometChatMessageTemplate of modal.
 */
export class CometChatMessageOption extends CometChatOption {

    /**
     * Creates an instance of CometChatMessageOption.
     */
    constructor({
        /**
          * Unique identifier for each option.
          * @type {string}
          */
        id = "",

        /**
         * Heading text for each option.
         * @type {string}
         */
        title = "",

        /**
         * Sets the asset URL of the icon for each option.
         * @type {string}
         */
        iconURL = "",

        /**
         * Method to be invoked when user clicks on each option.
         * @type {(any) => void}
         */
        onClick = null,
    }) {
        super({ id, onClick, iconURL, title});
    }
}