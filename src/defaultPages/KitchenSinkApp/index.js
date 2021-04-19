import React from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Global } from "@emotion/core";

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { CometChatAvatar } from '../../cometchat-pro-react-ui-kit/CometChatWorkspace/src';
import { COMETCHAT_CONSTANTS } from '../../consts';

import {
  wrapperStyle,
  errorStyle,
  titleStyle,
  subtitleStyle,
  userContainerStyle,
  userWrapperStyle,
  thumbnailWrapperStyle,
  uidWrapperStyle,
  inputWrapperStyle,
  loginBtn,
} from "./style";

import { loaderStyle } from "./loader";

import * as actions from '../../store/action';

class KitchenSinkApp extends React.PureComponent {

  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  login = (uid) => {
    
    if(!uid) {
      uid = this.myRef.current.value;
    }

    this.uid = uid;
    this.props.onLogin(this.uid, COMETCHAT_CONSTANTS.AUTH_KEY);
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

    let authRedirect = null;
    if (this.props.isLoggedIn) {
      authRedirect = <Redirect to="/" />
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
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero1')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/ironman.png' />
              </div>
              <p>superhero1</p>
            </div>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero2')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/captainamerica.png' />
              </div>
              <p>superhero2</p>
            </div>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero3')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/spiderman.png' />
              </div>
              <p>superhero3</p>
            </div>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero4')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/wolverine.png' />
              </div>
              <p>superhero4</p>
            </div>
            <div css={userWrapperStyle()} onClick={()=>this.login('superhero5')}>
              <div css={thumbnailWrapperStyle()}>
                <CometChatAvatar image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png' />
              </div>
              <p>superhero5</p>
            </div>
          </div><br/>
          <div css={uidWrapperStyle()}>
            <div>
              <p css={subtitleStyle()}>Login with UID</p>
            </div>
            <div css={inputWrapperStyle()}>
              <input ref={this.myRef} type="text" placeholder="Enter your UID here" />
            </div>
            <div css={loginBtn()}><button type="button" onClick={() => this.login()}>Login</button></div>
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
