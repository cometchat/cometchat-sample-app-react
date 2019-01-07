import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from './../../lib/uiComponentLib';
import * as utils from './../../lib/uiComponentLib';
var Userthumbnail = require('./../../../public/img/user.png');
var Groupthumbnail = require('./../../../public/img/group.jpg');

class CCMessage extends Component {

    render() {
        console.log("message : " + JSON.stringify(this.props.msgData));
        var msg = {
            data: this.props.msgData.data.text,
            sid : this.props.msgData.sender.uid,
            loggedInUser: this.props.loggedUid,
            sendAt: this.props.msgData.sentAt,
        }
        console.log("message sender id : " + JSON.stringify(msg.sid.uid));

        msg.username = this.props.msgData.sender.name;
        msg.avatar = utils.CheckEmpty(this.props.msgData.sender.avatar) ? this.props.msgData.sender.avatar : Userthumbnail;



       

        return (<MessageType msg={msg} />);
    }
}

function MessageType(props) {
    if (props.msg.loggedInUser == props.msg.sid) {
        //outgoing message
        return <OutgoingMessage msg={props.msg} />;
    } else {
        //incoming message 
        return <IncomingMessage msg={props.msg} />;
    }
}


function IncomingMessage(props) {

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

function OutgoingMessage(props) {
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



