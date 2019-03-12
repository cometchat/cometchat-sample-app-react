import React,{Component} from "react";
import {Row, Col, ListGroup} from 'react-bootstrap';
import { connect } from "react-redux";

import { CheckEmpty } from './../../lib/uiComponentLib';
import PasswordRequestModal from './../modal/PasswordRequestModal';

import * as actionCreator from '../../store/actions/cc_action';

var Groupthumbnail = require('./../../../public/img/group.jpg');


 class CCGroups extends Component{

    constructor(props){
        super(props);
        this.state = {
            showPasswordModal :false
        }

    }

    joinGroup(){
        this.props.updateGroupDetailsJoined(this.props.groupData); 
        this.props.showMessageEvent();
    }
    handleClickGroup =()=>{

        var group = this.props.groupData;

        switch(group.type){
            case "public":
                console.log("group type: ", (group.hasJoined));
                if(group.hasJoined){
                    this.props.showMessageEvent();
                }else{                  
                     actionCreator.joinPublicGroup(group).then(
                        groupData =>{
                          console.log("Joined Group", groupData);
                          this.props.updateGroupDetailsJoined(group);
                          this.props.showMessageEvent();
                        }
                      );
                }
                
    

            break;
    
            case "password":
                    
                console.log("group type: ", (group.type));
                console.log("group hasjoined: ", (group.hasJoined));
                if(group.hasJoined == false){                   
                   this. showPasswordModal();
                }else{
                    this.props.showMessageEvent();     
                }
                
               
    
            break;
            
            case "private":
                console.log("group type: ", (group.type));
                if(group.hasJoined){
                    this.props.showMessageEvent();
                }else{
                    actionCreator.joinPrivateGroup(group).then(
                        groupData =>{
                          console.log("Joined Group", groupData);
                          this.props.updateGroupDetailsJoined(group);
                          this.props.showMessageEvent();
                        }
                      );
                }
            break;
            
    
            }

       
    }

    hidePasswordModal(){
        this.setState({showPasswordModal:false});
    }
    showPasswordModal(){
        this.setState({showPasswordModal:true});
    }

    
    render(){
        let classVar = ['userItem'];

        if (CheckEmpty(this.props.activeClass)) {
            classVar.push(this.props.activeClass);
        }

        const passwordModal = this.state.showPasswordModal ? <PasswordRequestModal group={this.props.groupData} joinGroup={this.joinGroup.bind(this)} close={this.hidePasswordModal.bind(this)}></PasswordRequestModal>:null;
    
        return (
            <div>
            <div key={this.props.guid} onClick={this.handleClickGroup.bind(this)}>
                <Row className = {classVar.join(' ')}>
                    <span className="sidebarUserListItemAvatar">
                        <img className="userAvatar img-circle" src={this.props.avt!=false?this.props.avt:Groupthumbnail}  height = "40px" width = "40px"/>
                    </span>
                    
                    <div className="sidebarUserListItemTitle">
                        <span >{this.props.group_name}</span>
                    </div>
                   
                    <div className="sidebarUserListItemStatus">
                        <span >{this.props.status}</span>
                    </div>
                

                </Row>
                
            </div>
                {passwordModal}
            </div>
        );
        
    }
}

const mapStateToProps = (store) => {
    return {
     
    };
};

const mapDispachToProps = dispatch => {
    return { 

        updateGroupDetailsJoined: (group) => dispatch(actionCreator.updateGroupJoined(group)),

    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCGroups);



