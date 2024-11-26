import { AIBaseConfiguration } from "../AIBaseConfiguration";
import closeIcon from '../../assets/close2x.svg'

/**
 * AIConversationSummaryConfiguration provides customization options for the AI conversation summary view.
 * Extends the base configuration with additional properties specific to conversation summaries.
 */
export class AIConversationSummaryConfiguration extends AIBaseConfiguration {
    /**
     * Custom callback to display a custom UI for conversation summaries.
     * @param {string} response - The conversation summary response.
     * @param {() => void} [closeCallBack] - Optional callback to close the custom view.
     * @returns {Promise<any>} A promise resolving to a custom view component.
     */
    customView?: (response: string, closeCallBack?: () => void) => Promise<any>;

    /**
     * The threshold for the number of unread messages required to generate a conversation summary.
     * @type {number}
     * @default 30
     */
    unreadMessageThreshold?: number = 30;

    /**
     * URL for the custom close button icon.
     * @type {string}
     * @default closeIcon
     */
    closeIconURL?: string = closeIcon;

    /**
     * Constructs a new AIConversationSummaryConfiguration instance.
     * @param {Partial<AIConversationSummaryConfiguration>} props - Partial properties to customize the conversation summary configuration.
     */
    constructor(props: Partial<AIConversationSummaryConfiguration>) {
        super({});
        Object.assign(this, props);
    }
}