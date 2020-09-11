import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';

/** @jsx jsx */
import { jsx } from '@emotion/core';

import PrivateRoute from '../../PrivateRoute';

import KitchenSinkApp from '../../defaultPages/KitchenSinkApp';
import HomePage from '../../defaultPages/HomePage';
import AllComponents from '../../defaultPages/AllComponents';

import * as actions from '../../store/action';

import {
    CometChatConversationList,
    CometChatUserList,
    CometChatUnified,
    CometChatGroupList,
    CometChatUserListScreen,
    CometChatConversationListScreen,
    CometChatGroupListScreen
} from '../../react-chat-ui-kit/CometChat';

import {
    wrapperStyle
} from "./style";

const history = createBrowserHistory();

class App extends React.Component {
    state = {
        isLoggedin: false
    }

    componentDidMount() {
        this.props.getLoggedinUser();
    }

    render() {

        return (
            <div css={wrapperStyle()}>
                <Router history={history}>
                    <Switch>
                        <PrivateRoute path="/embedded-app" component={CometChatUnified} />
                        <PrivateRoute path="/contact-list" component={CometChatUserList} />
                        <PrivateRoute path="/group-list" component={CometChatGroupList} />
                        <PrivateRoute path="/conversations-list" component={CometChatConversationList} />
                        <PrivateRoute path="/contact-screen" component={CometChatUserListScreen} />
                        <PrivateRoute path="/conversation-screen" component={CometChatConversationListScreen} />
                        <PrivateRoute path="/group-screen" component={CometChatGroupListScreen} />
                        <PrivateRoute exact path="/" component={HomePage} />
                        <Route path="/login" component={KitchenSinkApp} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getLoggedinUser: () => dispatch(actions.authCheckState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);