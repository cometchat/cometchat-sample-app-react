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

export const logout  = (dispatch) => {
  return dispatch =>{
    CometChat.logout().then(
      success => {
        console.log("Logout completed successfully");
        return dispatch(unsetUserSession());
      },error=>{
      //Logout failed with exception
      console.log("Logout failed with exception:",{error});
    })

  };
};


export const unsetUserSession = () => {
  return {
    type: "unsetUserSession",
  };
};

//setUserOnline

export const handleOnUserOnline = (user,dispatch)=>{
  
  console.log("inside handleOnUserOnline", user);
  return dispatch(setUserOnline(user));

}



export const handleOnUserOffline = (user,dispatch)=>{
  
  console.log("inside handleOnUserOnline", user);
  return dispatch(setUserOffline(user));

}

export const setUserOnline = (user) => {
  
  return {
    type: "setUserOnline",
    data: user    
  };
};

export const setUserOffline = (user) => {
  
  return {
    type: "setUserOffline",
    data: user    
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

export const updateUserUnReadMessage =() =>{
   return dispatch =>{ CometChat.getUnreadMessageCountForAllUsers().then(
     array => {
      console.log("Message count fetched", array);
      return dispatch(updateMessageUnreadCount(array));

      return 
    }, error => {
      console.log("Error in getting message count", error);
    });

  }
};

export const updateMessageUnreadCount=(list)=>{
  return {
    type:"UPDATE_MESSAGE_UNREAD_COUNT_LIST",
    data : list
  } 
}

export const updateGroupUnReadMessage=()=>{
  return dispatch =>{ 
    CometChat.getUnreadMessageCountForAllGroups().then(array => {
      console.log("Message count fetched", array);
      return dispatch(updateMessageGroupUnreadCount(array));
    }, error => {
      console.log("Error in getting message count", error);
    });
 }
}


export const updateMessageGroupUnreadCount=(list)=>{
  return {
    type:"UPDATE_MESSAGE_UNREAD_COUNT_GROUP_LIST",
    data : list
  } 
}

export const unsetUnReadMessage = (uid) => {

  return {
    type:'UNSET_MESSAGE_UNREAD_COUNT_USER',
    data:uid
  }
};

export const unsetUnReadGroupMessage = (uid) => {

  return {
    type:'UNSET_MESSAGE_UNREAD_COUNT_GROUP',
    data:uid
  }
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

//addListener

export const addMessageListener = dispatch => {
  console.log("inside addMessageListener ccAction", { dispatch });
  CCManager.addMessageListener(dispatch);
  CCManager.addGroupEventListener(dispatch);
  CCManager.addCallListener(dispatch);
  dispatch(updateHandler());
};

export const addUserListener = dispatch =>{
  CCManager.addUserEventListener(dispatch);
}

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

//handle message delivered
export const handleMessageDelivered=(message,dispatch)=>{

  console.log("Message receipt : " + JSON.stringify(message));
  //return null;
   if(message.receiverType=="user"){
     dispatch(updateMessageDelivered(message.sender.uid, message.messageId,message.timestamp, " message "));
   }
}

export const updateMessageDelivered = (user,msgid,timestamp,tag)=>{

  return {
    type: "updateMessageDelivered",
    msgid: msgid,
    uid: user,
    deliveredAt:timestamp,
    tags: tag
  };
}



export const handleMessageRead=(message,dispatch)=>{
  
  if(message.receiverType=="user"){
    dispatch(updateMessageRead(message.sender.uid, message.messageId,message.timestamp, " message "));
  }

}

export const updateMessageRead = (user, msgid,timestamp,tag)=>{
  console.log("kshitiz",msgid );
  console.log("kshitiz",user );
  return {
    type: "updateMessageRead",
    msgid: msgid,
    uid: user,
    readAt:timestamp,
    tags: tag
  };
}


export const handleStartTyping = (typing,dispatch) =>{
  dispatch(setUserTypingStatus(typing.sender.uid,true,"start Typing"));
}


export const handleEndTyping = (typing,dispatch) =>{
  dispatch(setUserTypingStatus(typing.sender.uid,false,"End Typing"));
}

export const setUserTypingStatus = (user,typingStatus,tag)=>{

  return {
    type: "setUserTypingStatus",
    uid:user,
    typeStatus:typingStatus,
    tags: tag
  };
}


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
            // console.log("mesage callback : " + JSON.stringify(message));
            return dispatch(updateMessage(uid, message, "sendText"));
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


export const joinPublicGroup =(group)=>{
  return CometChat.joinGroup(group.guid,CometChat.GROUP_TYPE.PUBLIC,'');
}

export const joinPasswordGroup =(group,password)=>{
  console.log("GROUP DATA : " + JSON.stringify(group));
  console.log("Group Password : "  + password);
  return CometChat.joinGroup(group.guid,CometChat.GROUP_TYPE.PASSWORD,password);
}

export const joinPrivateGroup =(group)=>{
  return CometChat.joinGroup(group.guid,CometChat.GROUP_TYPE.PRIVATE,'');
}



export const updateGroupJoined = (group,tag="group joined") =>{
  
  return {
    type: "group_joined", 
    data: group,
    tags: tag
  };
}




export const showCallScreen = (call,tag="showCallScreen") =>{
  
  return {
    type: "SHOW_CALL_SCREEN", 
    data:call,
    tags: tag
  };
}


export const initializeCall = (uid,callType,userType) =>{

  var call = CCManager.getCall(uid,callType,userType)

  return dispatch => {

    CometChat.initiateCall(call).then(
      outGoingCall => {
          console.log("Call initiated successfully:", JSON.stringify(outGoingCall));
          // perform action on success. Like show your calling screen.
          return dispatch(initCall(call,"init call"));
      },
      error => {
          console.log("Call initialization failed with exception:", error);
      }
    );
  
  };
  
}

export const initCall = (call,tag) => {
  return {
    type: "INIT_CALL", 
    data:call,
    tags: tag
  };
};

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

  console.log("Session idf : " + sessionID + "\n : " + call.sessionId);

  return dispatch => {
    CometChat.rejectCall(sessionID, status).then(
      call => {
        console.log("Call Cancelled successfully", call);
  
        dispatch(updateCallToCancel(call,"reject call"));
  
      },
      error => {
        console.log("Call rejection failed with error:", error);
        dispatch(updateCallToCancel(call,"reject call"));
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

// group actions

export const createGroup=(data)=>{
  var GUID = data.guid;
  var groupName = data.groupName;
  var groupType = data.groupType;
  var password = data.password;

  var group = new CometChat.Group(GUID, groupName, groupType, password);

  return dispatch => {
    CometChat.createGroup(group).then(
      group => {
        console.log("Group created successfully:", group);
           dispatch(updateGroup(group));
      },
      error => {
        console.log("Group creation failed with exception:", error);
      }
    );
  }
  
}


export const updateGroup = (data) => {
  return {
    type: "updateGroup",     
    group: data
  };
};

//leave group 

export const leaveGroup=(group_id)=>{
  console.log("Group id to leave", group_id);
  return (dispatch) => {
    console.log("Group id to leave inside", arguments);
    CometChat.leaveGroup(group_id).then(
      hasLeft => {
        console.log("Group left successfully:", hasLeft);
        dispatch(deleteActiveMessage());
        dispatch(updateGroupLeft(group_id));
      },
      
      error => {
        console.log("Group leaving failed with exception:", error);
      }
    );
  }
}

export const deleteActiveMessage = () => {
  return {
    type:"deleteActiveMessage",
    group:""
  }
}

export const updateGroupLeft = (guid) =>{

  console.log("Group left successfully:updateGroupLeft");
  return{
    type:"group_left",
    data: guid,
    tag:"left_group"
  }
}



export const blockUser = (userlist)=>{
  var usersList = [userlist];

  return (dispatch) => {
    CometChat.blockUsers(usersList).then(
      list => {
        console.log("users list blocked", { list });
      }, error => {
        console.log("Blocking user fails with error", error);
      });
    }
}


export const unblockUser = (userlist)=>{
  var usersList = ["UID1", "UID2", "UID3"];

  return (dispatch) => {
    CometChat.unblockUsers(usersList).then(
      list => {
          console.log("users list unblocked", { list });
      }, error => {
          console.log("unblocking user fails with error", error);
      }
    );
  }
}

export const removeUser = (uid) =>{

  
  return{
    type:"deleteUser",
    data: uid,
    tag:"deleteuser"
  }
};


export const handleDeleteMessage = (messageId,dispatch) => {

  console.log("Message deleted", messageId);

  return (dispatch) =>{
    CometChat.deleteMessage(messageId).then(
        message => {
          console.log("Message deleted", message);
          dispatch(deleteMessage(message));
        },
        error => {
          console.log("Message delete failed with error:", error);
        }
    );
  }
}

export const deleteMessage = (message) =>{
  return {
    type:'deleteMessage',
    msgid:message.id,
    uid : message.receiver,
    tag:"deletemessage"
  }
}

export const deleteMessageReceived = (message) =>{
  return {
    type:'deleteMessage',
    msgid:message.id,
    uid : message.sender.uid,
    tag:"deletemessage"
  }
}


export const handleEditMessage = (receiverID,messageText,messageId) => {

  return (dispatch) =>{

    let messageType = CometChat.MESSAGE_TYPE.TEXT;
    let receiverType = CometChat.RECEIVER_TYPE.USER
    
    let textMessage = new CometChat.TextMessage(receiverID, messageText, messageType, receiverType);
    
    textMessage.setId(messageId);

    CometChat.editMessage(textMessage).then(
        message => {
            console.log("Message Edited", message);
            dispatch(editMessage(message));
        },
        error => {
            console.log("Message editing failed with error:", error);
        }
    );

  }
}

export const editMessage = (message) =>{
  return {
    type:'editMessage',
    msgid:message.id,
    uid : message.receiver,
    msgdata:message,
    tag:"editMessage"
  }
}

export const editMessageReceived = (message) =>{
  return {
    type:'editMessage',
    msgid:message.id,
    uid : message.sender.uid,
    msgdata:message,
    tag:"editMessage"
  }
}