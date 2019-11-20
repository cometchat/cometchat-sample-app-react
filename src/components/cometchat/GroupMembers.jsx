import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import GroupMember from "./GroupMember";
import _ from 'lodash';
import defaultUserIco from "../../resources/images/user-default-avatar.png";

class GroupMembers extends Component {

    state = {
                groupMembers: [],
                bannedMembers : [],
                nonMembers : [],
                groupMembersFetched : false,
                bannedMembersFetched : false,
                searchString : ""
            };

    componentDidUpdate(prevProps) {
        if ((_.isEmpty(this.state.groupMembers) && this.state.groupMembersFetched === false && this.props.activeGUID !== undefined)  || this.props.activeGUID !== prevProps.activeGUID || this.props.activeGUIDMemberCount !== prevProps.activeGUIDMemberCount) {
            
            var GUID = this.props.activeGUID;

            var limit = 30;

            var groupMemberRequest = new CometChat.GroupMembersRequestBuilder(GUID).setLimit(limit).build();

            groupMemberRequest.fetchNext().then(

                groupMembers => {
                   
                    var bannedMembersRequest = new CometChat.BannedMembersRequestBuilder(GUID).setLimit(limit).build();

                    bannedMembersRequest.fetchNext().then(
                        
                        bannedMembers => {

                            this.setState({ groupMembers: groupMembers, groupMembersFetched : true, bannedMembers: bannedMembers, bannedMembersFetched : true });
                        
                            
                        },
                        error => {

                            this.setState({ bannedMembers: [], bannedMembersFetched : true });
                       
                        }

                    );

                },
                error => {

                    this.setState({ groupMembers: [], groupMembersFetched : true });

                }

            );

        }

    }

    handleBanUnbanMember = (UID, isbanned)  =>
    {
        if(this.props.subjectUID !== UID && this.props.ownerRights)
        {
            const GUID = this.props.activeGUID;

            if(!isbanned) //active member
            {
                CometChat.banGroupMember(GUID, UID).then(
                    response => {
                        let groupMembers = this.state.groupMembers;
                        let memberIndex = _.findIndex(this.state.groupMembers, function(m) { return m.uid === UID; });
                        let bannedMembers = [...this.state.bannedMembers, groupMembers[memberIndex]];
                        _.pullAt(groupMembers, [memberIndex]);
                        this.setState({groupMembers, bannedMembers});
                        this.props.refreshActiveConversation(GUID);
                    },
                    error => {
                        
                    }
                );

            }
            else //banned member
            {
                CometChat.unbanGroupMember(GUID, UID).then(
                    response => {
                        let bannedMembers = this.state.bannedMembers;
                        let memberIndex = _.findIndex(bannedMembers, function(m) { return m.uid === UID; });
                        _.pullAt(bannedMembers, [memberIndex]);
                        this.setState({bannedMembers});
                        this.props.refreshActiveConversation(GUID);
                    },
                    error => {
                        
                    }
                );
            }
        }
        else
        {
            alert("You are not authorized");
        }
        
    }

    handleKickMember = (UID) => 
    {
        if(this.props.subjectUID !== UID  && this.props.ownerRights)
        {
            const GUID = this.props.activeGUID;

            CometChat.kickGroupMember(GUID, UID).then(
                response => {
                    let groupMembers = this.state.groupMembers;
                    let memberIndex = _.findIndex(this.state.groupMembers, function(m) { return m.uid === UID; });
                    _.pullAt(groupMembers, [memberIndex]);
                    this.setState({groupMembers});
                    this.props.refreshActiveConversation(GUID);
                },
                error => {
                    
                }
            );
        }
        else{
            alert("You are not authorized");
        }
    }

    render() {

        const { groupMembers, groupMembersFetched, bannedMembers } = this.state;
        const groupMembers_length = groupMembers.length;
        const bannedMembers_length = bannedMembers.length;
    
        if (groupMembers_length === 0 && bannedMembers_length) {
            if(groupMembersFetched)
            {
              return (
                  <div className="empty-contacts p-2 bg-white">No group members. </div>
              );
            }
            else
            {
              return (
                  <div className="contact-tab p-2 bg-white">Fetching group members...</div>
              );
            }
        } 
        else {

            let activeTitle;
            let bannedTitle = "";

            if(groupMembers.length > 0)
                activeTitle =  <div className="group-member-title">Active Members</div>;
            
            if(bannedMembers.length > 0)
                bannedTitle =  <div className="group-member-title">Banned Members</div>;
                
          return (
            <React.Fragment>
              <div className="group-member-listing bg-white">
                {activeTitle}
                {groupMembers.map(c => (
                  <GroupMember
                    key={c.uid}
                    uid={c.uid}
                    name={c.name}
                    avatar={c.avatar === undefined ? defaultUserIco : c.avatar}
                    status={c.status}
                    handleBanUnbanMember={this.handleBanUnbanMember}
                    handleKickMember={this.handleKickMember}
                    subjectUID={this.props.subjectUID}
                    banned = {false}
                    ownerRights={this.props.ownerRights}
                  />
                ))}
                {bannedTitle}
                {bannedMembers.map(c => (
                  <GroupMember
                    key={c.uid}
                    uid={c.uid}
                    name={c.name}
                    avatar={c.avatar === undefined ? defaultUserIco : c.avatar}
                    status={c.status}
                    handleBanUnbanMember={this.handleBanUnbanMember}
                    subjectUID={this.props.subjectUID}
                    banned={true}
                    ownerRights={this.props.ownerRights}
                  />
                ))}
              </div>
            </React.Fragment>
          );
        }
      }
}
 
export default GroupMembers;