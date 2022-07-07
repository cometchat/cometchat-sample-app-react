import React from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Global } from "@emotion/core";

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { COMETCHAT_CONSTANTS } from '../../consts';
import { GoogleLogin } from '@react-oauth/google';

import {
  wrapperStyle,
  errorStyle,
  titleStyle,
  uidWrapperStyle,
  loginBtn,
} from "./style";

import { loaderStyle } from "./loader";

import * as actions from '../../store/action';
import jwt_decode from "jwt-decode";
import { CometChat } from '@cometchat-pro/chat';

const md5 = require('md5');
class KitchenSinkApp extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
			googleSignInFailed: false
		}

    this.myRef = React.createRef();
  }

  login = (uid) => {
    
    if(!uid) {
      uid = this.myRef.current.value;
    }

    this.uid = uid;
    this.props.onLogin(this.uid, COMETCHAT_CONSTANTS.AUTH_KEY);
  }

  signInSuccess = (response) => {
    var userDetails = jwt_decode(response.credential);

    var uid = md5(userDetails.email);
    var name = userDetails.name;
    var avatar = userDetails.picture;

    var user = new CometChat.User(uid, name);
    user.setAvatar(avatar);

    CometChat.createUser(user, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      user => {
        console.log("user created successfully", user);
        this.login(uid);
      }, error => {
        if(error.code === "ERR_UID_ALREADY_EXISTS"){
          this.login(uid);
        }
      }
    );
  }

  signInFailure = (response) => {
    this.setState({googleSignInFailed: true})
    console.log('failure', response);
  }
  
  render() {

    let loader = null;
    if (this.props.loading) {
      loader = (<div className="loading">Loading...</div>);
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (<p css={errorStyle()}>{this.props.error.message}</p>);
    }

    if (this.state.googleSignInFailed) {
      errorMessage = (<p css={errorStyle()}>Google Sign In Failed</p>);
    }

    let authRedirect = null;
    if (this.props.isLoggedIn) {
      authRedirect = <Redirect to="/embedded-app" />
    }

    return (
      <React.Fragment>
      <Global styles={loaderStyle} />
      <div css={wrapperStyle()}>
          {authRedirect}
          {loader}
          {errorMessage}
          <p css={titleStyle()}>Login with your Google Account</p>
          <br/>
          <div css={uidWrapperStyle()}>
            <div css={loginBtn()}>
              <GoogleLogin
                onSuccess={this.signInSuccess}
                onError={this.signInFailure}
              />
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
