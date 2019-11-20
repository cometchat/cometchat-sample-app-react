import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import ChatBox from "./ChatBox";
import Zoom from "react-reveal/Zoom";
import Slide from "react-reveal/Slide";
import callAnswer from "../../resources/images/callaudio_answer@2x.png";
import callReject from "../../resources/images/callaudio_hangup@2x.png";
import MediaQuery from "react-responsive";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import defaultGroupIco from "../../resources/images/group-default-avatar.png";
import defaultUserIco from "../../resources/images/user-default-avatar.png";

class ChatContainer extends Component {
  state = {
    user: [],
    showCallNotification: false,
    call: []
  };

  componentDidMount() {
    if (this.props.user.authToken !== "") {
      CometChat.getLoggedinUser().then(user => {
        this.setState({ user: user });
      });
    } else window.location = "/#/login";

    var listnerID = "CALL_LISTENER";
    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived: call => {
          console.log("Incoming call:", call);
          this.handleShowingCallNotification(call);
        },
        onOutgoingCallAccepted: call => {
          console.log("Outgoing call accepted:", call);
          this.setState({ call });
          this.handleStartCall();
          
        },
        onOutgoingCallRejected: call => {
          if (!_.isEmpty(this.state.call)) {
            this.notify("Call rejected", "error");
          }
          console.log("Outgoing call rejected:", call);

          this.setState({ call: [] });
        },
        onIncomingCallCancelled: call => {
          if (!_.isEmpty(this.state.call)) {
            this.notify("Call cancelled", "error");
          }
          this.setState({ call: [] });
        }
      })
    );
  }

  componentWillUnmount() {
    CometChat.removeCallListener("CALL_LISTENER");
  }

  makeCall = (
    callTypeActive = 0,
    receiverID = 0,
    receiverType = CometChat.RECEIVER_TYPE.USER
  ) => {
    if (_.isEmpty(this.state.call)) {
      let callType = CometChat.CALL_TYPE.AUDIO;

      if (callTypeActive === "2") callType = CometChat.CALL_TYPE.VIDEO;
      var call = new CometChat.Call(receiverID, callType, receiverType);

      CometChat.initiateCall(call).then(
        outGoingCall => {
          this.handleShowingCallNotification(outGoingCall);
          // perform action on success. Like show your calling screen.
        },
        error => {
          this.setState({ call: [] });
        }
      );
    }
  };

  handleShowingCallNotification = call => {
    this.setState({ call });
  };

  handleStartCall = () => {
    var sessionID = this.state.call.sessionId;

    CometChat.startCall(
      sessionID,
      document.getElementById("callScreen"),
      new CometChat.OngoingCallListener({
        onUserJoined: user => {
          /* Notification received here if another user joins the call. */
          console.log("User joined call:", user);
          this.notify("Call connected", "success");
          /* this method can be use to display message or perform any actions if someone joining the call */
        },
        onUserLeft: user => {
          /* Notification received here if another user left the call. */
          console.log("User left call:", user);
          // this.setState({call : []});
          /* this method can be use to display message or perform any actions if someone leaving the call */
        },
        onCallEnded: call => {
          /* Notification received here if current ongoing call is ended. */
          console.log("Call ended:", call);
          this.setState({ call: [] });
          /* hiding/closing the call screen can be done here. */
        }
      })
    );
  };

  handleAcceptCall = () => {
    var sessionID = this.state.call.sessionId;

    CometChat.acceptCall(sessionID).then(
      call => {
        console.log("Call accepted successfully:", call);
        this.setState({ call });
        // start the call using the startCall() method
        this.handleStartCall();
      },
      error => {
        console.log("Call acceptance failed with error", error);
        this.setState({ call: [] });
        // handle exception
      }
    );
  };

  handleRejectCall = () => {
    var sessionID = this.state.call.sessionId;
    var status = CometChat.CALL_STATUS.REJECTED;
    CometChat.rejectCall(sessionID, status).then(
      call => {
        console.log("Call rejected successfully:", call);
        this.setState({ call: [] });
      },
      error => {
        console.log("Call rejection failed with error", error);
      }
    );
  };

  notify = (msg, type) => {
    if (type === "success") {
      toast.success(msg);
    } else if (type === "warn") {
      toast.warn(msg);
    } else if (type === "error") {
      toast.error(msg);
    } else {
      toast.info(msg);
    }
  };

  render() {
    if (this.props.user.authToken === "")
      return (
        <React.Fragment>
          <h3>Checking if user is logged in ...</h3>
        </React.Fragment>
      );

    const { name, avatar } = this.state.user;

    let callIncomingNotification =
      "call-notification-panel mt-3 mr-3 px-3 py-1 hidden";

    let callOutgoingNotification =
      "call-notification-panel mt-3 mr-3 px-3 py-1 hidden";

    let receiverData;
    let initiatorData;

    let callScreenClasses = "d-none";
    let chatBoxClasses = "row";

    if (
      !isEmpty(this.state.call) &&
      (this.state.call.action === "initiated" ||
        this.state.call.status === "initiated")
    ) {
      let { callInitiator: caller, callReceiver: callee } = this.state.call;
      if (this.state.call.receiverType === CometChat.RECEIVER_TYPE.USER) {
        if (callee !== undefined && callee.uid === this.state.user.uid) {
          //incoming call
          callIncomingNotification =
            "call-notification-panel mt-3 mr-3 px-3 py-1";
          //incoming call
          initiatorData = (
            <div className="call-reciever-data d-inline-block mr-3">
              <img src={caller.avatar === undefined ? defaultUserIco : caller.avatar} alt="caller pic" />
              <h4 className="d-inline-block">{caller.name}</h4>
            </div>
          );
        } else {
          //outgoing call
          callOutgoingNotification =
            "call-notification-panel mt-3 mr-3 px-3 py-1";

          receiverData = (
            <div className="call-reciever-data d-inline-block mr-3">
              <img src={callee.avatar === undefined ? defaultUserIco : callee.avatar} alt="callee pic" />
              <h4 className="d-inline-block">{callee.name}</h4>
            </div>
          );
        }
      } else if (
        this.state.call.receiverType === CometChat.RECEIVER_TYPE.GROUP
      ) {
        if (caller !== undefined && caller.uid === this.state.user.uid) {
          //outgoing call
          callOutgoingNotification =
            "call-notification-panel mt-3 mr-3 px-3 py-1";
          receiverData = (
            <div className="call-reciever-data d-inline-block mr-3">
              <img
                src={callee.icon !== undefined ? callee.icon : defaultGroupIco}
                alt="callee pic"
              />
              <h4 className="d-inline-block">{callee.name}</h4>
            </div>
          );
        } else {
          //incoming call
          callIncomingNotification =
            "call-notification-panel mt-3 mr-3 px-3 py-1";
          initiatorData = (
            <div className="call-reciever-data d-inline-block mr-3">
              <img src={caller.avatar === undefined ? defaultUserIco : caller.avatar} alt="caller pic" />
              <h4 className="d-inline-block">{caller.name}</h4>
            </div>
          );
        }
      }

      
    }
    if (!isEmpty(this.state.call) && this.state.call.action === "ongoing") {
      callScreenClasses = "";
      chatBoxClasses = "row";
    }
    return (
      <React.Fragment>
        <div className={chatBoxClasses}>
          <MediaQuery minDeviceWidth={992}>
            <Zoom>
              <div className="col-md-12 col-xl-2 col-sm-12 col-xs-12 pl-0 d-none d-sm-block logged-user">
                <div className=" text-center">
                  <img className="user-avatar" src={avatar === undefined ? defaultUserIco : avatar} alt="User Avatar" />
                  <h4 className="text-white text-center mt-3">{name}</h4>
                  <p className="text-center">
                    <span className="status status-available mr-2"></span>
                    <span className="text-white">Available</span>
                  </p>
                </div>
              </div>
            </Zoom>
          </MediaQuery>
          <Slide top>
            <div className="col-md-12 col-xl-10 col-sm-12 col-xs-12 p-0">
              <div className="border-0 row chat-box bg-white">
                <ChatBox
                  user={this.state.user}
                  handleShowingCallNotification={
                    this.handleShowingCallNotification
                  }
                  makeCall={this.makeCall}
                  callActive={
                    !_.isEmpty(this.state.call) ? this.state.call.action : false
                  }
                  handleLogout={this.props.handleLogout}
                  notify={this.notify}
                />
              </div>
            </div>
          </Slide>
        </div>
        <div className={callIncomingNotification}>
          <h5>Incoming Call</h5>
          <div id="audioCallNotification">
            {initiatorData}
            <div className="call-action-btns d-inline-block mx-2">
              <img
                src={callReject}
                alt="Reject call"
                onClick={() => this.handleRejectCall()}
              />
            </div>
            <div className="call-action-btns d-inline-block">
              <img
                src={callAnswer}
                alt="Answer call"
                onClick={() => this.handleAcceptCall()}
              />
            </div>
          </div>
        </div>

        <div className={callOutgoingNotification}>
          <h5>Outgoing Call</h5>
          <div id="audioCallNotification">{receiverData}</div>
        </div>
        <div id="callScreen" className={callScreenClasses}></div>
        <MediaQuery minDeviceWidth={992}>
          <ToastContainer />
        </MediaQuery>
      </React.Fragment>
    );
  }
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
export default ChatContainer;
