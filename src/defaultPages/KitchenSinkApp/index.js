import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {Avatar} from 'uikit/CometChat';

import { COMETCHAT_CONSTANTS } from '../../consts';

import "./style.scss";
import "./loader.css";

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
      errorMessage = (<p class="error">{this.props.error.message}</p>);
    }

    return (
      <div className="light">
        <div className="wrapper">
          {loader}
          {errorMessage}
          <p className="heading">Kitchen Sink App</p>
          <p className="login-txt">Login with one of our sample users</p>
          <div className="sample-users">
            <div className="sample-user" onClick={()=>this.login('superhero1')}>
              <Avatar image='https://data-us.cometchat.io/assets/images/avatars/ironman.png'></Avatar>
              <p>superhero1</p>
            </div>
            <div className="sample-user" onClick={()=>this.login('superhero2')}>
              <Avatar image='https://data-us.cometchat.io/assets/images/avatars/captainamerica.png'></Avatar>
              <p>superhero2</p>
            </div>
            <div className="sample-user" onClick={()=>this.login('superhero3')}>
              <Avatar image='https://data-us.cometchat.io/assets/images/avatars/spiderman.png'></Avatar>
              <p>superhero3</p>
            </div>
            <div className="sample-user" onClick={()=>this.login('superhero4')}>
              <Avatar image='https://data-us.cometchat.io/assets/images/avatars/wolverine.png'></Avatar>
              <p>superhero4</p>
            </div>
            <div className="sample-user" onClick={()=>this.login('superhero5')}>
              <Avatar image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png'></Avatar>
              <p>superhero5</p>
            </div>
          </div>
          <p className="login-txt"> Login continue with UID</p>
          <input className="uid" ref={this.myRef} type="text" placeholder="Enter your UID here"/>
          <div className="btn-login" onClick={()=>this.login()}>Login</div>
        </div>
      </div>
    );

  }
}

const mapStateToProps = state => {
  return {
      loading: state.loading,
      error: state.error,
      isLoggedin: state.isLoggedin,
      authRedirectPath: state.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onLogin: ( uid, authKey ) => dispatch( actions.auth( uid, authKey ) ),
      onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
      
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( KitchenSinkApp );