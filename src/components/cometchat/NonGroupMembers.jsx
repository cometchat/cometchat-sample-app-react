import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import NonGroupMember from "./NonGroupMember";
import _ from "lodash";
import defaultUserIco from "../../resources/images/user-default-avatar.png";

class NonGroupMembers extends Component {
  state = {
    nonGroupMembers: [],
    nonMembersFetched: false,
    searchString: ""
  };

  componentDidUpdate(prevProps) {
    if (
      (_.isEmpty(this.state.groupMembers) &&
        this.state.membersFetched === false &&
        this.props.activeGUID !== undefined) ||
      this.props.activeGUID !== prevProps.activeGUID ||
      this.props.activeGUIDMemberCount !== prevProps.activeGUIDMemberCount
    ) {
      var GUID = this.props.activeGUID;

      var limit = 30;

      var groupMemberRequest = new CometChat.GroupMembersRequestBuilder(GUID)
        .setLimit(limit)
        .build();

      groupMemberRequest.fetchNext().then(
        groupMembers => {
          var usersRequest = new CometChat.UsersRequestBuilder()
            .setLimit(50)
            .setSearchKeyword(this.state.searchString)
            .hideBlockedUsers(true)
            .build();

          usersRequest.fetchNext().then(
            userList => {
              _.forEach(groupMembers, function(g) {
                let u_index = _.findIndex(userList, function(o) {
                  return o.uid === g.uid;
                });
                _.pullAt(userList, [u_index]);
              });

              this.setState({
                nonGroupMembers: userList,
                nonMembersFetched: true
              });
            },
            error => {
              this.setState({
                nonGroupMembers: [],
                nonMembersFetched: true
              });
            }
          );
        },
        error => {
          this.setState({ nonGroupMembers: [], nonMembersFetched: true });
        }
      );
    }
  }

  handleAddMember = uid => {
    
    let GUID = this.props.activeGUID;
    let membersList = [
      new CometChat.GroupMember(uid, CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT)
    ];

    CometChat.addMembersToGroup(GUID, membersList, []).then(response => {
      this.props.refreshActiveConversation(GUID);
    });
  };

  render() {
    const { nonGroupMembers, nonMembersFetched } = this.state;
    const nonGroupMembers_length = nonGroupMembers.length;

    if (nonGroupMembers_length === 0) {
      if (nonMembersFetched) {
        return (
          <div className="empty-contacts p-2 bg-white">
            No new group members to add.{" "}
          </div>
        );
      } else {
        return (
          <div className="contact-tab p-2 bg-white">Fetching users...</div>
        );
      }
    } else {
      return (
        <React.Fragment>
          <div className="group-member-listing bg-white">
            <div className="group-member-title">Non group Members</div>
            {nonGroupMembers.map(c => (
              <NonGroupMember
                key={c.uid}
                uid={c.uid}
                name={c.name}
                avatar={c.avatar === undefined ? defaultUserIco : c.avatar}
                status={c.status}
                handleAddMember={this.handleAddMember}
                subjectUID={this.props.subjectUID}
                ownerRights={this.props.ownerRights}
              />
            ))}
          </div>
        </React.Fragment>
      );
    }
  }
}

export default NonGroupMembers;
