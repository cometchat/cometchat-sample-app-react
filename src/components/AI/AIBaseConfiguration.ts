import { CometChat } from '@cometchat/chat-sdk-javascript'
import emptyIcon from '../assets/ai-empty.svg'
import errorIcon from '../assets/ai-error.svg'
import loadingIcon from '../assets/Spinner.svg'
/**
 * AIBaseConfiguration is a base configuration class that provides options for customizing the appearance and behavior of AI-related components.
 */
export class AIBaseConfiguration {
    /**
     * Overrides the default API configuration for fetching data.
     * @param {CometChat.User} [user] - The user object.
     * @param {CometChat.Group} [group] - The group object.
     * @returns {Promise<Object>} A promise resolving to a custom configuration object.
     */
    apiConfiguration?: (user?: CometChat.User, group?: CometChat.Group) => Promise<Object>;

    /**
     * Custom view component for displaying the error state.
     * @type {any}
     */
    errorStateView?: JSX.Element;

    /**
     * Custom view component for displaying the empty state.
     * @type {any}
     */
    emptyStateView?: JSX.Element;

    /**
     * Custom view component for displaying the loading state.
     * @type {any}
     */
    loadingStateView?: JSX.Element;

    /**
     * URL for the loading icon.
     * @type {string}
     * @default loadingIcon
     */
    loadingIconURL?: string = loadingIcon;

    /**
     * URL for the error icon.
     * @type {string}
     * @default errorIcon
     */
    errorIconURL?: string = errorIcon;

    /**
     * URL for the empty state icon.
     * @type {string}
     * @default emptyIcon
     */
    emptyIconURL?: string = emptyIcon;

    /**
     * Constructs a new AIBaseConfiguration instance.
     * @param {Partial<AIBaseConfiguration>} props - Partial properties to customize the base configuration.
     */
    constructor(props: Partial<AIBaseConfiguration>) {
        Object.assign(this, props);
    }
}