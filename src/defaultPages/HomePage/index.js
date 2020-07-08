import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {Avatar }from '../../react-chat-ui-kit/CometChat';

import "./style.scss";

import * as actions from '../../store/action';

class HomePage extends React.Component {

  render() {

    let authRedirect = null;
    if (!this.props.isLoggedIn) {
      authRedirect = <Redirect to="/login" />
    }

    return (
      <div className="light">
        <div className="wrapper">
          {authRedirect}
          <p className="title">The UI Kit has three different ways to make fully customizable UI required to build a chat application.</p>
          <p className="subtitle">The UI Kit has been developed to help developers of different levels of experience to build a chat application in a few minutes to a couple of hours.</p>          
          <p className="helptext">The UI Kit has three different ways to make chat Applications.</p>

          <div className="components">
            <div className="box">
              <div className="avatar-box">
                <Avatar 
                image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png'></Avatar>
                <h2>UI Unified</h2>
                <p>
                  It open's Activity directly from UI Library. It is pre-defined UI helpful for user to build chat system by
                  integrating it within minutes.
                </p>
              </div>
              <ul className="link-box" >
                <li><Link className="link" to="/embedded-app">Launch</Link></li>
              </ul>
            </div>

            <div className="box">
              <div className="avatar-box">
                <Avatar 
                image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png'></Avatar>
                <h2>UI Screens</h2>
                <p>It open's Screen Activity where user can use predefined screen present in library. User can create their own
                  layout using screen in few minutes.</p>
              </div>
              <ul className="link-box" >
              <li><Link className="link" to="/conversation-screen">Conversations</Link></li>
              <li><Link className="link" to="/group-screen">Groups</Link></li>
              <li><Link className="link" to="/contact-screen">Contacts</Link></li>
            </ul>
            </div>

            <div className="box">
              <div className="avatar-box">
                <Avatar 
                image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png'></Avatar>
                <h2>UI Components</h2>
                <p>It open's Activity directly from UI Library. It is pre-defined UI helpful for user to build chat system by
                  integrating it within minutes.</p>
              </div>
              <ul className="link-box" >
                <li><Link className="link" to="/contact-list">Contacts</Link></li>
                <li><Link className="link" to="/group-list">Groups</Link></li>
                <li><Link className="link" to="/conversations-list">Conversations</Link></li>
              </ul>
            </div>

          </div>

          <div className="btn-logout" onClick={this.props.onLogout}>Logout</div>
        </div>
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