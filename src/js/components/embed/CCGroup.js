import React,{Component} from "react";
import {Row, Col, ListGroup} from 'react-bootstrap';
import { connect } from "react-redux";

import { CheckEmpty } from './../../lib/uiComponentLib';

var Groupthumbnail = require('./../../../public/img/group.jpg');

 export default class CCGroups extends Component{
    
    render(){
        let classVar = ['userItem'];

        if (CheckEmpty(this.props.activeClass)) {
            classVar.push(this.props.activeClass);
        }


    
        return (
            <div key={this.props.guid} onClick={this.props.showMessageEvent}>
                <Row className = {classVar.join(' ')}>
                    <span className="sidebarUserListItemAvatar">
                        <img className="userAvatar img-circle" src={this.props.avt!=false?this.props.avt:Groupthumbnail}  height = "40px" width = "40px"/>
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


