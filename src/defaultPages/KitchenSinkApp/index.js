import * as actions from '../../store/action';

import {
  errorStyle,
  inputWrapperStyle,
  loginBtn,
  subtitleStyle,
  thumbnailWrapperStyle,
  titleStyle,
  uidWrapperStyle,
  userContainerStyle,
  userWrapperStyle,
  wrapperStyle,
} from "./style";

import { COMETCHAT_CONSTANTS } from '../../consts';
import { CometChatAvatar } from '../../cometchat-chat-uikit-react/CometChatWorkspace/src';
import { Global } from "@emotion/react";
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { loaderStyle } from "./loader";
import {users} from "../../sampleApp/sampledata"

class KitchenSinkApp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.state = {
      userList: [],
    };
    this.fetchDefaultUsers.bind(this);
  }

  componentDidMount() {
    this.fetchDefaultUsers();
  }

  async fetchDefaultUsers() {
    try {
      const response = await fetch(
        "https://assets.cometchat.io/sampleapp/sampledata.json"
      );
      const data = await response.json();
      this.setState({
        userList: data.users,
      });
    } catch (error) {
      console.log("fetching default users failed, using fallback data", error);
      this.setState({
        userList: users.users,
      });
    }
  }

  login = (uid) => {
    if (!uid) {
      uid = this.myRef.current.value;
    }

    this.uid = uid;
    this.props.onLogin(this.uid, COMETCHAT_CONSTANTS.AUTH_KEY);
  };

  render() {
    let loader = null;
    if (this.props.loading) {
      loader = <div className="loading">Loading...</div>;
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p css={errorStyle()}>{this.props.error.message}</p>;
    }

    let authRedirect = null;
    if (this.props.isLoggedIn) {
      authRedirect = <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <Global styles={loaderStyle} />
        <div css={wrapperStyle()}>
          {authRedirect}
          {loader}
          {errorMessage}
          <p css={titleStyle()}>Kitchen Sink App</p>
          <p css={subtitleStyle()}>Login with one of our sample users</p>
          <div css={userContainerStyle()}>
            {this.state?.userList.map((user, key) => {
              return (
                <div
                  css={userWrapperStyle()}
                  onClick={() => this.login(user.uid)}
                >
                  <div css={thumbnailWrapperStyle()}>
                    <CometChatAvatar image={user.avatar} />
                  </div>
                  <p>{user.name}</p>
                </div>
              );
            })}
          </div>
          <br />
          <div css={uidWrapperStyle()}>
            <div>
              <p css={subtitleStyle()}>Login with UID</p>
            </div>
            <div css={inputWrapperStyle()}>
              <input
                ref={this.myRef}
                type="text"
                placeholder="Enter your UID here"
              />
            </div>
            <div css={loginBtn()}>
              <button type="button" onClick={() => this.login()}>
                Login
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error,
    isLoggedIn: state.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: ( uid, authKey ) => dispatch( actions.auth( uid, authKey ) )
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( KitchenSinkApp );
