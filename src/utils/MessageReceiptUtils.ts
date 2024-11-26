
/**
 * Utility class for handling message receipt statuses.
 * It is used in CometChatConversations and CometChatMessageList components.
 */
export class MessageReceiptUtils {

  /**
   * Gets the receipt status icon for a given message.
   *
   * Determines the receipt status based on the message's properties and returns
   * the corresponding receipt icon.
   *
   * @param {CometChat.BaseMessage} messageObject - The message object for which to get the receipt status.
   * @returns {receipts} - The receipt status icon.
   */
  static getReceiptStatus = (messageObject: CometChat.BaseMessage) => {
    let icon = receipts.wait;
    if ((messageObject as any)?.error || (messageObject as any)?.metadata?.error) {
      icon = receipts.error;
    }
    else if (messageObject?.getReadAt()) {
      icon = receipts.read;
    } else if (!messageObject?.getReadAt() && messageObject?.getDeliveredAt()) {
      icon = receipts.delivered;
    } else if (messageObject?.getSentAt() && messageObject?.getId()) {
      icon = receipts.sent;
    } else {
      icon = receipts.wait;
    }
    return icon
  }
}

/**
 * Enum representing different receipt statuses for a message.
 *
 * @readonly
 * @enum {number}
 */
export enum receipts {
  /**
   * Status indicating that the message is waiting to be processed.
   */
  wait,

  /**
   * Status indicating that the message has been sent.
   */
  sent,

  /**
   * Status indicating that the message has been delivered.
   */
  delivered,

  /**
   * Status indicating that the message has been read.
   */
  read,

  /**
   * Status indicating that an error occurred with the message.
   */
  error
}