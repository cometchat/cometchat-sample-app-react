import React from 'react';
import './App.css';
import CCBaseComponent from "./components/cometchat/Base";
import { HashRouter, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

function App() {
  const history = createBrowserHistory();
  return (
    <HashRouter history={history}>
    <Switch>
      <CCBaseComponent />
    </Switch>
    </HashRouter>
  );
}

export default App;
