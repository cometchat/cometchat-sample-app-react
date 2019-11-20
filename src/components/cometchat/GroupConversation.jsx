import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import {
  MESSAGE_TYPE_AUDIO,
  MESSAGE_TYPE_FILE,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_VIDEO
} from "../../constants";
import attachmentIco from "../../resources/images/attachment.png";
import sendMsgIco from "../../resources/images/send.imageset/Path@2x.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAudio,
  faFileImage,
  faFileVideo,
  faFileAlt,
  faEllipsisV,
  faPhoneAlt,
  faVideo,
  faUsers,
  faSignOutAlt,
  faMapMarkerAlt,
  faArrowLeft,
  faUsersCog
} from "@fortawesome/free-solid-svg-icons";
import Flip from "react-reveal/Flip";
import RenderConversation from "./RenderConversation";
import _ from "lodash";
import defaultGroupIco from "../../resources/images/group-default-avatar.png";
import MediaQuery from "react-responsive";

class GroupConversation extends Component {
  state = {
    members: []
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.activeConversation.guid !==
        prevProps.activeConversation.guid ||
      (_.isEmpty(this.state.members) &&
        this.props.activeConversation.guid !== undefined) ||
      (this.props.activeConversation.guid ===
        prevProps.activeConversation.guid &&
        this.props.activeConversation.membersCount !==
          prevProps.activeConversation.membersCount)
    ) {
      const subjectUID = this.props.subjectUID;
      var GUID = this.props.activeConversation.guid;
      var groupMemberRequest = new CometChat.GroupMembersRequestBuilder(GUID)
        .setLimit(4)
        .build();

      groupMemberRequest.fetchNext().then(
        groupMembers => {
          let members = [];
          if (!_.isEmpty(groupMembers)) {
            _.forEach(groupMembers, function(m) {
              if (m.uid === subjectUID) members = [...members, "You"];
              else members = [...members, m.name];
            });
          }
          this.setState({ members: members });
        },
        error => {
          this.setState({ members: [] });
        }
      );
    }
  }

  render() {
    const {
      guid: activeGUID,
      name: activeGroupName,
      icon: activeGroupIcon
    } = this.props.activeConversation;

    let attachment_show = this.props.showAttachmentOptions
      ? "chat-send-attachment"
      : "chat-send-attachment hidden";

    let utilities_contact_show = this.props.showContactUtilities
      ? "contact-utilities-list bg-white"
      : "contact-utilities-list bg-white hidden";

    let chat_body_header_classes = "chat-body-header py-3 d-flex ";
    let contact_name_classes = "mb-0 contact-name ";
    let contact_status_classes = "m-0 text-light-grey contact-status ";
    let chat_body_classes =
      "chat-body col-md-7 col-xl-8 col-sm-12 col-xs-12 p-0 ";
      let add_new_members;
    if (this.props.isMobile) {
      chat_body_header_classes += "px-2";
      contact_name_classes += "font-size-14";
      contact_status_classes += "font-size-14";

      chat_body_classes += this.props.chatBodyVisiblity;
    } else {
      chat_body_header_classes += "px-4";
    }

    if(this.props.ownerRights)
    {
      add_new_members =  <p
                            className="u-optn"
                            onClick={() => this.props.handleAddGroupMemberToggle()}
                            >
                            <FontAwesomeIcon icon={faUsersCog} />
                            &nbsp;Add new members
                          </p>;
    }

    return (
      <React.Fragment>
        <div
          className={chat_body_classes}
          onClick={e => this.props.showHideAttachSection}
        >
          <div className={chat_body_header_classes}>
            <div className="flex-fill">
              <MediaQuery maxDeviceWidth={767}>
                <FontAwesomeIcon
                  className="mx-1"
                  icon={faArrowLeft}
                  onClick={() => this.props.handleScreenChangesOnMobile()}
                />
              </MediaQuery>
              <div className="contact-avatar-small">
                <img
                  className="mr-2"
                  src={
                    activeGroupIcon === undefined
                      ? defaultGroupIco
                      : activeGroupIcon
                  }
                  alt="group icon"
                />
              </div>
              <div className="contact-data">
                <p className={contact_name_classes}>{activeGroupName}</p>
                <div className={contact_status_classes}>
                  <div className="status-text status-offline" id="members-list-chat">
                    {!_.isEmpty(this.state.members)
                      ? _.map(this.state.members).join(", ")
                      : ""}
                    {this.state.members.length > 3 ? " and others" : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-calling-optns my-2">
              <FontAwesomeIcon
                icon={faPhoneAlt}
                className="ml-4"
                onClick={e =>
                  this.props.makeCall(
                    "1",
                    activeGUID,
                    CometChat.RECEIVER_TYPE.GROUP
                  )
                }
              />
              <FontAwesomeIcon
                icon={faVideo}
                className="ml-4"
                onClick={e =>
                  this.props.makeCall(
                    "2",
                    activeGUID,
                    CometChat.RECEIVER_TYPE.GROUP
                  )
                }
              />
            </div>
            <div
              className="contact-utilities my-2 ml-4"
              onClick={this.props.showHideContactUtilites}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </div>
            <div className={utilities_contact_show}>
              <p
                className="u-optn"
                onClick={() => this.props.handleToggleSubSidebar()}
              >
                <FontAwesomeIcon icon={faUsers} />
                &nbsp;View members
              </p>
              {add_new_members}
              <p
                className="u-optn mb-0"
                onClick={() => this.props.handleLeaveGroup(activeGUID)}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                &nbsp;Leave group
              </p>
            </div>
          </div>

          <div className="chat-body-conversation p-4">
            {this.props.msghistory.map(m => {
              if (m.category === "action" && m.type !== "groupMember")
                return false;

              let msg = "";
              let attachmentData = [];
              let showMsgAction = false;
              if (m.category === "call") {
                if (m.action === "initiated") {
                  if (m.sender.uid === this.props.subjectUID) {
                    msg = "Outgoing @ ";
                  } else {
                    msg = "Incoming @ ";
                  }
                } else return false;
              } else if (m.type === "groupMember") {
                msg = m["message"];
                if (m.sender.uid === this.props.subjectUID) {
                  //self actions in group
                  if (m.action === "joined" || m.action === "left") {
                    msg = "You " + m.action;
                  } else if (
                    m.action === "banned" ||
                    m.action === "unbanned" ||
                    m.action === "kicked" ||
                    m.action === "added"
                  ) {
                    msg = "You " + m.action + " " + m.actionOn.name;
                  }
                } else {
                  if (
                    (m.action === "banned" || m.action === "unbanned") &&
                    m.actionFor.uid === this.props.subjectUID
                  ) {
                    msg = m.actionBy.name + " " + m.action + " You";
                  }
                }
              } else if(m.action !== undefined && m.action === "deleted")
                    msg = "";
                else if (m.type === CometChat.MESSAGE_TYPE.TEXT) {
                  msg = m["text"];
                } else if ((m.data.attachments !== undefined) && (m.type === CometChat.MESSAGE_TYPE.FILE || m.type === CometChat.MESSAGE_TYPE.IMAGE || m.type === CometChat.MESSAGE_TYPE.AUDIO || m.type === CometChat.MESSAGE_TYPE.VIDEO)) {
                  msg = m.data.url;
                }

              if (
                m.type === CometChat.MESSAGE_TYPE.FILE ||
                m.type === CometChat.MESSAGE_TYPE.VIDEO
              ) {
                attachmentData = m.attachment;
              }
              else if(m.type === "location")
              {
                  const lat = m.data.customData.latitude;
                  const lon = m.data.customData.longitude;
                  msg = "http://maps.google.com/maps?q="+lat+","+lon;
              }
              if (this.props.showMsgActionID === m.id) showMsgAction = true;
              if (m.category === "call") {
                return (
                  <RenderConversation
                    key={m.id}
                    msg={msg}
                    msgType={m.type}
                    sentAt={m.sentAt}
                    editedAt={m.editedAt}
                    msgCategory="call"
                    avatar={m.sender.avatar}
                    senderUID={m.sender.uid}
                  />
                );
              } else if (m.type === "groupMember") {
                return (
                  <RenderConversation
                    key={m.id}
                    msg={msg}
                    msgType={m.type}
                    sentAt={m.sentAt}
                    editedAt={m.editedAt}
                    msgCategory="groupMember"
                    avatar={m.sender.avatar}
                    senderUID={m.sender.uid}
                  />
                );
              } else if (m.sender.uid === this.props.subjectUID) {
                return (
                  <RenderConversation
                    key={m.id}
                    msg={msg}
                    msgType={m.type}
                    sentAt={m.sentAt}
                    editedAt={m.editedAt}
                    readAt={m.readAt}
                    deliveredAt={m.deliveredAt}
                    msgCategory="outgoing"
                    attachmentData={attachmentData}
                    senderUID={m.sender.uid}
                    handleMessageClick={this.props.handleMessageClick}
                    msgID={m.id}
                    showMsgAction={showMsgAction}
                    handleMessageDelete={this.props.handleMessageDelete}
                    handleMessageEdit={this.props.handleMessageEdit}
                    scrollToBottom={this.props.scrollToBottom}
                  />
                );
              } else {
                return (
                  <RenderConversation
                    key={m.id}
                    msg={msg}
                    msgType={m.type}
                    sentAt={m.sentAt}
                    editedAt={m.editedAt}
                    msgCategory="incoming"
                    avatar={m.sender.avatar}
                    attachmentData={attachmentData}
                    senderUID={m.sender.uid}
                    handleMessageClick={this.props.handleMessageClick}
                    msgID={m.id}
                    showMsgAction={showMsgAction}
                    handleMessageDelete={this.props.handleMessageDelete}
                    handleMessageEdit={this.props.handleMessageEdit}
                    scrollToBottom={this.props.scrollToBottom}
                  />
                );
              }
            })}
            {this.props.scrollToBottom()}
          </div>
          <div className="chat-body-sendmsg px-3 py-4">
            <div className="d-flex justify-content-between">
              <div className="mr-3">
                <img
                  src={attachmentIco}
                  id="attachmentIco"
                  alt="attachmentIco"
                  onClick={e => this.props.showHideAttachSection(e)}
                />
              </div>
              <div className="flex-fill">
                <input
                  type="text"
                  className="form-control"
                  id="typeAMsg"
                  placeholder="Type a message"
                  onChange={e => this.props.handleTextInputChange(e)}
                  onKeyPress={e => this.props.sendMessage(e, "text")}
                  value={this.props.newMessage}
                />
              </div>
              <div className="ml-3">
                <img
                  src={sendMsgIco}
                  id="sendMsgIco"
                  alt="sendMsgIcon"
                  onClick={e => this.props.sendMessage(e, "text")}
                />
              </div>
            </div>
          </div>

          <Flip bottom when={this.props.showAttachmentOptions}>
            <div className="chat-send-attachment-outer">
              <div className={attachment_show}>
                <div className="d-flex justify-content-between">
                  <div className="px-5 py-4 mx-1">
                    <div
                      className="attach-option"
                      title="Send a picture message"
                    >
                      <label htmlFor="attachment-type-2">
                        <FontAwesomeIcon icon={faFileImage} />
                      </label>
                      <input
                        type="file"
                        id="attachment-type-2"
                        onChange={e =>
                          this.props.handleAttachment(MESSAGE_TYPE_IMAGE)
                        }
                      />
                    </div>
                  </div>
                  <div className="px-5 py-4 mx-1">
                    <div className="attach-option" title="Send a video message">
                      <label htmlFor="attachment-type-3">
                        <FontAwesomeIcon icon={faFileVideo} />
                      </label>
                      <input
                        type="file"
                        id="attachment-type-3"
                        onChange={e =>
                          this.props.handleAttachment(MESSAGE_TYPE_VIDEO)
                        }
                      />
                    </div>
                  </div>
                  <div className="px-5 py-4 mx-1">
                    <div className="attach-option" title="Send a audio message">
                      <label htmlFor="attachment-type-4">
                        <FontAwesomeIcon icon={faFileAudio} />
                      </label>
                      <input
                        type="file"
                        id="attachment-type-4"
                        onChange={e =>
                          this.props.handleAttachment(MESSAGE_TYPE_AUDIO)
                        }
                      />
                    </div>
                  </div>
                  <div className="px-5 py-4 mx-1">
                    <div className="attach-option" title="Send a file message">
                      <label htmlFor="attachment-type-5">
                        <FontAwesomeIcon icon={faFileAlt} />
                      </label>
                      <input
                        type="file"
                        id="attachment-type-5"
                        onChange={e =>
                          this.props.handleAttachment(MESSAGE_TYPE_FILE)
                        }
                      />
                    </div>
                  </div>
                  <div className="px-5 py-4 mx-1">
                    <div className="attach-option" title="Send location">
                      <label htmlFor="attachment-type-1">
                        <FontAwesomeIcon icon={faMapMarkerAlt} onClick={e => this.props.sendCustomMessage()} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Flip>
        </div>
      </React.Fragment>
    );
  }
}

export default GroupConversation;
