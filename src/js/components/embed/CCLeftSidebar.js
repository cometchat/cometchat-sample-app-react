import React, { Component } from "react";
import { Row, Col, Tab, Nav, NavItem } from 'react-bootstrap';
import { connect } from "react-redux";

import CCLeftSidebarHeader from './CCLeftSidebarHeader';
import CCUserList from './CCUserList';
import CCGroupList from './CCGroupList';
import * as utils from './../../lib/uiComponentLib';



var tab_icon_chats = require('./../../../public/img/icon_tab_chats_active.png');
var tab_icon_contact = require('./../../../public/img/icon_tab_contacts.png');
var tab_icon_group = require('./../../../public/img/icon_tab_group.png');


var heightCCUserList = utils.calculateAvailableHeight(74, 65, "ccleftsidebar");



var cclisttabStyle = {
    "width": "50% !important",
    "text-align": "center !important",
}

var ccUserStyle = {

    height: heightCCUserList,
    overflow: "auto",
    margin: "0 20px 0 20px",

};

class CCLeftSidebar extends Component {

    constructor(props){
        super(props);

        this.state = {
            activeTab : "contacts",
        }
    }


    handleSelect(tabName) {
        this.setState({activeTab : tabName });
    }



    render() {
        
        return(
            <div className="ccMainContainer">

            <CCLeftSidebarHeader tabTitle = {this.state.activeTab}></CCLeftSidebarHeader>
    
            <Tab.Container id="sidebarTabContainer" defaultActiveKey={this.state.activeTab} >
                <Row className="clearfix">
                    <div sm={12} className="cc-no-padding border border-radius-top bg-white color-border " style={ccUserStyle} >
                        <Tab.Content animation>
                            <Tab.Pane eventKey="contacts">
                                <CCUserList></CCUserList>
    
                            </Tab.Pane>
    
                            <Tab.Pane eventKey="groups">
                                <CCGroupList />
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                    <Col sm={12} className="cc-no-padding bg-white">
                        <Nav bsStyle="pills" justified
                            onSelect={key => this.handleSelect(key)}
                        >
                            <NavItem eventKey="chats">
                                <img src={tab_icon_chats} className="tab_icon" />
                                <div className="tab_title">Chats</div>
                            </NavItem>
                            <NavItem eventKey="contacts">
                                <img src={tab_icon_contact} className="tab_icon" />
                                <div className="tab_title">Contacts</div>
                            </NavItem>
                            <NavItem eventKey="groups">
                                <img src={tab_icon_group} className="tab_icon" />
                                <div className="tab_title">Groups</div>
                            </NavItem>
    
                        </Nav>
                    </Col>
                </Row>
            </Tab.Container>
    
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
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCLeftSidebar);
