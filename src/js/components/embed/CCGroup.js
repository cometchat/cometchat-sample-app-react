import React,{Component} from "react";
import {Row, Col, ListGroup} from 'react-bootstrap';
import { connect } from "react-redux";

var Userthumbnail = require('./../../../public/img/user.png');

 export default class CCGroups extends Component{
    
    render(){
    
        return (
            <div onClick={this.props.showMessageEvent}>
                <Row className = 'userItem'>
                    <span className="sidebarUserListItemAvatar">
                        <img className="userAvatar img-circle" src={this.props.avt!=false?this.props.avt:Userthumbnail}  height = "50px" width = "50px"/>
                    </span>
                    
                    <div className="sidebarUserListItemTitle">
                        <span >{this.props.children}</span>
                    </div>
                   
                    <div className="sidebarUserListItemStatus">
                        <span >{this.props.status}</span>
                    </div>
                

                </Row>
            </div>
        );
        
    }
}


