import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import CCGroup from "./CCGroup";
import * as utils from './../../lib/uiComponentLib';
import * as actionCreator from '../../store/actions/cc_action';

class CCGroupList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            _activeGroupUID: this.props.activeGroups.id
        }       
    }


    handleClickUser = (uid) => {
        this.props.updateActiveMessage(uid);
        this.setState({ _activeGroupUID: uid });
    }

    render() {

        let activeUserId = "";

        if(!(utils.isEmpty(this.props.activeGroups))){
            activeUserId = this.props.activeGroups.id;
        }
       
        
        return (
            this.props.groupList.map((el, index) => (
                <CCGroup 
                activeClass={activeUserId == el.guid ? "active" : ""} 
                key={el.guid} 
                status={el.type} 
                guid = {el.guid}
                avt={utils.CheckEmpty(el.icon) ? el.icon : false} 
                showMessageEvent={this.handleClickUser.bind(this, el.guid)}>
                    {el.name}
                </CCGroup>
            ))
        );
    }
}

const mapStateToProps = (store) => {
    return {
        groupList: store.groups.groupsList,
        activeGroups: store.message.activeMessage
    };
};

const mapDispachToProps = dispatch => {
    return {
        updateActiveMessage: (key, type = "group") => dispatch(actionCreator.setActiveMessages(key, type)),
        fetchGroup: (limit) => dispatch(actionCreator.getGroups(limit)),

    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCGroupList);
