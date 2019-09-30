import update from "immutability-helper";
import { CometChat } from "@cometchat-pro/chat";

const intialState = {
  messages: [],
  activeMessage: {}
};

const reducers = (state = intialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case "createMessage":
    break;

    case "getNewMessage":
    break;

    case "editMessage":
      let msgUserEditIndex = newState.messages.findIndex(
        userMessage => userMessage.muid === action.uid
      );
      if (msgUserEditIndex != 1) {
        var newEditState = Object.assign({}, state.messages[msgUserEditIndex]);
        const msgEditIndex = newEditState.message.findIndex(
          message => message.id === action.msgid
        );
        newEditState.message[msgEditIndex] = action.msgdata;
        const editMessageState = update(state, {
          messages: { msgUserEditIndex: { $set: newEditState } }
        });
        return editMessageState;
      }
    break;

    case "deleteMessage":
      let msguserDelIndex = newState.messages.findIndex(
        userMessage => userMessage.muid === action.uid
      );
      if (msguserDelIndex != -1) {
        var newDelState = Object.assign({}, state.messages[msguserDelIndex]);
        const msgDelIndex = newDelState.message.findIndex(
          message => message.id === action.msgid
        );
        newDelState.message.splice(msgDelIndex, 1);
        const DelMessageState = update(state, {
          messages: { msguserDelIndex: { $set: [newDelState] } }
        });
        return DelMessageState;
      }
    break;

    case "updateMessageDelivered":
      let msgDindex = newState.messages.findIndex(
        userMessage => userMessage.muid === action.uid
      );
      if (msgDindex != -1) {
        var copyPSMessageState = Object.assign({}, state.messages[msgDindex]);
        const messageIndex = copyPSMessageState.message.findIndex(
          message => message.id === action.msgid
        );
        if (messageIndex != -1) {
          var newMessageState;
          if (action.userType == "user") {
            newMessageState = {...copyPSMessageState.message[messageIndex],deliveredAt: action.deliveredAt};
          } else {
            newMessageState = {...copyPSMessageState.message[messageIndex],deliveredToMeAt: action.deliveredAt};
          }
          copyPSMessageState.message[messageIndex] = newMessageState;
          const PSMessageState = update(state, {messages: { msgDindex: { $set: [copyPSMessageState] } }});
          return PSMessageState;
        }
      }
    break;

    case "updateMessageRead":
      let msgReadIndex = newState.messages.findIndex(
        userMessage => userMessage.muid === action.uid
      );
      if (msgReadIndex != -1) {
        var copyPSMessageState = Object.assign({},state.messages[msgReadIndex]);
        const messageIndex = copyPSMessageState.message.findIndex(message => message.id === action.msgid);
        if (messageIndex != -1) {
          var newMessageState;
          if (action.userType == "user") {
            newMessageState = {...copyPSMessageState.message[messageIndex],readAt: action.readAt};
          }else{
            newMessageState = {...copyPSMessageState.message[messageIndex],readByMeAt: action.readAt};
          }
          copyPSMessageState.message[messageIndex] = newMessageState;
          const PSMessageState = update(state, {
            messages: { msgReadIndex: { $set: [copyPSMessageState] } }
          });
          return PSMessageState;
        }
      }
    break;

    case "updateMessage":
      let index = newState.messages.findIndex(userMessage => userMessage.muid === action.uid);
      if (index != -1) {
        const copyPSMessageState = Object.assign({}, state.messages[index]);
        copyPSMessageState.message.push(action.message);
        const PSMessageState = update(state, {messages: { index: { $set: [copyPSMessageState] } }});
        return PSMessageState;
      }
    break;

    case "updateMessageList":
      if(action.tags == "user"){
        var array = action.messages;
        var incomingMessages = array.filter(function(msg) {
          return msg.sender.uid == action.uid;
        });
        var lastMessage = incomingMessages[incomingMessages.length - 1];
        if (lastMessage !== undefined && lastMessage.readAt == undefined) {
          CometChat.markAsRead(lastMessage.id,lastMessage.sender.uid,lastMessage.receiverType);
        }
      }else{
        var array = action.messages;
        var incomingMessages = array.filter(function(msg) {
          return msg.sender.uid != action.loggedInUser;
        });
        var lastMessage = incomingMessages[incomingMessages.length - 1];
        if (lastMessage !== undefined && lastMessage.readByMeAt == undefined) {
          CometChat.markAsRead(lastMessage.id,lastMessage.receiver,lastMessage.receiverType);
        }
      }

      let index1 = newState.messages.findIndex(
        userMessage => userMessage.muid === action.uid
      );

      if(index1 != -1){
        const copyMessageState = Object.assign({}, state.messages[index1]);
        action.messages.map(msg => {copyMessageState.message.push(msg);});
        const copyMessagesState = Object.assign({}, state.messages);
        const NPLMessageState = update(state, {messages: { index: { $set: [copyMessageState] } }});
        return NPLMessageState;
      }else{
        var tempObj = {
          muid: action.uid,
          message: action.messages
        };
        const NPMessageState = update(state, {messages: { $push: [tempObj] }});
        return NPMessageState;
      }
    break;

    case "updateActiveMessage":
      newState.activeMessage = {
        type: action.utype,
        id: action.uid
      };
    break;

    case "deleteActiveMessage": 
      newState.activeMessage = {};
    break;

  }
  return newState;
};

export default reducers;