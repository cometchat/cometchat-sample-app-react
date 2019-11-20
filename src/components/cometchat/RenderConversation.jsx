import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faCloudDownloadAlt,
  faFilm,
  faPlay,
  faImage,
  faPencilAlt,
  faTrashAlt,
  faTimes,
  faPhoneAlt,
  faVideo
} from "@fortawesome/free-solid-svg-icons";
import waitMsgIco from "../../resources/images/MsgStatusIcons/wait@2x.png";
import sentMsgIco from "../../resources/images/MsgStatusIcons/sent@2x.png";
import seenMsgIco from "../../resources/images/MsgStatusIcons/seen@2x.png";
import deliveredMsgIco from "../../resources/images/MsgStatusIcons/delivered@2x.png";
import googleMapIco from "../../resources/images/google-maps-logo.png";

class RenderConversation extends Component {
  render() {
    const {
      msg,
      msgID,
      msgType,
      msgCategory,
      sentAt,
      avatar,
      readAt,
      deliveredAt,
      editedAt,
      attachmentData,
      handleMessageClick,
      showMsgAction,
      handleMessageDelete,
      handleMessageEdit,
      scrollToBottom
    } = this.props;

    if (msgCategory === "incoming") {
      return (
        <RenderIcomingMsg
          msg={msg}
          msgID={msgID}
          msgType={msgType}
          sentAt={sentAt}
          editedAt={editedAt}
          avatar={avatar}
          attachmentData={attachmentData}
          handleMessageClick={handleMessageClick}
          showMsgAction={showMsgAction}
          scrollToBottom={scrollToBottom}
        />
      );
    } else if (msgCategory === "groupMember" || msgCategory === "call") {
      return (
        <RenderJoinedMsg
          msg={msg}
          msgID={msgID}
          msgType={msgType}
          sentAt={sentAt}
          avatar={avatar}
          msgCategory={msgCategory}
        />
      );
    } else {
      return (
        <RenderOutgoingMsg
          msg={msg}
          msgID={msgID}
          msgType={msgType}
          sentAt={sentAt}
          deliveredAt={deliveredAt}
          editedAt={editedAt}
          readAt={readAt}
          attachmentData={attachmentData}
          handleMessageClick={handleMessageClick}
          showMsgAction={showMsgAction}
          handleMessageEdit={handleMessageEdit}
          handleMessageDelete={handleMessageDelete}
          scrollToBottom={scrollToBottom}
        />
      );
    }
  }
}

function RenderJoinedMsg({ msg, msgType, sentAt, msgCategory }) {
  let messageContent = "";
  if (msgCategory === "call") {
    msg = msg + " " + convertStringToDate(sentAt);
    let callIcon = <FontAwesomeIcon icon={faPhoneAlt} className="mr-1" />;
    if (msgType === "video")
      callIcon = <FontAwesomeIcon icon={faVideo} className="mr-1" />;
    messageContent = (
      <div className="msg-bubble ml-2 mr-1" title={msg}>
        {callIcon}
        {msg}
      </div>
    );
  } else {
    messageContent = (
      <div className="msg-bubble ml-2 mr-1" title={msg}>
        {msg}
      </div>
    );
  }

  return (
    <div className="member-activity-msg mb-3">
      <div className="msg-row">{messageContent}</div>
    </div>
  );
}
function RenderIcomingMsg({
  msg,
  msgType,
  sentAt,
  editedAt,
  avatar,
  attachmentData,
  handleMessageClick,
  scrollToBottom
}) {
  let messageContent = "";
  let messageEdited = "";
  let msgSentAt = (
    <span className="small msg-time">{convertStringToDate(sentAt)}</span>
  );

  if (editedAt !== undefined) {
    messageEdited = (
      <React.Fragment>
        <small>...</small>{" "}
        <FontAwesomeIcon icon={faPencilAlt} className="msg-edited-indicator" />
      </React.Fragment>
    );
  }
  if (msgType === CometChat.MESSAGE_TYPE.TEXT) {
    if (msg === undefined) {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
          {msg === undefined ? "Message deleted" : msg}
        </div>
      );
      msgSentAt = "";
    } else {
      messageContent = (
        <div className="msg-bubble ml-2 mr-1">
          {msg} {messageEdited}
        </div>
      );
    }
  } else if (msgType === CometChat.MESSAGE_TYPE.IMAGE) {
    if (msg === undefined || msg === "") {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
          Message deleted
        </div>
      );
      msgSentAt = "";
    } else {
      messageContent = (
        <div className="msg-media-img ml-2 mr-1">
          <a
            href={msg}
            title="View picture message"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={msg} alt="Pic message" onLoad={() => scrollToBottom()} />
            <div className="click-to-view-media">
              <div className="click-to-view-text">
                <FontAwesomeIcon icon={faImage} />
              </div>
            </div>
          </a>
        </div>
      );
    }
  } else if (msgType === CometChat.MESSAGE_TYPE.VIDEO) {
    if (msg === undefined || msg === "") {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
        Message deleted
      </div> );
    }
    else
    {
      messageContent = (
        <div className="msg-media-file ml-2 mr-1">
          <a
            href={msg}
            title="Play video message"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="attachment-file-msg px-3 py-3">
              <FontAwesomeIcon icon={faFilm} />
              <div className="attachment-data">
                <div>
                  {attachmentData !== undefined
                    ? attachmentData.fileName
                    : "File name not available"}
                </div>
                <small>
                  {attachmentData !== undefined
                    ? formatFileSize(attachmentData.fileSize)
                    : ""}
                </small>
              </div>
            </div>
            <div className="click-to-view-media">
              <div className="click-to-view-text">
                {" "}
                <FontAwesomeIcon icon={faPlay} />
              </div>
            </div>
          </a>
        </div>
      );
    }
  } else if (msgType === CometChat.MESSAGE_TYPE.AUDIO) {
    if (msg === undefined || msg === "") {
      messageContent = (<div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
        Message deleted
      </div>);
    }
    else
    {
      messageContent = (
        <div className="msg-media-img ml-2 mr-1">
          <audio controls title="Play audio message">
            <source src={msg} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
  } else if (msgType === CometChat.MESSAGE_TYPE.FILE) {
    if (msg === undefined || msg === "") {
      messageContent = (<div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
        Message deleted
      </div> );
    }
    else
    {
      messageContent = (
        <div className="msg-media-file ml-2 mr-1">
          <a
            href={msg}
            title="File message"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="attachment-file-msg px-3 py-3">
              <FontAwesomeIcon icon={faFileAlt} />
              <div className="attachment-data">
                <div>
                  {attachmentData !== undefined
                    ? attachmentData.fileName
                    : "Filename not available."}
                </div>
                <small>
                  {attachmentData !== undefined
                    ? formatFileSize(attachmentData.fileSize)
                    : ""}
                </small>
              </div>
            </div>
            <div className="click-to-view-media">
              <div className="click-to-view-text">
                {" "}
                <FontAwesomeIcon icon={faCloudDownloadAlt} />
              </div>
            </div>
          </a>
        </div>
      );
    }
  }
  else if (msgType === 'location') {
    messageContent = (
      <div className="msg-media-img location-marker ml-2 mr-1">
        <a
          href={msg}
          title="View location"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={googleMapIco} alt="location message" onLoad={() => scrollToBottom()} />
          <div className="click-to-view-media">
            <div className="click-to-view-text">
             
            </div>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="incoming-msg mb-3">
      <div className="msg-row text-left">
        <div className="msg-avatar">
          <img src={avatar} alt="user avatar" />
        </div>
        {messageContent}
        {msgSentAt}
      </div>
    </div>
  );
}

function RenderOutgoingMsg({
  msg,
  msgID,
  msgType,
  sentAt,
  readAt,
  deliveredAt,
  editedAt,
  attachmentData,
  handleMessageClick,
  showMsgAction,
  handleMessageEdit,
  handleMessageDelete,
  scrollToBottom
}) {
  let messageStatus = <img src={waitMsgIco} alt="waitMsgIco" />;

  if (readAt !== undefined) {
    messageStatus = <img src={seenMsgIco} alt="seenMsgIco" />;
  } else if (deliveredAt !== undefined) {
    messageStatus = <img src={deliveredMsgIco} alt="deliveredMsgIco" />;
  } else if (sentAt !== undefined) {
    messageStatus = <img src={sentMsgIco} alt="sentMsgIco" />;
  }

  let msgSentAt = (
    <span className="small msg-time">{convertStringToDate(sentAt)}</span>
  );
  let messageContent = "";
  let msgReadReciepts = (
    <span className="small read-reciept">{messageStatus}</span>
  );
  let messageEdited = "";
  if (editedAt !== undefined) {
    messageEdited = (
      <React.Fragment>
        <small>...</small>{" "}
        <FontAwesomeIcon icon={faPencilAlt} className="msg-edited-indicator" />
      </React.Fragment>
    );
  }
  if (msgType === CometChat.MESSAGE_TYPE.TEXT) {
    if (msg === undefined) {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
          {msg === undefined ? "Message deleted" : msg}
        </div>
      );
      msgSentAt = "";
      msgReadReciepts = "";
    } else {
      messageContent = (
        <div
          className="msg-bubble ml-2 mr-1"
          onClick={e => handleMessageClick(e, 0)}
          onContextMenu={e => handleMessageClick(e, msgID)}
        >
          {msg} {messageEdited}
        </div>
      );
    }
  } else if (msgType === CometChat.MESSAGE_TYPE.IMAGE) {
    if (msg === undefined || msg === "") {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
          Message deleted
        </div>
      );
      msgSentAt = "";
      msgReadReciepts = "";
    } else {
      messageContent = (
        <div
          className="msg-media-img ml-2 mr-1"
          onContextMenu={e => handleMessageClick(e, msgID)}
        >
          <a
            href={msg}
            title="View picture message"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={msg} alt="Pic message" onLoad={() => scrollToBottom()} />
            <div className="click-to-view-media">
              <div className="click-to-view-text">
                <FontAwesomeIcon icon={faImage} />
              </div>
            </div>
          </a>
        </div>
      );
    }
  } else if (msgType === CometChat.MESSAGE_TYPE.VIDEO) {
    if (msg === undefined || msg === "") {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
          Message deleted
        </div>
      );
      msgSentAt = "";
      msgReadReciepts = "";
    } else {
      messageContent = (
        <div
          className="msg-media-file ml-2 mr-1"
          onContextMenu={e => handleMessageClick(e, msgID)}
        >
          <a
            href={msg}
            title="Play video message"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="attachment-file-msg px-3 py-3">
              <FontAwesomeIcon icon={faFilm} />
              <div className="attachment-data">
                <div>
                  {attachmentData !== undefined
                    ? attachmentData.fileName
                    : "Filename not available"}
                </div>
                <small>
                  {formatFileSize(
                    attachmentData !== undefined ? attachmentData.fileSize : ""
                  )}
                </small>
              </div>
            </div>
            <div className="click-to-view-media">
              <div className="click-to-view-text">
                {" "}
                <FontAwesomeIcon icon={faPlay} />
              </div>
            </div>
          </a>
        </div>
      );
    }
  } else if (msgType === CometChat.MESSAGE_TYPE.AUDIO) {
    if (msg === undefined || msg === "") {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
          Message deleted
        </div>
      );
      msgSentAt = "";
      msgReadReciepts = "";
    } else {
      messageContent = (
        <div
          className="msg-media-img ml-2 mr-1"
          onContextMenu={e => handleMessageClick(e, msgID)}
        >
          <audio controls title="Play audio message">
            <source src={msg} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
  } else if (msgType === CometChat.MESSAGE_TYPE.FILE) {
    if (msg === undefined || msg === "") {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
          Message deleted
        </div>
      );
      msgSentAt = "";
      msgReadReciepts = "";
    } else {
      messageContent = (
        <div
          className="msg-media-file ml-2 mr-1"
          onContextMenu={e => handleMessageClick(e, msgID)}
        >
          <a
            href={msg}
            title="File message"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="attachment-file-msg px-3 py-3">
              <FontAwesomeIcon icon={faFileAlt} />
              <div className="attachment-data">
                <div>{attachmentData !== undefined ? attachmentData.fileName : ""}</div>
                <small>{formatFileSize(attachmentData !== undefined ? attachmentData.fileSize : "")}</small>
              </div>
            </div>
            <div className="click-to-view-media">
              <div className="click-to-view-text">
                {" "}
                <FontAwesomeIcon icon={faCloudDownloadAlt} />
              </div>
            </div>
          </a>
        </div>
      );
    }
  }
  else if (msgType === 'location') {
    if (msg === undefined || msg === "") {
      messageContent = (
        <div className="msg-bubble msg-bubble-deleted-msg ml-2 mr-1">
          Message deleted
        </div>
      );
      msgSentAt = "";
      msgReadReciepts = "";
    } else {
      messageContent = (
        <div
          className="msg-media-img location-marker ml-2 mr-1"
          onContextMenu={e => handleMessageClick(e, msgID)}
        >
          <a
            href={msg}
            title="View location"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img width="170px" src={googleMapIco} alt="location message" onLoad={() => scrollToBottom()} />
            <div className="click-to-view-media">
              <div className="click-to-view-text">
              </div>
            </div>
          </a>
        </div>
      );
    }
  }
  return (
    <div className="outgoing-msg mb-3">
      <div className="msg-row text-right">
        {msgSentAt}
        {messageContent}
        <RenderContextMenu
          showMsgAction={showMsgAction}
          msgID={msgID}
          msgType={msgType}
          msg={msg}
          handleMessageDelete={handleMessageDelete}
          handleMessageEdit={handleMessageEdit}
          handleMessageClick={handleMessageClick}
        />
        {msgReadReciepts}
      </div>
    </div>
  );
}

function RenderContextMenu({
  showMsgAction,
  msgID,
  msgType,
  msg,
  handleMessageClick,
  handleMessageEdit,
  handleMessageDelete
}) {
  let classes = "msgActions";
  if (!showMsgAction) classes += " d-none";
  let editedOption;
  if (msgType === CometChat.MESSAGE_TYPE.TEXT) {
    editedOption = (
      <FontAwesomeIcon
        className="text-info mr-2"
        icon={faPencilAlt}
        onClick={() => handleMessageEdit(msg)}
        title="Edit message"
      />
    );
  }
  return (
    <div className={classes}>
      <div className="msgActionList">
        {editedOption}
        <FontAwesomeIcon
          className="text-danger mr-3"
          icon={faTrashAlt}
          onClick={() => handleMessageDelete()}
          title="Delete message"
        />
        <FontAwesomeIcon
          className="text-secondary ml-2"
          icon={faTimes}
          onClick={e => handleMessageClick(e, 0)}
          title="Close message actions"
        />
      </div>
    </div>
  );
}

function convertStringToDate(strTime) {
  var timestamp = Number(strTime) * 1000;
  var date = new Date(timestamp);
  let timestr = formatAMPM(date);
  return timestr.toString();
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function formatFileSize(bytes, decimalPoint) {
  if (bytes === 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default RenderConversation;
