import React, { Component } from "react";
import { connect } from "react-redux";
import CCUser from "./CCUser";
import * as utils from "./../../lib/uiComponentLib";

import * as actionCreator from "./../../store/actions/cc_action";

import {CometChat} from '@cometchat-pro/chat';

class CCUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _activeUserUID: this.props.activeUsers.id,
      searchMode:false,
      searchData:null,
    };
    this.updateUserList = this.updateUserList.bind(this);
    this.subscribe();
  }

  subscribe(){
    document.addEventListener("fetchUserKey", (e) => {
      var searchkey  = e.detail.key;
      if(searchkey.length == 0){
        this.setState({searchMode:false,searchData:null});
      }else{
        this.fetchUserWithSearchKey(searchkey);
      }
    });
  }

  updateUserList = (userList) => {
    this.setState({searchMode:true,searchData:userList});
  }

  fetchUserWithSearchKey(key){
    var current = this;
    let usersRequest = new CometChat.UsersRequestBuilder().setLimit(100).setSearchKeyWord(key).build();
    usersRequest.fetchNext().then(
      userList => {
        current.updateUserList(userList);
      },
      error => {
        console.log("User list fetching failed with error:", error);
      }
    );
  }

  handleClickUser = uid => {
    this.props.updateActiveMessage(uid);
    this.props.unsetUnReadMessage(uid);
    this.setState({ _activeUserUID: uid });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props == nextProps && this.state == nextState) {
      return false;
    }
    return true;
  };

  render() {
    let activeUserId = "";
    if (!utils.isEmpty(this.props.activeUsers)) {
      activeUserId = this.props.activeUsers.id;
    }
    if(this.state.searchMode){
      if(this.state.searchData != null){
        return this.state.searchData.map((el, index) => (
          <CCUser
            activeClass={""}
            key={el.uid}
            uid={el.uid}
            unreadCount = {el.hasOwnProperty("unreadCount")? el.unreadCount : 0 }
            status={el.hasOwnProperty("typeStatus")?((el.typeStatus == true)?"Typing...":el.status):el.status}
            avt={utils.CheckEmpty(el.avatar) ? el.avatar : false}
            showMessageEvent={this.handleClickUser.bind(this, el.uid)}
          >
          {el.name}
          </CCUser>
        ));
      }
    }else{
      return this.props.usersList.map((el, index) => (
        <CCUser
          activeClass={activeUserId == el.uid ? "active" : ""}
          key={el.uid}
          uid={el.uid}
          unreadCount = {el.hasOwnProperty("unreadCount")? el.unreadCount : 0 }
          status={el.hasOwnProperty("typeStatus")?((el.typeStatus == true)?"Typing...":el.status):el.status}
          avt={utils.CheckEmpty(el.avatar) ? el.avatar : false}
          showMessageEvent={this.handleClickUser.bind(this, el.uid)}
        >
        {el.name}
        </CCUser>
      ));
    }
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
    updateActiveMessage: (key, type = "user") => dispatch(actionCreator.setActiveMessages(key, type)),
    fetchUser: limit => dispatch(actionCreator.getUsers(limit)),
    unsetUnReadMessage:(uid)=> dispatch(actionCreator.unsetUnReadMessage(uid)),
  };
};

export default connect(mapStateToProps,mapDispachToProps)(CCUserList);
