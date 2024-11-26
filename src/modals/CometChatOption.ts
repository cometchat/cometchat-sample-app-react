/**
 * Defines an option for message actions like edit or delete.
 * Allows customization of text, icon, and click behavior.
 * It is used in CometChatConversations, CometChatGroupMembers, CometChatGroups, CometChatUsers components.
 */
export class CometChatOption {
  /** Unique identifier for the option. */
  public id?: string = "";

  /** Text label for the option. */
  public title?: string = "";

  /** URL of the icon representing the option. */
  public iconURL?: string = "";

  /** Function to be called when the option is clicked. */
  public onClick?: any = null;

  /**
   * Creates a new CometChatOption instance.
   * @param {Partial<CometChatOption>} props - Properties to initialize the option.
   */
  constructor(props: Partial<CometChatOption>) {
      Object.assign(this, props);
  }
}