import React,{Component} from "react";
import ReactDOM from 'react-dom';
import {Row,Col,Tab,Nav,NavItem} from 'react-bootstrap';
import { connect } from "react-redux";
import CCUser from "./CCUser";
import CCGroup from "./CCGroup";

import * as actionCreator from './../../store/actions/cc_action';
import * as utils  from './../../lib/uiComponentLib';

var heightCCUserList = utils.calculateAvailableHeight(50,41,"ccuserlist");
 
var cclisttabStyle = {
    "width": "50% !important",
    "text-align": "center !important",
}

var ccUserStyle = {
    
    height : heightCCUserList,
    overflow:"auto",

}; 

class CCUserList extends Component{

    constructor(props){
        super(props);

        this.state = {
            _activeUserUID : this.props.activeUsers,
        }

        
    }

    handleClickUser=(uid,uType)=>{ 
        this.props.updateActiveUser(uid);
        this.setState({_activeUserUID:uid});        
    }
  
    

    render(){

        
        
        return (
        
        
        <Tab.Container   id="sidebarTabContainer" defaultActiveKey="first" >
            <Row className="clearfix">
                <Col sm={12} className="cc-no-padding">
                    <Nav bsStyle="pills" justified>
                        <NavItem eventKey="first">User</NavItem>
                        {/* <NavItem eventKey="second">Group</NavItem> */}
                    </Nav>
                </Col>
                <Col sm={12} className="cc-no-padding" style={ccUserStyle} >
                <Tab.Content animation>
                    <Tab.Pane eventKey="first">
                    { 
                        this.props.usersList.map((el,index)  => (
                            <CCUser activeClass = {this.state._activeUserUID == el.uid ? "active":""} 
                                key={el.uid} 
                                status={el.status} 
                                avt={utils.CheckEmpty(el.avatar)?el.avatar:false} 
                                showMessageEvent = {this.handleClickUser.bind(this,el.uid,"user")}>
                                {el.name}
                            </CCUser>
                        ))
                    }  
                    
                    </Tab.Pane>

                    {/* <Tab.Pane eventKey="second">
                    
                     { 
                        this.props.groupList.map((el,index)  => (
                            <CCGroup activeClass = {this.state._activeUserUID == el.guid ? "active":""} key={el.guid} status={el.type} avt={utils.CheckEmpty(el.icon)?el.avatar:false} showMessageEvent = {this.handleClickUser.bind(this,el.guid,"group")}>
                                {el.name}
                            </CCGroup>
                        ))
                    }

                    </Tab.Pane> */}
                </Tab.Content>
                </Col>
            </Row>  
        </Tab.Container>
        
          
        
      );
    }  
}

const mapStateToProps = (store) =>{
    return {
      usersList     : store.users.usersList,
      groupList     : store.groups.groupsList,
      activeUsers   : store.users.activeUsers.uid,
    };
};
  
const mapDispachToProps = dispatch => {
    return {
        updateActiveUser :  (key)   => dispatch(actionCreator.setActiveUser(key)),
        fetchUser        :  (limit) => dispatch(actionCreator.getUsers(limit)),
        fetchGroup       :  (limit) => dispatch(actionCreator.getGroups(limit)),
        
    };
};

export default connect( mapStateToProps, mapDispachToProps )(CCUserList);
