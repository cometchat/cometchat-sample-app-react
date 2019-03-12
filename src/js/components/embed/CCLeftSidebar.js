import React, { Component } from "react";
import { Row, Col, Tab, Nav, NavItem } from 'react-bootstrap';
import { connect } from "react-redux";

import CCLeftSidebarHeader from './CCLeftSidebarHeader';
import CCUserList from './CCUserList';
import CCGroupList from './CCGroupList';
import * as utils from './../../lib/uiComponentLib';

import * as actionCreator from './../../store/actions/cc_action';

import SVGInline from "react-svg-inline";



import tab_icon_chats from './../../../public/img/icon_tab_chat.svg';
import tab_icon_contact from './../../../public/img/icon_tab_contact.svg';
import tab_icon_group from './../../../public/img/icon_tab_group.svg';


var heightCCUserList = utils.calculateAvailableHeight(78, 65, "ccleftsidebar");



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

    constructor(props) {
        super(props);

        this.state = {
            activeTab: "contacts",
        }
    }

    componentDidMount(){
        this.props.addUserListener();
    }

    handleSelect(tabName) {
        this.setState({ activeTab: tabName });
    }

    sidebarScrollContainer = (node) =>{
        if(node) {      
            node.addEventListener("scroll", this.handleScroll.bind(this));      
          }
    }

    handleScroll = (event) => {    
        var node = event.target;
        const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        if (bottom) {      
          if(this.state.activeTab=="contacts"){
            this.props.fetchUser();
          }else{
            this.props.fetchGroup();
          } 
        }    
      }


    render() {

        return (
            <div className="ccMainContainer">

                <CCLeftSidebarHeader activeTab={this.state.activeTab}  tabTitle={this.state.activeTab}></CCLeftSidebarHeader>

                <Tab.Container id="sidebarTabContainer" defaultActiveKey={this.state.activeTab} >
                    <Row className="clearfix">
                        <div key="sidebarScrollContainer" ref={this.sidebarScrollContainer} className="cc-no-padding border border-radius-top bg-white color-border " style={ccUserStyle} >
                            <Tab.Content animation>
                                <Tab.Pane key="contacts" eventKey="contacts">
                                    <CCUserList></CCUserList>

                                </Tab.Pane>

                                <Tab.Pane key="groups" eventKey="groups">
                                    <CCGroupList />
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                        <Col sm={12} className="cc-no-padding bg-white">
                            <Nav bsStyle="pills" justified
                                onSelect={key => this.handleSelect(key)}
                            >
                                {/* <NavItem eventKey="chats">
                                    <SVGInline svg={tab_icon_chats} className="tab-icon" height="20px" width="20px" />
                                    <div className="tab_title">Chats</div>
                                </NavItem> */}
                                <NavItem eventKey="contacts">
                                    <SVGInline svg={tab_icon_contact} className="tab-icon" height="20px" width="20px" />
                                    <div className="tab_title">Contacts</div>
                                </NavItem>
                                <NavItem eventKey="groups">
                                    <SVGInline svg={tab_icon_group} className="tab-icon" height="20px" width="20px" />
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
        fetchUser: () => dispatch(actionCreator.getNextUserList()),
        fetchGroup: () => dispatch(actionCreator.getNextGroupList()),
        addUserListener : () => actionCreator.addUserListener(dispatch),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCLeftSidebar);
