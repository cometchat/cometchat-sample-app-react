import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import App from './defaultPages/App';

import * as serviceWorker from './serviceWorker';
import { CometChat } from "@cometchat-pro/chat"
import { COMETCHAT_CONSTANTS } from './consts';

import reducer from './store/reducer';

import './index.scss';

const store = createStore(reducer, compose(
  applyMiddleware(thunk)
));

var appID = COMETCHAT_CONSTANTS.APP_ID;
var region = COMETCHAT_CONSTANTS.REGION;

var appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
CometChat.init(appID, appSetting).then(() => {

    if(CometChat.setSource) {
      CometChat.setSource("ui-kit", "web", "reactjs");
    }
    console.log("Initialization completed successfully");
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    , document.getElementById('root'));
  },
  error => {
    console.log("Initialization failed with error:", error);
    // Check the reason for error and take appropriate action.
  }
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
