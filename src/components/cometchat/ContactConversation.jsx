import React from "react";
import { CometChat } from "@cometchat-pro/chat";
import {
  MESSAGE_TYPE_AUDIO,
  MESSAGE_TYPE_FILE,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_VIDEO
} from "../../constants";
import attachmentIco from "../../resources/images/attachment.png";
import sendMsgIco from "../../resources/images/send.imageset/Path@2x.png";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAudio,
  faFileImage,
  faFileVideo,
  faFileAlt,
  faEllipsisV,
  faPhoneAlt,
  faVideo,
  faSignOutAlt,
  faMapMarkerAlt,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import Flip from "react-reveal/Flip";
import RenderConversation from "./RenderConversation";
import MediaQuery from "react-responsive";
import defaultUserIco from "../../resources/images/user-default-avatar.png";

const ContactConversation = props => {
  const {
    uid: activeContactUID,
    name: activeContactName,
    avatar: activeContactAvatar,
    status: activeContactStatus
  } = props.activeConversation;

  let contact_status = activeContactStatus;

  //check for typing indicator
  let typingIndicator = _.findIndex(props.typingIndicatorUIDs, function(i) {
    return i === activeContactUID;
  });
  if (typingIndicator > -1)
    contact_status = <span className="product_italic">typing...</span>;

  let act_status_classes = "status-text status-";

  act_status_classes += activeContactStatus;

  let attachment_show = props.showAttachmentOptions
    ? "chat-send-attachment"
    : "chat-send-attachment hidden";

  let utilities_contact_show = props.showContactUtilities
    ? "contact-utilities-list bg-white"
    : "contact-utilities-list bg-white hidden";

  let chat_body_header_classes = "chat-body-header py-3 d-flex ";
  if (props.isMobile) {
    chat_body_header_classes += "px-2";
  } else {
    chat_body_header_classes += "px-4";
  }
  return (
    <React.Fragment>
      <div
        className="chat-body col-md-7 col-xl-8 col-sm-12 col-xs-12 p-0"
        onClick={e => props.showHideAttachSection}
      >
        <div className={chat_body_header_classes}>
          <div className="flex-fill">
            <MediaQuery maxDeviceWidth={767}>
              <FontAwesomeIcon
                className="ml-1 mr-2 back-arrow"
                icon={faArrowLeft}
                onClick={() => props.handleScreenChangesOnMobile()}
              />
            </MediaQuery>
            <div className="contact-avatar-small">
              <img
                className="mr-2"
                src={activeContactAvatar !== undefined ? activeContactAvatar : defaultUserIco}
                alt="contact avatar"
              />
            </div>
            <div className="contact-data">
              <p className="mb-0 contact-name">{activeContactName}</p>
              <p className="m-0 text-light-grey contact-status">
                <span className={act_status_classes}>{contact_status}</span>
              </p>
            </div>
          </div>

          <div className="contact-calling-optns my-2">
            <FontAwesomeIcon
              icon={faPhoneAlt}
              className="ml-4"
              onClick={e => props.makeCall("1", activeContactUID)}
            />
            <FontAwesomeIcon
              icon={faVideo}
              className="ml-4"
              onClick={e => props.makeCall("2", activeContactUID)}
            />
          </div>

          <div
            className="contact-utilities my-2 ml-4"
            onClick={props.showHideContactUtilites}
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </div>
          <div className={utilities_contact_show}>
            <p
              className="u-optn"
              onClick={() => props.handleBlockUser([activeContactUID])}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              &nbsp;Block
            </p>
          </div>
        </div>
        <div className="chat-body-conversation p-4">
          {props.msghistory.map(m => {
            if (m.category === "action") return false;
            let msg = "";
            let attachmentData = [];
            let showMsgAction = false;
            let messageType = m.type;

            if (m.category === "call") {
              if (m.action === "initiated") {
                if (m.receiverId === props.subjectUID) {
                  msg = "Incoming @ ";
                } else {
                  msg = "Outgoing @ ";
                }
              } else return false;
            } else {
                if(m.action !== undefined && m.action === "deleted")
                  msg = "";
              else if (m.type === CometChat.MESSAGE_TYPE.TEXT) {
                msg = m["text"];
              } else if ((m.data.attachments !== undefined) && (m.type === CometChat.MESSAGE_TYPE.FILE || m.type === CometChat.MESSAGE_TYPE.IMAGE || m.type === CometChat.MESSAGE_TYPE.AUDIO || m.type === CometChat.MESSAGE_TYPE.VIDEO)) {
                msg = m.data.url;
              }
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
            
            if (props.showMsgActionID === m.id) showMsgAction = true;
            if (m.category === "call") {
              return (
                <RenderConversation
                  key={m.id}
                  msg={msg}
                  msgType={messageType}
                  sentAt={m.sentAt}
                  readAt={m.readAt}
                  editedAt={m.editedAt}
                  deliveredAt={m.deliveredAt}
                  msgCategory="call"
                  attachmentData={attachmentData}
                  handleMessageClick={props.handleMessageClick}
                  msgID={m.id}
                  showMsgAction={showMsgAction}
                  handleMessageDelete={props.handleMessageDelete}
                  handleMessageEdit={props.handleMessageEdit}
                  scrollToBottom={props.scrollToBottom}
                />
              );
            } else if (m.sender.uid === props.subjectUID) {
              return (
                <RenderConversation
                  key={m.id}
                  msg={msg}
                  msgType={messageType}
                  sentAt={m.sentAt}
                  readAt={m.readAt}
                  editedAt={m.editedAt}
                  deliveredAt={m.deliveredAt}
                  msgCategory="outgoing"
                  attachmentData={attachmentData}
                  handleMessageClick={props.handleMessageClick}
                  msgID={m.id}
                  showMsgAction={showMsgAction}
                  handleMessageDelete={props.handleMessageDelete}
                  handleMessageEdit={props.handleMessageEdit}
                  scrollToBottom={props.scrollToBottom}
                />
              );
            } else {
              return (
                <RenderConversation
                  key={m.id}
                  msg={msg}
                  msgType={messageType}
                  sentAt={m.sentAt}
                  editedAt={m.editedAt}
                  msgCategory="incoming"
                  avatar={m.sender.avatar === undefined ? defaultUserIco : m.sender.avatar}
                  attachmentData={attachmentData}
                  handleMessageClick={props.handleMessageClick}
                  msgID={m.id}
                  showMsgAction={showMsgAction}
                  handleMessageDelete={props.handleMessageDelete}
                  handleMessageEdit={props.handleMessageEdit}
                  scrollToBottom={props.scrollToBottom}
                />
              );
            }
          })}
        </div>
        <div className="chat-body-sendmsg px-3 py-4">
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <img
                src={attachmentIco}
                id="attachmentIco"
                alt="attachmentIco"
                onClick={e => props.showHideAttachSection(e)}
              />
            </div>
            <div className="flex-fill">
              <input
                type="text"
                className="form-control"
                id="typeAMsg"
                placeholder="Type a message"
                onChange={e => props.handleTextInputChange(e)}
                onKeyPress={e => props.sendMessage(e, "text")}
                value={props.newMessage}
              />
            </div>
            <div className="ml-3">
              <img
                src={sendMsgIco}
                id="sendMsgIco"
                alt="sendMsgIcon"
                onClick={e => props.sendMessage(e, "text")}
              />
            </div>
          </div>
        </div>

        <Flip bottom when={props.showAttachmentOptions}>
          <div className="chat-send-attachment-outer">
            <div className={attachment_show}>
              <div className="d-flex justify-content-between">
                <div className="px-5 py-4 mx-1">
                  <div className="attach-option" title="Send a picture message">
                    <label htmlFor="attachment-type-2">
                      <FontAwesomeIcon icon={faFileImage} />
                    </label>
                    <input
                      type="file"
                      id="attachment-type-2"
                      onChange={e => props.handleAttachment(MESSAGE_TYPE_IMAGE)}
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
                      onChange={e => props.handleAttachment(MESSAGE_TYPE_VIDEO)}
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
                      onChange={e => props.handleAttachment(MESSAGE_TYPE_AUDIO)}
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
                      onChange={e => props.handleAttachment(MESSAGE_TYPE_FILE)}
                    />
                  </div>
                </div>
                <div className="px-5 py-4 mx-1">
                  <div className="attach-option" title="Send location">
                    <label htmlFor="attachment-type-1">
                      <FontAwesomeIcon icon={faMapMarkerAlt} onClick={e => props.sendCustomMessage()} />
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
};

export default ContactConversation;
