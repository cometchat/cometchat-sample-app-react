/**
 * CCManager class : To manage cometchat SDK
 */

import {
  CometChat,
  UsersRequestBuilder,
  GroupsRequestBuilder,
  UserMessagesRequestBuilder,
  MESSAGE_REQUEST,
  MESSAGE_TYPE,
  RECEIVER_TYPE,
  TextMessage,
  MediaMessage,
  MessageEventListener,
  UserEventListener,
  GroupEventListener
} from "@cometchat-pulse/cometchat-pulse.js";

import * as actionCreator from "./../../store/actions/cc_action";

export default class CCManager {
  static cometchat = null;

  static appId = "6e13b23d7a3";
  static apiKey = "824649fc1cdf02059975c40174d0af23695aea65";
  static LISTENER_KEY_MESSAGE = "msglistener";
  static LISTENER_KEY_USER = "userlistener";
  static LISTENER_KEY_GROUP = "grouplistener";

  // static appId        =   '{APP_ID}';     //Enter your App ID
  // static apiKey       =   '{API_KEY}';    //Enter your API KEY

  // static LISTENER_KEY   =   'Listener_Key';

  static usersRequestBuilder = null;
  static groupsRequestBuilder = null;

  static userRequest = null;
  static groupRequest = null;

  static init(dispatcher) {
    console.log("Appid : " + this.appId);

    //initialize cometchat manager
    CometChat.init(this.appId);

    //initiate Chat API POJO objects
    CCManager.usersRequestBuilder = new UsersRequestBuilder();
    CCManager.groupsRequestBuilder = new GroupsRequestBuilder();
  }

  static getInstance() {
    if (CCManager.cometchat == null) {
      CCManager.cometchat = CometChat.init(this.appId);
    }

    return CCManager.cometchat;
  }

  static getTextMessage(uid, text, msgType) {
    if (msgType == "user") {
      return new TextMessage(uid, text, MESSAGE_TYPE.TEXT, RECEIVER_TYPE.USER);
    } else {
      return new TextMessage(uid, text, MESSAGE_TYPE.TEXT, RECEIVER_TYPE.GROUP);
    }
  }

  static getMediaMessage(uid, file, msgType) {
    if (msgType == "user") {
      return new MediaMessage(uid, file, MESSAGE_TYPE.IMAGE, RECEIVER_TYPE.USER);
    } else {
      return new MediaMessage(uid, file, MESSAGE_TYPE.IMAGE, RECEIVER_TYPE.GROUP);
    }
  }

  static addMessageListener(dispatch) {
    console.log("ccmangr addMessageListener: ");
    //   try{
    CometChat.addMessageEventListener(
      this.LISTENER_KEY_MESSAGE,
      new MessageEventListener({
        onTextMessageReceived: message => {
          console.log("Incoming Message Log", { message });
          // Handle text message
          this.handleTextMessage(message, dispatch);
        },
        onMediaMessageReceived: message => {
          console.log("Incoming Message Log", { message });
          // handle media message
          this.handleMediaMessage(message, dispatch);
        }
      })
    );
    // }catch(err){
    //     console.log("Message event error ",{err});
    // }
  }

  static addUserEventListener(dispatch) {
    try {
      CometChat.addUserEventListener(
        this.LISTENER_KEY_USER,
        new UserEventListener({
          onUserOnline: onlineUser => {
            console.log("On User Online :=>", { onlineUser });
            //User came online
          },
          onUserOffline: offlineUser => {
            console.log("On User Offline :=>", { offlineUser });
            //User went offline
          }
        })
      );
    } catch (err) {
      console.log("User event error ", { err });
    }
  }

  static addGroupEventListener(dispatch) {
    try {
      CometChat.addGroupEventListener(
        this.LISTENER_KEY_GROUP,
        new GroupEventListener({
          onUserJoined: (joinedUser, joinedGroup) => {
            console.log("user joined", { joinedUser, joinedGroup });
            // Handle Event : user joined group
          },
          onUserLeft: (leavingUser, group) => {
            console.log("user left", { leavingUser, group });
            // Handle Event : user left group
          },
          onUserKicked: (kickedUser, kickedBy, kickedFrom) => {
            console.log("user kicked", kickedUser, kickedBy, kickedFrom);
            // Handle Event : bannedUser banned from group by bannedBy
          },
          onUserBanned: (bannedUser, kickedBy, kickedFrom) => {
            console.log("user banned", bannedUser, kickedBy, kickedFrom);
            // Handle Event : kickedUser kicked from group by kickedBy
          },
          onUserUnbanned: (unbannedUser, unbannedBy, unbannedFrom) => {
            console.log(
              "user unbanned",
              unbannedUser,
              unbannedBy,
              unbannedFrom
            );
            // Handle event : unbannedUser unbanned from group by unbannedBy
          }
        })
      );
    } catch (error) {
      console.log("Group event error ", { err });
    }
  }

  static handleMediaMessage(message, dispatch) {
    //console.log("ccmangr msg: " + JSON.stringify(message));
    actionCreator.handleMediaMessage(message);
  }

  static handleTextMessage(message, dispatch) {
    //console.log("ccmangr msg: " + JSON.stringify(message));
    actionCreator.handleTextMessage(message, dispatch);
  }

  static handleActionMessage(action, dispatch) {}

  static messageRequestBuilder(uid, limit) {
    let currentTime = parseInt((new Date().getTime() / 1000).toString());

    console.log("Current time : " + currentTime);

    let messageRequestBuilder = new UserMessagesRequestBuilder(
      uid,
      currentTime,
      MESSAGE_REQUEST.SENT_AT
    );

    let messageRequest = messageRequestBuilder.setLimit(limit).build();

    return messageRequest;
  }

  static removeListener() {
    CometChat.removeMessageEventListener(this.LISTENER_KEY_MESSAGE);
    CometChat.removeUserEventListener(this.LISTENER_KEY_USER);
    CometChat.removeGroupEventListener(this.LISTENER_KEY_GROUP);
  }
}
