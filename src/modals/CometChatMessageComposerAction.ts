
/**
 * CometChatMessageComposerAction is a pre-defined structure for creating an attachment option 
 * in the CometChatMessageComposer component that the user can perform in addition to composing a message.
 * It is used in AI module, CometChatMessageComposer component and Poll extension.
 */

export class CometChatMessageComposerAction {
   /**
     * Unique identifier for the attachment option.
     * @type {string}
     */
    id:string = "";

    /**
     * Asset URL for the icon to symbolize an attachment option.
     * @type {string}
     */
    iconURL:string = "";

    /** 
     * Function invoked when the user clicks on the attachment option.
     * @type {(() => void) | null}
     */
    onClick: (() => void) | null = null;

     /**
     * Heading text for the attachment option.
     * @type {string}
     */
    title?:string = "";

     
    /**
     * Creates an instance of CometChatMessageComposerAction.
     * 
     * @param {Partial<CometChatMessageComposerAction>} props - Partial properties to initialize the action item.
     */
    constructor(props: Partial<CometChatMessageComposerAction>) {
        Object.assign(this, props);
      }

}
