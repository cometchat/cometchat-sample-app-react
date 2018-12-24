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
            _activeUserUID: this.props.activeUsers,
        }
    }

    handleClickUser = (uid, uType) => {
        this.props.updateActiveUser(uid);
        this.setState({ _activeUserUID: uid });
    }

   render() {
        return (
            this.props.groupList.map((el, index) => (
                <CCGroup activeClass={this.state._activeUserUID == el.guid ? "active" : ""} key={el.guid} status={el.type} avt={utils.CheckEmpty(el.icon) ? el.avatar : false} showMessageEvent={this.handleClickUser.bind(this, el.guid, "group")}>
                    {el.name}
                </CCGroup>
            ))
        );
    }
}

const mapStateToProps = (store) => {
    return {
        groupList: store.groups.groupsList,
        activeUsers: store.users.activeUsers.uid,
    };
};

const mapDispachToProps = dispatch => {
    return {
        updateActiveUser: (key) => dispatch(actionCreator.setActiveUser(key)),
        fetchGroup: (limit) => dispatch(actionCreator.getGroups(limit)),

    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCGroupList);
