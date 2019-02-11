import React, { Component } from "react";
import { Row, Col, OverlayTrigger, Button } from 'react-bootstrap';
import CallModal from './../modal/CallModal';


import { connect } from 'react-redux';
import * as utils from './../../lib/uiComponentLib';

import * as actionCreator from "./../../store/actions/cc_action";

import icon_audio from "./../../../public/img/icon_audio_call.svg";
import icon_more from "./../../../public/img/icon_more_header.svg";
import icon_video from "./../../../public/img/icon_video_call.svg";


var Userthumbnail = require('./../../../public/img/user.png');
var Groupthumbnail = require('./../../../public/img/group.jpg');


class CCMessageHeader extends Component {

    constructor(props){
        super(props);

        this.state = {
            showModal : false,
            callType : ""
        }
    }

    initiateCall(callTypes,username,avatar){
        
        const initCall = {
           
            user_avatar:avatar,
            user_name:username,
            call_user_id:this.props.profile.id,
            call_type:callTypes,
            call_user:this.props.profile.type,
        }

        

        this.props.startCall(initCall);
    }

    render() {

        
        var profileData = {};

        if (this.props.profile.type == 'user') {
            var userdata = this.props.userList.find(user => user.uid === this.props.profile.id);
            profileData.name    = userdata.name;
            profileData.avatar  = utils.CheckEmpty(userdata.avatar) ? userdata.avatar : Userthumbnail ;
            profileData.status  = userdata.status;
        } else {
            var groupData = this.props.groupList.find(group => group.guid === this.props.profile.id);
            profileData.name    = groupData.name;
            profileData.avatar  = utils.CheckEmpty(groupData.icon) ? groupData.icon : Groupthumbnail ;
            profileData.status  = groupData.description;
        }
        

        return (
            <Row className="ccMessageHeader">

                <Col lg={8} className="cc-no-padding h-100">
                    <span className="messageHeaderAvatar">
                        <img className="userAvatar img-circle" src={profileData.avatar}
                            height="42px" width="42px" />
                    </span>

                    <div className="messageHeaderTitle">
                        <span >{profileData.name}</span>
                    </div>
                    <div className="messageHeaderStatus">
                        <span >{profileData.status}</span>
                    </div>
                </Col>

                <Col lg={4} className="cc-no-padding h-100">
                    <div className="ccMessageHeaderMenu">
                        <span className="ccmessageHeaderIcon " dangerouslySetInnerHTML={{__html:icon_audio}} 
                            onClick={this.initiateCall.bind(this,'audio',profileData.name,profileData.avatar)}/>

                        <span className="ccmessageHeaderIcon " dangerouslySetInnerHTML={{__html:icon_video}}
                         onClick={this.initiateCall.bind(this,'video',profileData.name,profileData.avatar)}/>

                        <span className="ccmessageHeaderIcon " dangerouslySetInnerHTML={{__html:icon_more}}/>
                    </div>
                </Col>                
            </Row>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        profile: store.message.activeMessage,
        userList: store.users.usersList,
        groupList: store.groups.groupsList,
    };
};

const mapDispachToProps = dispatch => {
    return {
        startCall : (call) => dispatch(actionCreator.showCallScreen(call)),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessageHeader);
