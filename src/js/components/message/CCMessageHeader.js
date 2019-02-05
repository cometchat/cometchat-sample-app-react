import React, { Component } from "react";
import { Row, Col, OverlayTrigger, Button } from 'react-bootstrap';
import CallModal from './../modal/CallModal';


import { connect } from 'react-redux';
import * as utils from './../../lib/uiComponentLib';

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

    openModal(calltype){

        this.setState({
            showModal: true,
            callType : calltype
        });
    }

    closeModal(){
        this.setState({
            showModal:false
        });
    }

    initiateCall(callType){
        this.openModal(callType);
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
        

        const callModal = this.state.showModal?(<CallModal user_avatar={profileData.avatar} user_name={profileData.name} call_user_id={this.props.profile.id} call_type={this.state.callType} handleClose={this.closeModal.bind(this)} call_user={this.props.profile.type}></CallModal>):null;

        

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
                            onClick={this.initiateCall.bind(this,'audio')}/>

                        <span className="ccmessageHeaderIcon " dangerouslySetInnerHTML={{__html:icon_video}}
                         onClick={this.initiateCall.bind(this,'video')}/>

                        <span className="ccmessageHeaderIcon " dangerouslySetInnerHTML={{__html:icon_more}}/>
                    </div>
                </Col>
                

                {callModal}
                
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

    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessageHeader);
