
import { Subject } from 'rxjs';
import { CometChat } from '@cometchat/chat-sdk-javascript';
/**
 * Class to handle user-related events such as blocking and unblocking users
 */
export class CometChatUserEvents {
  static ccUserBlocked: Subject<CometChat.User> = new Subject<CometChat.User>();
  static ccUserUnblocked: Subject<CometChat.User> = new Subject<CometChat.User>();
  /**
   * Publishes a user event (like blocking/unblocking a user).
   * This function will emit the event using the 'next()' method of the Subject.
   * 
   * @param {Subject<CometChat.User>} event - The user event to be published (e.g., block or unblock).
   * @param {any} item - The item (user) associated with the event.
   */
  static publishEvent(event: Subject<CometChat.User>, item: any) {
    event.next(item);
  }
}