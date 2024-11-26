import { AIBaseConfiguration } from "../AIBaseConfiguration";
import backIcon from '../../assets/backbutton.svg'

/**
 * Represents the configuration for the AISmartReplies component.
 * 
 * This class allows customization of various aspects of the AISmartReplies component, 
 * including styles, icons, custom views, and API configurations.
 */
export class AISmartRepliesConfiguration extends AIBaseConfiguration {
    /**
     * The customView callback allows you to display a custom UI for conversation starters.
     * It receives the list of conversation starters and optional close and back callbacks.
     * 
     * @type {(response: Object, closeCallBack?: () => void, backCallBack?: () => void) => Promise<any>}
     */
    customView?: (response: Object, closeCallBack?: () => void, backCallBack?: () => void) => Promise<any>;

    /**
     * The URL for the custom back button icon. Defaults to an embedded back button icon.
     * 
     * @type {string}
     */
    backIconURL?: string = backIcon;

    /**
     * Creates an instance of AISmartRepliesConfiguration.
     * 
     * @param {Partial<AISmartRepliesConfiguration>} props - The properties to initialize the configuration.
     */
    constructor(props: Partial<AISmartRepliesConfiguration>) {
        super({});
        Object.assign(this, props);
    }
}
