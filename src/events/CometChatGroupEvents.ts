import { Subject } from 'rxjs';
import { CometChat } from '@cometchat/chat-sdk-javascript';

/**
 * Group event subjects for handling various group-related actions (e.g., group creation, member actions, ownership changes, etc.)
 */
export class CometChatGroupEvents {
    static ccGroupCreated: Subject<CometChat.Group> = new Subject<CometChat.Group>();
    static ccGroupDeleted: Subject<CometChat.Group> = new Subject<CometChat.Group>();
    static ccGroupMemberJoined: Subject<IGroupMemberJoined> = new Subject<IGroupMemberJoined>();
    static ccGroupLeft: Subject<IGroupLeft> = new Subject<IGroupLeft>();
    static ccGroupMemberAdded: Subject<IGroupMemberAdded> = new Subject<IGroupMemberAdded>();
    static ccGroupMemberScopeChanged: Subject<IGroupMemberScopeChanged> = new Subject<IGroupMemberScopeChanged>();
    static ccGroupMemberKicked: Subject<IGroupMemberKickedBanned> = new Subject<IGroupMemberKickedBanned>();
    static ccGroupMemberBanned: Subject<IGroupMemberKickedBanned> = new Subject<IGroupMemberKickedBanned>();
    static ccGroupMemberUnbanned: Subject<IGroupMemberUnBanned> = new Subject<IGroupMemberUnBanned>();
    static ccOwnershipChanged: Subject<IOwnershipChanged> = new Subject<IOwnershipChanged>();
    /**
     * Publishes a group event.
     * @param {Subject<CometChat.Group>} event - The event to publish.
     * @param {any} group - The group associated with the event.
     */

    static publishEvent(event: Subject<CometChat.Group>, group: any) {
        event.next(group);
    }
}

/**
 * Interfaces for various group-related events
 */
export interface IGroupMemberScopeChanged {
    message: CometChat.Action,
    updatedUser: CometChat.GroupMember,
    scopeChangedTo: any,
    scopeChangedFrom: any,
    group: CometChat.Group,
}
export interface IOwnershipChanged {
    group: CometChat.Group,
    newOwner: CometChat.GroupMember,
}

export interface IGroupMemberKickedBanned {
    message: CometChat.Action,
    kickedFrom: CometChat.Group,
    kickedUser: CometChat.User,
    kickedBy: CometChat.User,
}
export interface IGroupMemberUnBanned {
    message?: CometChat.Action,
    unbannedUser: CometChat.User,
    unbannedBy: CometChat.User,
    unbannedFrom: CometChat.Group,
}
export interface IGroupMemberAdded {
    messages: CometChat.Action[],
    usersAdded: CometChat.User[],
    userAddedIn: CometChat.Group,
    userAddedBy: CometChat.User,
}
export interface IGroupMemberJoined {
    joinedUser: CometChat.User,
    joinedGroup: CometChat.Group
}
// group left
export interface IGroupLeft {
    userLeft: CometChat.User,
    leftGroup: CometChat.Group,
    message: CometChat.Action
}