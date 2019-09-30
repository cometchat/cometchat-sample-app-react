import React, { Component } from "react";
import { Row } from "react-bootstrap";
import CCMessage from "./CCMessage";
import { connect } from "react-redux";
import { calculateAvailableHeight,CheckEmpty } from "./../../lib/uiComponentLib";
import * as actionCreator from "./../../store/actions/cc_action";
import { CometChat } from "@cometchat-pro/chat";

var heightCCMessageBox = calculateAvailableHeight(79, 65, "ccMessage");

var ccMessageBoxStyle = {
  height: heightCCMessageBox,
  overflow: "auto"
};

var ccNewMessageNotifierStyle = {
  top: heightCCMessageBox - 10
};

class CCMessageBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayStatusNewMessage: false
    };
    this.refsMessageBox = React.createRef();
  }

  componentWillMount() {
    this.fetchfirstTimeMessage(this.props.activeUser.type,this.props.activeUser.id);
    CometChat.addMessageListener(
      "CHAT_BOX_LISTENER",
      new CometChat.MessageListener({
        onTextMessageReceived: message => {
          this.markAsRead(message);
        },
        onMediaMessageReceived: message => {
          this.markAsRead(message);
        }
      })
    );
  }

  componentWillUnmount() {
    CometChat.removeMessageListener("CHAT_BOX_LISTENER");
  }

  markAsRead(msg) {
    if (msg.receiverType == "user") {
      if ((msg !== undefined && msg.readAt == undefined) && (msg.sender.uid == this.props.activeUser.id)) {
        CometChat.markAsRead(msg.id, msg.sender.uid, msg.receiverType);
      }
    } else {
      if ((msg !== undefined && msg.readByMeAt == undefined && msg.sender.uid !== this.props.loggedUid) && (msg.receiver == this.props.activeUser.id)) {
        CometChat.markAsRead(msg.id, msg.receiver, msg.receiverType);
      }
    }
  }

  fetchfirstTimeMessage(userType, userid) {
    try {
      this.props.getMessage(userType, userid, 50);
    } catch (error) {
      console.log(error);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.activeUser != this.props.activeUser) {
      this.fetchfirstTimeMessage(nextProps.activeUser.type,nextProps.activeUser.id);
    }
    return true;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  showUnReadButton = () => {
    this.setState({ displayStatusNewMessage: true });
  };

  hideUnReadButton = () => {
    this.setState({ displayStatusNewMessage: false });
  };

  scrollToBottom() {
    var node = document.getElementById("ccMessageBox");
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (!bottom) {
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    var displayStatus = this.state.displayStatusNewMessage;
    let classVar = ["messageBoxNewMessageNotification"];
    if (displayStatus) {
      classVar.push("displayBlock");
    } else {
      classVar.push("hideBlock");
    }
    var messageUser = this.props.messageList.find(e => {
      if (e.muid == this.props.activeUser.id) {
        return e;
      }
    });
    if (!CheckEmpty(messageUser)) {
      return (
        <div id="ccMessageBoxContainer" key="15646896846sadasd">
          <Row
            ref={this.refsMessageBox}
            key="ccmessagebox_b"
            id="ccMessageBox"
            className="ccMessageBox"
            style={ccMessageBoxStyle}
          ></Row>
        </div>
      );
    } else {
      return (
        <div id="ccMessageBoxContainer" key="15646896846">
          <div
            ref={this.refsMessageBox}
            key="ccmessagebox_d"
            id="ccMessageBox"
            className="ccMessageBox row"
            style={ccMessageBoxStyle}
          >
            {messageUser.message.map((msg, index) => {
              if (index == messageUser.length - 1) {
                this.scrollToBottom();
              }
              return <CCMessage key={msg.id} msgData={msg} />;
            })}
          </div>

          <Row
            key="ccunreadMessage"
            class={classVar.join(" ")}
            style={ccNewMessageNotifierStyle}
            onClick={this.scrollToBottom.bind(this)}
          >
            <span>Recent message ▼</span>
          </Row>
        </div>
      );
    }
  }
}

const mapStateToProps = store => {
  return {
    messageList: store.message.messages,
    loggedUid: store.users.loggedInUser.uid,
    activeUser: store.message.activeMessage
  };
};

const mapDispachToProps = dispatch => {
  return {
    getMessage: (uType, uid, limit) => dispatch(actionCreator.getUserMessageHistory(uType, uid, limit))
  };
};

export default connect(mapStateToProps,mapDispachToProps)(CCMessageBox);
