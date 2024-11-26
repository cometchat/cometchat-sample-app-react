import { AIBaseConfiguration } from "../AIBaseConfiguration";

/**
 * AIConversationStarterConfiguration provides customization options for the AI conversation starter view.
 * Extends the base configuration with additional properties specific to conversation starters.
 */
export class AIConversationStarterConfiguration extends AIBaseConfiguration {
    /**
     * Custom callback to display a custom UI for conversation starters.
     * @param {string[]} response - The list of conversation starters.
     * @param {() => void} [closeCallBack] - Optional callback to close the custom view.
     * @returns {Promise<JSX.Element>} A promise resolving to a custom view component.
     */
    customView?: (response: string[], closeCallBack?: () => void) => Promise<JSX.Element>;

    /**
     * Constructs a new AIConversationStarterConfiguration instance.
     * @param {Partial<AIConversationStarterConfiguration>} props - Partial properties to customize the conversation starter configuration.
     */
    constructor(props: Partial<AIConversationStarterConfiguration>) {
        super({});
        Object.assign(this, props);
    }
}