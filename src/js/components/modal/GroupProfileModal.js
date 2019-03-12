import React from "react";
import Modal from './Modal';

import { Row, Col, Button, FormGroup, FormControl, ControlLabel,InputGroup } from "react-bootstrap";

import { connect } from 'react-redux';


import * as actionCreator from './../../store/actions/cc_action';
import * as utils from './../../lib/uiComponentLib';
import CCManager from './../../lib/cometchat/ccManager';

import icon_clear from "./../../../public/img/icon_clear.svg";
import icon_leave_group from "./../../../public/img/icon_leave_group.svg";
import icon_delete_group from "./../../../public/img/icon_delete_group.svg";
var user_thumbnail = require("./../../../public/img/user.png");





class GroupProfileModal extends React.PureComponent {

    
    constructor(props) {
        super(props);    
        this.state = { 
            groupMembers:[]  
        }

        this.groupMemberRequest = CCManager.getGroupMembersRequestBuilder(this.props.groupData.guid,100);
    }

    

    componentWillMount(){  
        this.getGroupMembers();
    }

    getGroupMembers(){        
        this.groupMemberRequest.fetchNext().then(
	        groupMemberList => {

                if(groupMemberList.length > 0){

                    //groupMemberList.map((group) =>{
                        var newState = {...this.state}
                        newState.groupMembers = groupMemberList;
                        this.setState(newState);
                    //})
                    
                }               

                console.log("Group Member list fetched successfully:", groupMemberList);
                
	        },
	        error => {
		        console.log("Group Member list fetching failed with exception:", error);
	        }
        );
    }

    handleLeaveGroup(){

        this.props.leaveGroup(this.props.groupData.guid);
        

    }


    render(){

        console.log("members length group members : " + this.state.groupMembers.length );

        
        let groupLoggedinUser  = this.state.groupMembers.find(user=>(user.uid == this.props.loggedInUser.uid));

        const deleteGroup = groupLoggedinUser == undefined?null : (groupLoggedinUser.scope=="admin" ? (
            <Row className="profileNameRow" >
                <Col className="groupProfileLeaveGroupText" lg={10} xs={8} >Delete Group </Col>
                <Col className="groupProfileLeaveButton" lg={1} xs={2}  onClick = {this.props.close} dangerouslySetInnerHTML={{ __html: icon_delete_group }}></Col>
            </Row>):null);

        console.log("loggedin user is admin : " , groupLoggedinUser);


        return ( 
            <Modal >
                <div className="groupProfileModal h-100pr">
                    <div class="groupProfileModelHeader">
                        <Col className="groupProfileCloseButton" lg={1} xs={2}  onClick = {this.props.close} dangerouslySetInnerHTML={{ __html: icon_clear }}></Col>
                        <Col className="groupProfileTitle" lg={10} xs={8} >Group Information </Col>
                    </div>

                    <div class="groupProfileInfoContainer">
                    
                        <Row class="profileImageRow">
                            <Col lg={12} >
                                <img src={this.props.profileData.avatar} />
                            </Col>      
                        </Row>

                        <Row class="profileNameRow">
                            <Col lg={12} class="profileName">
                                {this.props.profileData.name}
                            </Col>      
                        </Row>

                        <Row className="profileGroupMemberListRow">
                            <Col lg={12}>
                                <span className="profileGroupMemberListTitle">Members</span>
                            </Col>

                            {
                                this.state.groupMembers.map((member,index)=>(
                                    <MemberView name={member.user.name} member={member}/>
                                ))
                            }
                        </Row>

                        {deleteGroup}

                        <Row className="profileGroupLeaveButton" onClick={this.handleLeaveGroup.bind(this)}>
                            
                            <Col className="groupProfileLeaveGroupText" lg={10} xs={8} >Leave Group </Col>
                                
                            <Col className="groupProfileLeaveButton" lg={1} xs={2}  onClick = {this.props.close} dangerouslySetInnerHTML={{ __html: icon_leave_group }}></Col>

                        </Row>
                        
                        


                    </div>
                </div>     
            </Modal>
       );       
    }     

}

function MemberView (props) {

    var memberName = "";
    if(props.member.scope == "admin"){
        console.log("member scope " + props.member.scope);
        memberName = props.member.user.name + "(admin)";

    }else if(props.member.scope == "moderator"){
        memberName = props.member.user.name + "(moderator)";
    }else{
        memberName = props.member.user.name;
    }

    if(props.member.isBanned == 1){
        return null;
    }

    

    return(
            <Col lg={12} >
            
            
                <Col lg={7} className="profileGroupMemberName">
               
                    <img src = {(utils.CheckEmpty(props.member.user.avatar) ? props.member.user.avatar:user_thumbnail)} />
                
                    <span className="">                   
                        {memberName}                
                    </span>
                </Col>
                <Col lg={4} className="profileActionContainer">

                    <div className="profileGroupMemberKickButton">Kick</div>
                    <div className="profileGroupMemberBanButton">BAN</div>
                    
             
                </Col>
            </Col>
        );
}


const mapStateToProps = (store) =>{
    return {
        loggedInUser : store.users.loggedInUser
        
    };
  };
  
  const mapDispachToProps = dispatch => {
    return {
        leaveGroup : (guid) => dispatch(actionCreator.leaveGroup(guid)),
    };
  };
  
  export default connect( mapStateToProps, mapDispachToProps )(GroupProfileModal);
  
  



