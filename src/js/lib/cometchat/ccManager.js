import {CometChat,UsersRequestBuilder,GroupsRequestBuilder,UserMessagesRequestBuilder,MESSAGE_REQUEST,MESSAGE_TYPE,RECEIVER_TYPE,TextMessage,MediaMessage,MessageEventListener} from '@cometchat-pulse/cometchat-pulse.js';

import * as actionCreator from './../../store/actions/cc_action';
import { resolve } from 'url';
import { rejects } from 'assert';

export default class CCManager {

    static cometchat = null;
    
    static appId        =   '6e13b23d7a3';
    static apiKey       =   'admin';
    static listnerKey   =   "listener1";


    static usersRequestBuilder  = null;
    static groupsRequestBuilder = null;
  
    
    static init(dispatcher){
            
        //initialize cometchat manager
        CometChat.init(this.appId);

        //initiate Chat API POJO objects
        CCManager.usersRequestBuilder   = new UsersRequestBuilder();
        CCManager.groupsRequestBuilder  = new GroupsRequestBuilder();
       
    }


    static getInstance() {
        if (CCManager.cometchat == null) {
            CCManager.cometchat = CometChat.init(this.appId);
        }

        return CCManager.cometchat;
    }


    static getTextMessage(uid, text){
        return new TextMessage(uid, text,  MESSAGE_TYPE.TEXT, RECEIVER_TYPE.USER);
    }

    static addMessageListener(dispatch){
        
        console.log("rached inside addmesslistner ccmangr  : "   + this.listnerKey);

        CometChat.addMessageEventListner(
            this.listnerKey,
            (msg) => {},
            new MessageEventListener({
            onActionRecived:(action)=>{
                    // handle actions
                this.handleActionMessage(action,dispatch);     
            },
            onMessageReceived:(message) => {
                //console.log("ccmangr msg: " + JSON.stringify(message));

                console.log("ccmessanger : " + {message});

                if( message instanceof TextMessage){
                    // handle text messages	              
                    //this.handleTextMessage(message,dispatch);
                    dispatch(actionCreator.handleTextMessage(message));
                }else if(message instanceof MediaMessage) {
                    // handle media messages
                    this.handleMediaMessage(message,dispatch);
                }
            }
        }));
        

    }

    static handleMediaMessage(message,dispatch){
        console.log("ccmangr msg: " + JSON.stringify(message));
        dispatch(actionCreator.handleMediaMessage(message));
    }

    static handleTextMessage(message,dispatch){
        
    }

    static handleActionMessage(action,dispatch){
       dispatch(actionCreator.handleTextMessage(action));
    }

    static messageRequestBuilder(uid,limit){

        let currentTime=parseInt((new Date().getTime() / 1000).toString());

        console.log("Current time : " + currentTime);

        let messageRequestBuilder = new UserMessagesRequestBuilder(uid,currentTime, MESSAGE_REQUEST.SENT_AT);

        let messageRequest = messageRequestBuilder.setLimit(limit).build();

        return messageRequest;
    }

}


