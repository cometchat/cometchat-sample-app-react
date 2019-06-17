import React, { Component } from "react";
import { Row, Col, OverlayTrigger, Popover,Button } from 'react-bootstrap';
import CallModal from './../modal/CallModal';


import { connect } from 'react-redux';
import * as utils from './../../lib/uiComponentLib';

import * as actionCreator from "./../../store/actions/cc_action";
import GroupProfileModal from "./../modal/GroupProfileModal";
import translate from "./../../lib/localization/translate";

import icon_audio from "./../../../public/img/icon_audio_call.svg";
import icon_more from "./../../../public/img/icon_more_header.svg";
import icon_video from "./../../../public/img/icon_video_call.svg";
import icon_block from "./../../../public/img/icon_block.svg";


var Userthumbnail = require('./../../../public/img/user.png');
var Groupthumbnail = require('./../../../public/img/group.jpg');


class CCMessageHeader extends Component {

    constructor(props){
        super(props);
        this.overlayRef = React.createRef();
        this.state = {
            showModalProfile : false,
            callType : "",
            
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

    componentWillUpdate(){
        if(this.state.showModalProfile){
            this.hideModal();
        }
        return true;
    }

    showModal(){
        if(this.props.profile.type == "group"){
            this.setState({showModalProfile:true});
        }
        
    }

    hideModal(){
        this.setState({showModalProfile:false});
    }

    handleblockUser(uid){
       // var uid = props.profile.id;
        console.log("blocking uid : " + uid);
        this.props.blockUser(uid);
        this.overlayRef.current.hide();
        this.props.removeUserList(uid);
        this.props.deleteActiveMessage();
    }

    render() {

        const showMore = this.props.profile.type == 'user'? ( <OverlayTrigger ref={this.overlayRef} trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose(this.handleblockUser.bind(this,this.props.profile.id))} >
        <span className="ccmessageHeaderIcon " dangerouslySetInnerHTML={{__html:icon_more}}/></OverlayTrigger>):null;
        var profileData = {};
        var showProfile = null;

        if (this.props.profile.type == 'user') {
            var userdata = this.props.userList.find(user => user.uid === this.props.profile.id);
            profileData.name    = userdata.name;
            profileData.avatar  = utils.CheckEmpty(userdata.avatar) ? userdata.avatar : Userthumbnail ;
           

            if(userdata.hasOwnProperty("typeStatus")){
                if(userdata.typeStatus == true){
                    profileData.status  = "Typing...";
                }else{
                    profileData.status  = userdata.status;
                }
            }else{
                profileData.status  = userdata.status;
            }
            
        } else {
            var groupData = this.props.groupList.find(group => group.guid === this.props.profile.id);
            profileData.name    = groupData.name;
            profileData.avatar  = utils.CheckEmpty(groupData.icon) ? groupData.icon : Groupthumbnail ;
            profileData.status  = groupData.description;

            showProfile = this.state.showModalProfile ? <GroupProfileModal groupData={groupData} profileData={profileData} close={this.hideModal.bind(this)} /> :null;
        }

        
        

        return (
            <Row className="ccMessageHeader">
                {showProfile}    
                <Col lg={7} className="cc-no-padding h-100" onClick={this.showModal.bind(this)} style={{cursor:"pointer"}}>
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

                <Col lg={5} className="cc-no-padding h-100">
                    <div className="ccMessageHeaderMenu">
                        <span className="ccmessageHeaderIcon " dangerouslySetInnerHTML={{__html:icon_audio}} 
                            onClick={this.initiateCall.bind(this,'audio',profileData.name,profileData.avatar)}/>

                        <span className="ccmessageHeaderIcon " dangerouslySetInnerHTML={{__html:icon_video}}
                         onClick={this.initiateCall.bind(this,'video',profileData.name,profileData.avatar)}/>

                         {showMore}
                        
                    </div>
                </Col>                
            </Row>
        );
    }
}


const popoverClickRootClose = (event )=> {

    return (
       <Popover id="popover-trigger-click-root-close"  onClick={event} >
           <div>
               <span className="messageHeaderMenuItem" >
                   <div className="messageHeaderMenuIcon " dangerouslySetInnerHTML={{__html:icon_block}}/>
                   Block
                </span> 
           </div>
       </Popover>
    ) ;  
   };
   

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
        blockUser : (uid) => dispatch(actionCreator.blockUser(uid)),
        removeUserList:(uid)=>dispatch(actionCreator.removeUser(uid)),
        deleteActiveMessage:()=>dispatch(actionCreator.deleteActiveMessage()),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessageHeader);
