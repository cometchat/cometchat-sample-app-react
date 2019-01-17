import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from './../../lib/uiComponentLib';
import * as utils from './../../lib/uiComponentLib';

var Userthumbnail = require('./../../../public/img/user.png');
var Groupthumbnail = require('./../../../public/img/group.jpg');

import { CometChat} from "@cometchat-pro/chat";
class CCMessage extends Component {

    render() {
        console.log("message : " + JSON.stringify(this.props.msgData));
        var msg = {
            data: this.props.msgData.data.text,
            sid : this.props.msgData.sender.uid,
            loggedInUser: this.props.loggedUid,
            sendAt: this.props.msgData.sentAt,
            msgType : this.props.msgData.type,
        }
        console.log("message sender id : " + JSON.stringify(msg.sid.uid));

        msg.username = this.props.msgData.sender.name;
        msg.avatar = utils.CheckEmpty(this.props.msgData.sender.avatar) ? this.props.msgData.sender.avatar : Userthumbnail;

        return (<MessageType msg={msg} />);
    }
}

function MessageType(props) {
    if (props.msg.loggedInUser == props.msg.sid) {

        console.log("Mesage : type : " + props.msg.msgType);
        //outgoing message
        return <OutgoingMessage msg={props.msg} />;
    } else {
        //incoming message 
        return <IncomingMessage msg={props.msg} />;
    }
}


function IncomingMessage(props) {

    switch(props.msg.msgType){
        case CometChat.MESSAGE_TYPE.IMAGE : {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <p class="color-light-tint color-dark-tint-font border-radius-no-bottom-left">{props.msg.data}
                            </p>
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
        } break;

        case CometChat.MESSAGE_TYPE.VIDEO : {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <p class="color-light-tint color-dark-tint-font border-radius-no-bottom-left">{props.msg.data}
                            </p>
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.AUDIO: {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <p class="color-light-tint color-dark-tint-font border-radius-no-bottom-left">{props.msg.data}
                            </p>
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.FILE : {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <p class="color-light-tint color-dark-tint-font border-radius-no-bottom-left">{props.msg.data}
                            </p>
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.TEXT : {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <p class="color-light-tint color-dark-tint-font border-radius-no-bottom-left">{props.msg.data}
                            </p>
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
            
        }
        break;
    }


   
}

function OutgoingMessage(props) {

    switch(props.msg.msgType){
        case CometChat.MESSAGE_TYPE.IMAGE : {
            return (
                <div class="outgoing_msg">
                    <div class="sent_msg ">
                        <p class="color-background border-radius-no-bottom-right color-font-white">
                            {props.msg.data}
                        </p>
                        <span class="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
        
                    </div>
                </div>
            );
        } break;

        case CometChat.MESSAGE_TYPE.VIDEO : {
            return (
                <div class="outgoing_msg">
                    <div class="sent_msg ">
                        <p class="color-background border-radius-no-bottom-right color-font-white">
                            {props.msg.data}
                        </p>
                        <span class="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
        
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.AUDIO: {
            return (
                <div class="outgoing_msg">
                    <div class="sent_msg ">
                        <p class="color-background border-radius-no-bottom-right color-font-white">
                            {props.msg.data}
                        </p>
                        <span class="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
        
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.FILE : {
            return (
                <div class="outgoing_msg">
                    <div class="sent_msg ">
                        <p class="color-background border-radius-no-bottom-right color-font-white">
                            {props.msg.data}
                        </p>
                        <span class="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
        
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.TEXT : {
            return (
                <div class="outgoing_msg">
                    <div class="sent_msg ">
                        <p class="color-background border-radius-no-bottom-right color-font-white">
                            {props.msg.data}
                        </p>
                        <span class="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
        
                    </div>
                </div>
            );
        }
        break;
    }


 
}

const mapStateToProps = (store) => {
    return {
        loggedUid: store.users.loggedInUser.uid,
        users: store.users.usersList,
        activeUser: store.message.activeMessage,
    };
};

const mapDispachToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessage);



