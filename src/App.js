import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import KitchenSinkApp from './defaultPages/KitchenSinkApp';
import HomePage from './defaultPages/HomePage';
import AllComponents from './defaultPages/AllComponents';

import * as actions from './store/action';

import {
  CometChatConversationList,
  CometChatUserList,
  CometChatUnified,
  CometChatGroupList,
  CometChatUserListScreen,
  CometChatConversationListScreen,
  CometChatGroupListScreen 
} from 'uikit/CometChat';

class App extends React.Component {
  state = {
    isLoggedin: false
  }

  componentDidMount() {
    this.props.getLoggedinUser();
  }

  render() {

    let routes = (
      <Switch>
        <Route path="/login" component={KitchenSinkApp} />
        <Redirect to="/login" />
      </Switch>  
    );

    if (this.props.isLoggedIn) {
      routes = (
        <Switch>
          <Route path="/embedded-app" component={CometChatUnified} /> 
          <Route path="/contact-list" component={CometChatUserList} /> 
          <Route path="/group-list" component={CometChatGroupList} /> 
          <Route path="/conversations-list" component={CometChatConversationList} /> 
          <Route path="/contact-screen" component={CometChatUserListScreen} /> 
          <Route path="/conversation-screen" component={CometChatConversationListScreen} /> 
          <Route path="/group-screen" component={CometChatGroupListScreen} /> 
          <Route path="/components" component={AllComponents} />
          <Route exact path="/" component={HomePage} />
          <Redirect to="/" />
        </Switch>  
      );
    }
    
    return (
      <div>{routes}</div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getLoggedinUser: () => dispatch( actions.authCheckState() )
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));