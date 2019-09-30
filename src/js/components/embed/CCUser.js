import React, { Component } from "react";
import { Row } from 'react-bootstrap';
import { CheckEmpty } from './../../lib/uiComponentLib';
var Userthumbnail = require('./../../../public/img/user.png');

export default class CCUser extends Component {

    constructor(props){
        super(props);
    }

    render() {
        let classVar = ['userItem'];
        if (CheckEmpty(this.props.activeClass)) {
            classVar.push(this.props.activeClass);
        }
        var unreadBadge = this.props.unreadCount > 0 ?( <div className="unreadCounter_div"><span className="unreadBadge"> {this.props.unreadCount}</span></div>):null;
        return (
            <div key={this.props.uid} onClick={this.props.showMessageEvent} >
                <Row className={classVar.join(' ')} >
                    <span className="sidebarUserListItemAvatar">
                        <img className="userAvatar img-circle" src={this.props.avt != false ? this.props.avt : Userthumbnail} height="40px" width="40px" />
                    </span>
                    <div className="sidebarUserListItemTitle">
                        <span >{this.props.children}</span>
                    </div>
                    <div className="sidebarUserListItemStatus" data={this.props.status}>
                        <span>{this.props.status}</span>
                    </div>
                    {unreadBadge} 
                </Row>
            </div>
        );
    }
}


