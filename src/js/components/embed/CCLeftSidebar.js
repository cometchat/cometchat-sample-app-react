import React, { Component } from "react";
import { Row, Col, Tab, Nav, NavItem } from 'react-bootstrap';
import { connect } from "react-redux";
import CCLeftSidebarHeader from './CCLeftSidebarHeader';
import CCUserList from './CCUserList';
import CCGroupList from './CCGroupList';
import CCBlockedUserList from './CCBlockedUserList';
import * as utils from './../../lib/uiComponentLib';
import * as actionCreator from './../../store/actions/cc_action';
import translate from './../../lib/localization/translate';
import tab_icon_contact from './../../../public/img/icon_tab_contact.svg';
import tab_icon_group from './../../../public/img/icon_tab_group.svg';
var heightCCUserList = utils.calculateAvailableHeight(124 , 63, "ccleftsidebar");

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
            showBlockedUserList : false,
        };
        this.searchbarRef = React.createRef();
    }

    componentWillMount(){
        this.props.updateUserUnReadMessage();
        this.props.updateGroupUnReadMessage();
    }

    componentDidMount(){
        this.props.addUserListener();
    }

    handleSelect(tabName) {
        this.searchbarRef.current.value = "";
        this.closeSearchMode();
        this.setState({ activeTab: tabName });
    }

    handleBlockedUserVisibility(){
        var visibility = !this.state.showBlockedUserList;
        this.setState({showBlockedUserList:visibility});
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

    handleTextChange = (e) =>{
        var event = null;
        if( this.state.activeTab == "groups"){
            event = new CustomEvent("fetchGroupKey", {detail:{key: e.target.value}});
        }else{
            event = new CustomEvent("fetchUserKey", {detail:{key: e.target.value}});
        }
        document.dispatchEvent(event);
    }  

    closeSearchMode(){
        var event = new CustomEvent("fetchUserKey",{detail:{key:""}});
        document.dispatchEvent(event);
    }

    render() {
        var blockedUserList = this.state.showBlockedUserList ? <CCBlockedUserList handlblockedUserEvent={this.handleBlockedUserVisibility.bind(this)}></CCBlockedUserList>:null;
        return (
            <div className="ccMainContainer">
                {blockedUserList}
                <CCLeftSidebarHeader handlblockedUserEvent={this.handleBlockedUserVisibility.bind(this)} activeTab={this.state.activeTab}  tabTitle={this.state.activeTab}></CCLeftSidebarHeader>
                <Row> 
                    <input ref={this.searchbarRef} type="Text" style={searchBarStyle} placeholder={`Search ${this.state.activeTab}`} onKeyUp={this.handleTextChange.bind(this)}/>
                </Row> 
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
                        <Col sm={12} className="cc-no-padding bg-white bottomNav">
                            <Nav bsStyle="pills" justified
                                onSelect={key => this.handleSelect(key)}
                            >
                            <NavItem eventKey="contacts">
                                <span dangerouslySetInnerHTML={{ __html: tab_icon_contact}} className="tab-icon" height="20px" width="20px" />
                                <div className="tab_title">{translate.contacts}</div>
                            </NavItem>
                            <NavItem eventKey="groups">
                                <span  dangerouslySetInnerHTML={{ __html: tab_icon_group}} className="tab-icon" height="20px" width="20px" />
                                <div className="tab_title">{translate.groups}</div>
                            </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }

  
}

var searchBarStyle = {
    height : "40px",
    width : "90%",
    margin:  "0 5% 20px 5%",
    border: "none",
    borderRadius: "20px",
    padding: "16px",
    fontSize: "14px"
};

const mapDispachToProps = dispatch => {
    return {
        fetchUser: () => dispatch(actionCreator.getNextUserList()),
        fetchGroup: () => dispatch(actionCreator.getNextGroupList()),
        addUserListener : () => actionCreator.addUserListener(dispatch),
        updateUserUnReadMessage : () => dispatch(actionCreator.updateUserUnReadMessage()),
        updateGroupUnReadMessage: ()=> dispatch(actionCreator.updateGroupUnReadMessage()),
    };
};

export default connect(null, mapDispachToProps)(CCLeftSidebar);
