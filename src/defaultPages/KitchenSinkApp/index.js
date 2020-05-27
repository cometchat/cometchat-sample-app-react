import React from 'react';

import { CometChat } from '@cometchat-pro/chat';

import 'bootstrap/dist/css/bootstrap.css';

import {Avatar} from '../../lib/CometChat';

import { COMETCHAT_CONSTANTS } from '../../consts';
import "./style.scss";

class KitchenSinkApp extends React.Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {

    CometChat.getLoggedinUser().then(user => {

      if (user) {
        window.location.href = '/';
        this.uid = user.getUid();
      }

    }).catch(error => {
      console.log( error);
      
    });

  }
  
  login = (uid) => {
    
    if(!uid) {
      uid = this.myRef.current.value;
    }

    this.uid = uid;
    
    CometChat.login(this.uid, COMETCHAT_CONSTANTS.API_KEY).then((user) => {

      window.location.href = '/';
    }, error => {
      console.log('CometChatLogin Failed', error);
    });

  }
  
  render() {

    return (
      <div className="light">
        <div style={{ "paddingTop": "50px", "textAlign": "center", "display": "flex" }} >
          <div style={{ "margin": "auto" }}>
            <div style={{ "width": "150px", "margin": "auto" }}>
              <img 
                style={{ "maxWidth": "100%", "maxHeight": "100%" }}
                src="https://www.cometchat.com/wp-content/uploads/2018/03/Logo-C-White.png" alt="" />
            </div>
            <p style={{ "margin": "auto", "fontSize": "42px", "color": "#2da7ff", " fontWeight": "500", "lineHeight": "54px" }}>Kitchen Sink App</p>
            <p style={{ "margin": "auto", "padding": "10px" }}>Login with one of our sample users</p>
            <div style={{ "display": "flex", "width": "100%", "flexWrap": "wrap", "margin": "auto" }}>
              <div className="userSelector" onClick={()=>this.login('superhero1')}>
                <Avatar image='https://data-us.cometchat.io/assets/images/avatars/ironman.png'></Avatar>
                <p style={{ "margin": "auto" }}>superhero1</p>
              </div>
              <div className="userSelector" onClick={()=>this.login('superhero2')}>
                <Avatar image='https://data-us.cometchat.io/assets/images/avatars/captainamerica.png'></Avatar>
                <p style={{ "margin": "auto" }}>superhero2</p>
              </div>
              <div className="userSelector" onClick={()=>this.login('superhero3')}>
                <Avatar image='https://data-us.cometchat.io/assets/images/avatars/spiderman.png'></Avatar>
                <p style={{ "margin": "auto" }}>superhero3</p>
              </div>
              <div className="userSelector" onClick={()=>this.login('superhero4')}>
                <Avatar image='https://data-us.cometchat.io/assets/images/avatars/wolverine.png'></Avatar>
                <p style={{ "margin": "auto" }}>superhero4</p>
              </div>
              <div className="userSelector" onClick={()=>this.login('superhero5')}>
                <Avatar image='https://data-us.cometchat.io/assets/images/avatars/cyclops.png'></Avatar>
                <p style={{ "margin": "auto" }}>superhero5</p>
              </div>
            </div>
            <p style={{"margin": "auto", "padding": "10px"}}> Login continue with UID</p>
            <input ref={this.myRef} style={{"margin": "auto", "padding": "10px"}} type="text" placeholder="Enter your UID here"/>
            <div className="loginButton" onClick={()=>this.login()}>Login</div>
          </div>
        </div>
      </div>
    );

  }
}
    
export default KitchenSinkApp;