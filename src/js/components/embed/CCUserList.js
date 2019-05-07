import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import CCUser from "./CCUser";
import * as utils from "./../../lib/uiComponentLib";

import * as actionCreator from "./../../store/actions/cc_action";

class CCUserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _activeUserUID: this.props.activeUsers.id
    };
  }

  handleClickUser = uid => {
    this.props.updateActiveMessage(uid);
    this.setState({ _activeUserUID: uid });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props == nextProps) {
        return false;
      
    }
    return true;
  };

  render() {
    console.log("inside render ccuserlist");
    let activeUserId = "";

    if (!utils.isEmpty(this.props.activeUsers)) {
      activeUserId = this.props.activeUsers.id;
    }

    return this.props.usersList.map((el, index) => (
      <CCUser
        activeClass={activeUserId == el.uid ? "active" : ""}
        key={el.uid}
        uid={el.uid}
        status={el.hasOwnProperty("typeStatus")?((el.typeStatus == true)?"Typing...":el.status):el.status}
        avt={utils.CheckEmpty(el.avatar) ? el.avatar : false}
        showMessageEvent={this.handleClickUser.bind(this, el.uid)}
      >
        {el.name}
      </CCUser>
    ));
  }
}

const mapStateToProps = store => {
  return {
    usersList: store.users.usersList,
    activeUsers: store.message.activeMessage
  };
};

const mapDispachToProps = dispatch => {
  return {
    updateActiveMessage: (key, type = "user") =>
      dispatch(actionCreator.setActiveMessages(key, type)),
    fetchUser: limit => dispatch(actionCreator.getUsers(limit))
  };
};

export default connect(
  mapStateToProps,
  mapDispachToProps
)(CCUserList);
