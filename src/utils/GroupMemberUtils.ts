
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKitConstants } from "../constants/CometChatUIKitConstants";
import { CometChatOption } from "../modals";
import { localize } from "../resources/CometChatLocalize/cometchat-localize";

/**
 * A utility class for handling group member-related actions and options within CometChat.
 * It is used in CometChatGroupMembers component.
 */
export class GroupMemberUtils {

  /**
   * Retrieves the available options for a given group member based on their role and the group's state.
   * 
   * @param {CometChat.GroupMember} groupMember - The group member for whom the options are being fetched.
   * @param {CometChat.Group} group - The group to which the member belongs.
   * @param {string} [loggedInUser=""] - The UID of the logged-in user.
   * @returns {CometChatOption[] | string} - An array of options or the member's scope as a string.
   */
  static getViewMemberOptions(groupMember: CometChat.GroupMember, group: CometChat.Group, loggedInUser: string = "",additionalConfigurations?:any) {
    let options: CometChatOption[] | string = [];
    if (group.getOwner() == groupMember.getUid()) {
      options = CometChatUIKitConstants.groupMemberScope.owner
    } else {
      let loggedInUserScope: string = group.getOwner() == loggedInUser ? CometChatUIKitConstants.groupMemberScope.owner : group.getScope() ?? CometChatUIKitConstants.groupMemberScope.participant
      let isKickAllowed = !additionalConfigurations?.hideKickMemberOption &&  _allowedGroupMemberOptions[loggedInUserScope + groupMember.getScope()][CometChatUIKitConstants.GroupMemberOptions.kick];
      let isBanAllowed =  !additionalConfigurations?.hideBanMemberOption &&  _allowedGroupMemberOptions[loggedInUserScope + groupMember.getScope()][CometChatUIKitConstants.GroupMemberOptions.kick];
      let ischangeScopeAllowed =  !additionalConfigurations?.hideScopeChangeOption &&  _allowedGroupMemberOptions[loggedInUserScope + groupMember.getScope()][CometChatUIKitConstants.GroupMemberOptions.kick];
      if (isKickAllowed) {
        options.push(new CometChatOption({
          id: CometChatUIKitConstants.GroupMemberOptions.kick,
          title: localize("REMOVE")

        }))
      }
      if (isBanAllowed) {
        options.push(new CometChatOption({
          id: CometChatUIKitConstants.GroupMemberOptions.ban,
          title: localize("BLOCK")

        }))
      }
      if (ischangeScopeAllowed) {
        options.push(new CometChatOption({
          id: CometChatUIKitConstants.GroupMemberOptions.changeScope,
          title: localize("CHANGE_ROLE")

        }))
      }
      if (!isKickAllowed && !isBanAllowed && !ischangeScopeAllowed) {
        options = groupMember.getScope()
      }
    }
    return options
  }

  /**
   * Retrieves the available options for a banned group member.
   * 
   * @param {CometChat.Group} group - The group to which the member belongs.
   * @param {CometChat.GroupMember} groupMember - The banned group member.
   * @returns {CometChatOption[]} - An array of options available for the banned group member.
   */
  static getBannedMemberOptions(group: CometChat.Group, groupMember: CometChat.GroupMember) {
    if (_allowedGroupMemberOptions[group.getScope() + groupMember.getScope()][CometChatUIKitConstants.GroupMemberOptions.unban]) {
      return [new CometChatOption({
        id: CometChatUIKitConstants.GroupMemberOptions.unban


      })]
    }

  }

  /**
   * Determines whether a scope change is allowed for a group member.
   * 
   * @param {CometChat.Group} group - The group to which the member belongs.
   * @param {CometChat.GroupMember} groupMember - The group member whose scope is to be changed.
   * @returns {string[]} - An array of allowed scopes for the group member.
   */
  static allowScopeChange(group: CometChat.Group, groupMember: CometChat.GroupMember) {
    let scopes: string[] = _allowedGroupMemberOptions[group.getScope() + groupMember.getScope()][CometChatUIKitConstants.GroupMemberOptions.changeScope];
    if (scopes?.length > 0 && scopes.includes(groupMember.getScope())) {
      let index = scopes.indexOf(groupMember.getScope());
      scopes.splice(index, 1)
      scopes.unshift(groupMember.getScope())
    }
    return scopes
  }
}

interface groupMemberOptions {
  [key: string]: {
    kick: boolean;
    ban: boolean;
    unban: boolean;
    changeScope: never[];
    addMembers: boolean;
    delete: boolean;
    leave: boolean;
    bannedMembers: boolean;
    viewMembers: boolean;
  } | {
    kick: boolean;
    ban: boolean;
    unban: boolean;
    changeScope: string[];
  };
}
/**
 * A mapping of allowed options for group members based on their scope.
 * The key is a combination of the group and member scopes, and the value is an object
 * specifying whether certain actions (like kick, ban, unban, changeScope) are allowed.
 * 
 * @type {groupMemberOptions}
 * @private
 */
const _allowedGroupMemberOptions: groupMemberOptions = {
  [CometChatUIKitConstants.groupMemberScope.participant + CometChatUIKitConstants.groupMemberScope.participant]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [],
  },
  [CometChatUIKitConstants.groupMemberScope.participant + CometChatUIKitConstants.groupMemberScope.moderator]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [],
  },
  [CometChatUIKitConstants.groupMemberScope.participant + CometChatUIKitConstants.groupMemberScope.admin]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [],
  },
  [CometChatUIKitConstants.groupMemberScope.participant + CometChatUIKitConstants.groupMemberScope.owner]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [],
    [CometChatUIKitConstants.GroupOptions.addMembers]: false,
    [CometChatUIKitConstants.GroupOptions.delete]: false,
    [CometChatUIKitConstants.GroupOptions.leave]: true, //Details
    [CometChatUIKitConstants.GroupOptions.bannedMembers]: false,//Details
    [CometChatUIKitConstants.GroupOptions.viewMembers]: true//Details
  },
  [CometChatUIKitConstants.groupMemberScope.moderator + CometChatUIKitConstants.groupMemberScope.participant]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: true,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [CometChatUIKitConstants.groupMemberScope.participant, CometChatUIKitConstants.groupMemberScope.moderator],
  },
  [CometChatUIKitConstants.groupMemberScope.moderator + CometChatUIKitConstants.groupMemberScope.moderator]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [],
  },
  [CometChatUIKitConstants.groupMemberScope.moderator + CometChatUIKitConstants.groupMemberScope.admin]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [],
  },
  [CometChatUIKitConstants.groupMemberScope.moderator + CometChatUIKitConstants.groupMemberScope.owner]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [],
  },
  [CometChatUIKitConstants.groupMemberScope.admin + CometChatUIKitConstants.groupMemberScope.participant]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: true,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [CometChatUIKitConstants.groupMemberScope.participant, CometChatUIKitConstants.groupMemberScope.admin, CometChatUIKitConstants.groupMemberScope.moderator],
  },
  [CometChatUIKitConstants.groupMemberScope.admin + CometChatUIKitConstants.groupMemberScope.moderator]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: true,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [CometChatUIKitConstants.groupMemberScope.participant, CometChatUIKitConstants.groupMemberScope.admin, CometChatUIKitConstants.groupMemberScope.moderator],
  },
  [CometChatUIKitConstants.groupMemberScope.admin + CometChatUIKitConstants.groupMemberScope.admin]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [CometChatUIKitConstants.groupMemberScope.participant, CometChatUIKitConstants.groupMemberScope.admin, CometChatUIKitConstants.groupMemberScope.moderator],
  },
  [CometChatUIKitConstants.groupMemberScope.admin + CometChatUIKitConstants.groupMemberScope.owner]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: false,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: false,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [],
  },

  [CometChatUIKitConstants.groupMemberScope.owner + CometChatUIKitConstants.groupMemberScope.participant]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: true,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [CometChatUIKitConstants.groupMemberScope.participant, CometChatUIKitConstants.groupMemberScope.admin, CometChatUIKitConstants.groupMemberScope.moderator],
  },
  [CometChatUIKitConstants.groupMemberScope.owner + CometChatUIKitConstants.groupMemberScope.moderator]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: true,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [CometChatUIKitConstants.groupMemberScope.participant, CometChatUIKitConstants.groupMemberScope.admin, CometChatUIKitConstants.groupMemberScope.moderator],
  },
  [CometChatUIKitConstants.groupMemberScope.owner + CometChatUIKitConstants.groupMemberScope.admin]: {
    [CometChatUIKitConstants.GroupMemberOptions.kick]: true,
    [CometChatUIKitConstants.GroupMemberOptions.ban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.unban]: true,
    [CometChatUIKitConstants.GroupMemberOptions.changeScope]: [CometChatUIKitConstants.groupMemberScope.participant, CometChatUIKitConstants.groupMemberScope.admin, CometChatUIKitConstants.groupMemberScope.moderator],
  },
};
