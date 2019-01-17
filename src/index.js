import React from 'react'
import ReactDOM  from 'react-dom'
import { Provider } from 'react-redux'

import { createStore,combineReducers,applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import {reducers} from './js/store/reducer'

import App from './js/App'

import './public/css/config.css';

import { icons } from './js/lib/icons';
import { library, dom } from '@fortawesome/fontawesome-svg-core';


library.add(icons);
dom.watch();


const rootReducers = combineReducers(reducers);
const store = createStore(rootReducers,applyMiddleware(thunk));

import CCManager from './js/lib/cometchat/ccManager';
CCManager.init(store.dispatch);



const app = document.getElementById('cometchat');
let layout = app.getAttribute('cc-layout');


ReactDOM.render(<Provider store={store}><App cc_layout={layout}/></Provider>, app);
