//cometchat login

import CCManager from "./../../lib/cometchat/ccManager";
import { CometChat, sendMessage } from "@cometchat-pro/chat";

//set User Session
export const loginInCC = (dispatch, UID) => {
  return dispatch => {
    CometChat.login(UID, CCManager.apiKey)
      .then(user => {
        console.log("AppUser Information :", { user });
        return dispatch(setUserSession(user));
      })
      .catch(error => {
        console.log("Print Error : ", { error });
      });
  };
};

export const setUserSession = val => {
  return {
    type: "setUserSession",
    user: val
  };
};

//setActiveUser

export const setActiveMessages = (uid, type) => {
  console.log("inside setActiveMessages " + uid + " type : " + type);
  return dispatch => {
    return dispatch(setActiveMessage(uid, type));
  };
};

export const setActiveMessage = (key, val) => {
  console.log("inside setActiveMessage " + key + " type : " + val);
  return {
    type: "updateActiveMessage",
    uid: key,
    utype: val
  };
};

//get the user
export const getUsers = (limit = 50) => {

  CCManager.setUserRequestBuilder(limit);
  return dispatch => {
    CCManager.userRequest.fetchNext().then(
      users => {
        dispatch(updateHandler());
        return dispatch(updateUserList(users));
      },
      error => {
        console.log("Print Error : " + JSON.stringify(error));
      }
    );
  };
};

export const getNextUserList = () => {
  return dispatch => {
    CCManager.userRequest.fetchNext().then(
      users => {
        console.log("new users", JSON.stringify(users));
        return dispatch(updateUserList(users));
      },
      error => {
        console.log("Print Error : " + JSON.stringify(error));
      }
    );
  };
};

export const updateHandler = () => {
  return {
    type: "UPDATED_STAGE"
  };
};
//Set UpdateUserList

export const updateUserList = val => {
  return {
    type: "updateUserList",
    users: val
  };
};

//getGroups
export const getGroups = (limit = 50) => {
  
  CCManager.setGroupRequestBuilder(limit);

  return dispatch => {
    CCManager.groupRequest.fetchNext().then(
      groups => {
        dispatch(updateHandler());
        return dispatch(updateGroupList(groups));
      },
      error => {
        console.log("Print Error : " + JSON.stringify(error));
      }
    );
  };
};

//getGroups
export const getNextGroupList = () => {
  return dispatch => {
    CCManager.groupRequest.fetchNext().then(
      groups => {
        console.log("Group Request output : " + JSON.stringify(groups));
        return dispatch(updateGroupList(groups));
      },
      error => {
        console.log("Print Error : " + JSON.stringify(error));
      }
    );
  };
};

//UpdateGroupList
export const updateGroupList = val => {
  return {
    type: "updateGroupList",
    groups: val
  };
};

//addMessageListener

export const addMessageListener = dispatch => {
  console.log("inside addMessageListener ccAction", { dispatch });
  CCManager.addMessageListener(dispatch);
  CCManager.addUserEventListener(dispatch);
  CCManager.addGroupEventListener(dispatch);
  CCManager.addCallListener(dispatch);
  dispatch(updateHandler());
};

//handle action message

export const handleActionMessage = actionMsg => {
  console.log("Action Message recieved : " + JSON.stringify(actionMsg));
  return {
    type: "NoAction"
  };
};

//handle Message

export const handleMessage = (msg, dispatch) => {
  if(msg.receiverType=="user"){
    console.log("Text Message recieved from : " + msg.sender);
    dispatch(updateMessage(msg.sender.uid, msg, "text Recieved : "));
  }else{

    dispatch(updateMessage(msg.receiver,msg,"text recieved for group"));

  }  
};

//sendTextMessage

export const sendTextMessage = (uid, text, msgType) => {
  console.log("messazgetype " + msgType);

  let textMessage = CCManager.getTextMessage(uid, text, msgType);
  if(msgType == "user"){
    return dispatch => {
      CometChat.sendMessage(textMessage).then(
        message => {
          // if(message instanceof TextMessage){
          //console.log("mesage callback : " + JSON.stringify(message));
          return dispatch(updateMessage(uid, message, "sendText"));
          //}
        },
        error => {
          console.log("mesage callback error : " + JSON.stringify(error));
          //Handle any error
        }
      );
    };
  }else{
    return dispatch => {
      CometChat.sendMessage(textMessage).then(
        message => {
        },
        error => {
          console.log("mesage callback error : " + JSON.stringify(error));
        }
      );
    };
  }
  
};

//sendMediaMessage

export const sendMediaMessage = (uid, text, msgType,mediaType) => {
  console.log("media messazgetype " + msgType);

  let mediaMessage = CCManager.getMediaMessage(uid, text, msgType,mediaType);

  return dispatch => {
    CometChat.sendMessage(mediaMessage).then(
      message => {
        console.log("message sent successfully",message);
        return dispatch(updateMessage(uid, message, "sendText"));
      },
      error => {
        console.log("mesage callback error : " + JSON.stringify(error));
        //Handle any error
      }
    );
  };
};

export const updateMessage = (user, val, tag) => {
  return {
    type: "updateMessage",
    message: val,
    uid: user,
    tags: tag
  };
};

export const updateMessageList = (message, val) => {
  return {
    type: "updateMessageList",
    messages: message,
    uid: val
  };
};

//getUserMessageHistory
export const getUserMessageHistory = ( utype, uid, limit = 50) => {
  console.log("user id for other party : " + uid);
  
  let messageRequest = CCManager.messageRequestBuilder(utype, uid, limit);
  

  return dispatch => {
    messageRequest
      .fetchPrevious()
      .then(messages => {
        console.log("mesage callback : " + JSON.stringify(messages));
        // handle list of messages received
        return dispatch(updateMessageList(messages, uid));
      })
      // .catch(error => {
      //   //         // handle exception
      //   console.log("mesage callback error : " + JSON.stringify(error));
      // });
  };
};

//set startFetching

export const startFetching = () => {
  return {
    type: "SYNC_STARTED",
    status: 1
  };
};


export const joinGroup =(group)=>{

  console.log("inside group");

  CometChat.joinGroup(group.guid,group.name,CometChat.Group.Type.Public,'').then(
    groupData =>{
      console.log("Joined Group", groupData);
    }
  )
}


export const initializeCall = (uid,callType,userType) =>{

  var call = CCManager.getCall(uid,callType,userType)

  return dispatch => {

    CometChat.initiateCall(call).then(
      outGoingCall => {
          console.log("Call initiated successfully:", JSON.stringify(outGoingCall));
          // perform action on success. Like show your calling screen.
      },
      error => {
          console.log("Call initialization failed with exception:", error);
      }
    );
  
  };
  
}


export const handleIncomingCall = (call, dispatch) => {
    dispatch(updateCall(call,"incoming call"));
};

export const updateCall = (call,tag) => {
  return {
    type: "INCOMING_CALL", 
    data:call,
    tags: tag
  };
};


export const acceptCall=(call)=>{

  console.log("accept call object", call);

    var sessionID = call.sessionId;

    return dispatch => {
      
      CometChat.acceptCall(sessionID).then(
          call => {
          console.log("Call accepted successfully:", call);
          // start the call using the startCall() method
          //set state to display call portal and hide notification

            dispatch(updateCallToAccept(call,"accept call"));
          
          },
          error => {
            console.log("Call acceptance failed with error", error);
            // handle exception
          }
      );
    };
}

export const updateCallToAccept = (call,tag) => {
  return {
    type: "INCOMING_ACCEPT_CALL", 
    data:call,
    tags: tag
  };
};

export const handleOutgoinCallAccepted=(call, dispatch) => {
    dispatch(updateCallToOutGoingAccepted(call,"incoming call"));
};

export const updateCallToOutGoingAccepted = (call,tag) => {
  return {
    type: "OUTGOING_ACCEPTED_CALL", 
    data:call,
    tags: tag
  };
};


export const handleOutgoinCallRejected=(call, dispatch) => {
  dispatch(updateCallToOutGoingRejected(call,"incoming call"));
};

export const updateCallToOutGoingRejected = (call,tag) => {
  return {
    type: "OUTGOING_REJECTED_CALL", 
    data:call,
    tags: tag
  };
};



export const handleIncomingCancelled=(call, dispatch) => {
  dispatch(updateCallToIncomingCancelled(call,"incoming call"));
};

export const updateCallToIncomingCancelled = (call,tag) => {
  return {
    type: "INCOMING_CANCELLED_CALL", 
    data:call,
    tags: tag
  };
};








export const rejectCall = (call)=>{
  var sessionID = call.sessionId;
  var status = CometChat.CALL_STATUS.REJECTED;

  return dispatch => {
    CometChat.rejectCall(sessionID, status).then(
      call => {
        console.log("Call rejected successfully", call);
  
        dispatch(updateCallToReject(call,"reject call"));
  
      },
      error => {
        console.log("Call rejection failed with error:", error);
      }
    );
  }; 
}

export const updateCallToReject = (call,tag) => {
  return {
    type: "INCOMING_REJECT_CALL", 
    data:call,
    tags: tag
  };
};




export const startCall=(call,callDom)=>{
  var sessionID = call.sessionId;

  return dispatch => {
    CometChat.startCall(  sessionID,  callDom,  new CometChat.OngoingCallListener({
        onUserJoined: user => {
        /* Notification received here if another user joins the call. */
        console.log("User joined call:", user);
        /* this method can be use to display message or perform any actions if someone joining the call */
        },
        onUserLeft: user => {
        /* Notification received here if another user left the call. */
        console.log("User left call:", user);
        /* this method can be use to display message or perform any actions if someone leaving the call */
        },
        onCallEnded: call => {
        /* Notification received here if current ongoing call is ended. */
        console.log("Call ended:", call);
          dispatch(updateCallToEnd("end_call"));
        /* hiding/closing the call screen can be done here. */
        }
      })
    );
  }


}


export const updateCallToEnd = (tag) => {
  return {
    type: "INCOMING_END_CALL",     
    tags: tag
  };
};


export const cancelCall = (call)=>{
  var sessionID = call.sessionId;
  var status = CometChat.CALL_STATUS.CANCELLED;

  return dispatch => {
    CometChat.rejectCall(sessionID, status).then(
      call => {
        console.log("Call Cancelled successfully", call);
  
        dispatch(updateCallToCancel(call,"reject call"));
  
      },
      error => {
        console.log("Call rejection failed with error:", error);
      }
    );
  }; 
}


export const updateCallToCancel = (tag) => {
  return {
    type: "OUTGOING_CANCEL_CALL",     
    tags: tag
  };
};

