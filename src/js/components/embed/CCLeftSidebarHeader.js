import React, { Component } from "react";

import { Row, Col, OverlayTrigger, Button, Popover } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import iconNewMessage from './../../../public/img/icon_new_message.svg';
import iconMore from './../../../public/img/icon_more.svg';

import GroupCreateModal from "./../modal/GroupCreateModal";

import * as action from "./../../store/actions/cc_action";
import { connect } from "react-redux";

import translate from "./../../lib/localization/translate";
import icon_block from "./../../../public/img/icon_block.svg";
import icon_logout from "./../../../public/img/icon_logout.svg";

class CCLeftSidebarHeader extends Component {

    constructor(props) {
        super(props);
        this.overlaySidebarRef = React.createRef();

        this.state = {
            showCreateModal : false,
        }

    }

    handleLogoutClick=()=>{
        console.log("inside logout event here" + this);
        this.props.logout();
    }

    handleBlockedUser=()=>{
        console.log("inside handleBlockedUser event here" ,  this.overlaySidebarRef.current);
        this.props.handlblockedUserEvent();
        this.overlaySidebarRef.current.hide();
    }


    hideGroupCreateModal(){
        this.setState({showCreateModal:false});
    }
    showGroupCreateModal(){
        this.setState({showCreateModal:true});
    }

    handleCreateNewGroup(activeTab){
        if(activeTab == 'groups'){
            this.showGroupCreateModal();
        }
    }

    render() {

        let title = this.props.tabTitle;
        //let tabName = title.charAt(0).toUpperCase() + title.slice(1);
        let tabName = title.charAt(0) + title.slice(1);
        
        const createGroup = this.state.showCreateModal ?<GroupCreateModal close={this.hideGroupCreateModal.bind(this)} /> :null;
        const clickEvents = {
            logout:this.handleLogoutClick,
            blockedUser:this.handleBlockedUser

        };
        return (<Row className="sidebarHeader">
            <div>
                <span class="font-title color-font-title size-title">{translate[title]}</span>

                
                    <OverlayTrigger ref={this.overlaySidebarRef}  trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose(clickEvents)} >
                    
                        <div dangerouslySetInnerHTML={{ __html: iconMore }} className="header-icon" /> 
                    
                    </OverlayTrigger>

                

                    <div className="header-icon margin-right-10" onClick={this.handleCreateNewGroup.bind(this,this.props.activeTab)}  dangerouslySetInnerHTML={{ __html: iconNewMessage }} ></div>

                    {createGroup}
            </div>

        </Row>);
    }
}

const popoverClickRootClose = (event)=> {
 return (
    <Popover id="popover-trigger-click-root-close" >
        <div>

            <span className="messageHeaderMenuItem" onClick={event.logout} >
                   <div className="messageHeaderMenuIcon " dangerouslySetInnerHTML={{__html:icon_logout}}/>
                   {translate.logout}
            </span> 

            <span className="messageHeaderMenuItem" onClick={event.blockedUser}>
                   <div className="messageHeaderMenuIcon " dangerouslySetInnerHTML={{__html:icon_block}}/>
                   Blocked Users
            </span> 
        </div>
    </Popover>
 ) ;  
};


const mapStateToProps = state => {
    return {
      
    };
};
  
const mapDispachToProps = dispatch => {
    return {
        logout : () => dispatch(action.logout(dispatch)),
    };
};

export default connect(mapStateToProps,mapDispachToProps)(CCLeftSidebarHeader);