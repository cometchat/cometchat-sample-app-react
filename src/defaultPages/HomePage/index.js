import React from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Avatar }from '../../react-chat-ui-kit/CometChat';

import {
  wrapperStyle,
  titleStyle,
  subTitleStyle,
  helpTextStyle,
  componentStyle,
  boxStyle,
  titleWrapperStyle,
  thumbnailWrapperStyle,
  componentTitleStyle,
  descWrapperStyle,
  linkWrapperStyle,
  linkStyle,
  logoutBtn
} from "./style";

import * as actions from '../../store/action';

class HomePage extends React.Component {

  render() {

    let authRedirect = null;
    if (!this.props.isLoggedIn) {
      authRedirect = <Redirect to="/login" />
    }

    return (
        <div css={wrapperStyle()}>
          {authRedirect}
          <p css={titleStyle()}>The UI Kit has three different ways to make fully customizable UI required to build a chat application.</p>
          <p css={subTitleStyle()}>The UI Kit has been developed to help developers of different levels of experience to build a chat application in a few minutes to a couple of hours.</p>          
          <p css={helpTextStyle()}>The UI Kit has three different ways to make chat Applications.</p>

          <div css={componentStyle()}>

            <div css={boxStyle()}>
              <div css={titleWrapperStyle()}>
                <div css={thumbnailWrapperStyle}>
                  <Avatar image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png' />
                </div>
                <h2 css={componentTitleStyle()}>UI Unified</h2>
              </div>
              <div css={descWrapperStyle()}>
                <p>It open's Activity directly from UI Library. It is pre-defined UI helpful for user to build chat system by
                  integrating it within minutes.</p>
              </div>
              <ul css={linkWrapperStyle()}>
                <li><Link css={linkStyle()} to="/embedded-app">Launch</Link></li>
              </ul>
            </div>
            <div css={boxStyle()}>
              <div css={titleWrapperStyle()}>
                <div css={thumbnailWrapperStyle()}>
                  <Avatar image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png' />
                </div>
                <h2 css={componentTitleStyle()}>UI Screens</h2>
              </div>
              <div css={descWrapperStyle()}>
                <p>It open's Screen Activity where user can use predefined screen present in library. User can create their own
                  layout using screen in few minutes.</p>
              </div>
              <ul css={linkWrapperStyle()}>
                <li><Link css={linkStyle()} to="/conversation-screen">Conversations</Link></li>
                <li><Link css={linkStyle()} to="/group-screen">Groups</Link></li>
                <li><Link css={linkStyle()} to="/contact-screen">Contacts</Link></li>
              </ul>
            </div>

            <div css={boxStyle()}>
              <div css={titleWrapperStyle()}>
                <div css={thumbnailWrapperStyle()}>
                  <Avatar image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png' />
                </div>
                <h2 css={componentTitleStyle()}>UI Components</h2>
              </div>
              <div css={descWrapperStyle()}>
                <p>It open's Activity directly from UI Library. It is pre-defined UI helpful for user to build chat system by
                  integrating it within minutes.</p>
              </div>
              <ul css={linkWrapperStyle()}>
                <li><Link css={linkStyle()} to="/contact-list">Contacts</Link></li>
                <li><Link css={linkStyle()} to="/group-list">Groups</Link></li>
                <li><Link css={linkStyle()} to="/conversations-list">Conversations</Link></li>
              </ul>
            </div>

          </div>

          <div css={logoutBtn()}><button onClick={this.props.onLogout}>Logout</button></div>
        </div>
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
    onLogout: () => dispatch(actions.logout())
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( HomePage );