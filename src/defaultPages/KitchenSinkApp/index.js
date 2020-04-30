import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./style.scss";
import {Avatar} from '../../lib/CometChat';
import { CometChat } from '@cometchat-pro/chat';
import { COMETCHAT_CONSTANTS } from '../../consts';


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
      } else {

        this.showUi = true;
        this.showloader = false;
      }
    }, error => {
      console.log( error);
      this.showUi = true;
      this.showloader = false;
    });

  }
  login = (uid) => {
    if(!uid){
      uid=this.myRef.current.value
    }
    this.showloader = true;
    if (uid) {
      this.uid = uid;
    }

    CometChat.login(this.uid, COMETCHAT_CONSTANTS.API_KEY).then((user) => {
      window.location.href = '/';
    }, error => {
      console.log('CometChatLogin Failed', error);
      this.showloader = false;
    });


  }
  
  render() {
    return (
      <div className="light"  >
        {/* <div style={{ "position": "fixed", "width": "100%", "height": "100%" }} > */}
          {/* <loader>

          </loader> */}
        {/* </div> */}
        <div style={{ "paddingTop": "50px", "textAlign": "center", "display": "flex" }} >
          <div style={{ "margin": "auto" }}>
            <div style={{ "width": "150px", "margin": "auto" }}>
              <img style={{ "maxWidth": "100%", "maxHeight": "100%" }}
                src="https://www.cometchat.com/wp-content/uploads/2018/03/Logo-C-White.png" alt="" />
            </div>

            <p style={{ "margin": "auto", "fontSize": "42px", "color": "#2da7ff", " fontWeight": "500", "lineHeight": "54px" }}>Kitchen Sink App
        </p>

            <p style={{ "margin": "auto", "padding": "10px" }}>
              Login with one of our sample users
        </p>
            <div style={{ "display": "flex", "width": "100%", "flexWrap": "wrap", "margin": "auto" }}>
              <div className="userSelector">
                <Avatar src={{avatar:'https://data-us.cometchat.io/assets/images/avatars/ironman.png',name:'iron man',uid:'superhero1'}}
                  style={{ "margin": "auto", "width": "10%", "marginTop": " 13px" }}></Avatar>
                <p style={{ "margin": "auto" }}><a onClick={()=>this.login('superhero1')} href="#"> superhero1</a></p>
              </div>
              <div className="userSelector">
                <Avatar src={{avatar:'https://data-us.cometchat.io/assets/images/avatars/captainamerica.png',name:'captain america ',uid:'superhero1'}}
                  style={{ "margin": "auto", "width": "10%", "marginTop": " 13px" }}></Avatar>
                <p style={{ "margin": "auto" }}><a onClick={()=>this.login('superhero2')} href="/#"> superhero2</a></p>
              </div>
              <div className="userSelector">
                <Avatar src={{avatar:'https://data-us.cometchat.io/assets/images/avatars/spiderman.png',name:'spiderman',uid:'superhero1'}}
                  style={{ "margin": "auto", "width": "10%", "marginTop": " 13px" }}></Avatar>
                <p style={{ "margin": "auto" }}><a onClick={()=>this.login('superhero3')} href="/#"> superhero3</a></p>
              </div>
              <div className="userSelector">
                <Avatar src={{avatar:'https://data-us.cometchat.io/assets/images/avatars/wolverine.png',name:'wolverine ',uid:'superhero1'}}
                  style={{ "margin": "auto", "width": "10%", "marginTop": " 13px" }}></Avatar>
                <p style={{ "margin": "auto" }}><a onClick={()=>this.login('superhero4')} href="/#"> superhero4</a></p>
              </div>
              <div className="userSelector">
                <Avatar src={{avatar:'https://data-us.cometchat.io/assets/images/avatars/cyclops.png',name:'cyclops',uid:'superhero1'}} 
                  style={{ "margin": "auto", "width": "10%", "marginTop": " 13px" }}></Avatar>
                <p style={{ "margin": "auto" }}><a onClick={()=>this.login('superhero5')}  href="/#"> superhero5</a>
                </p>
              </div>
            </div>
            <p style={{"margin": "auto", "padding": "10px"}}> Login continue with UID</p>
            <input ref={this.myRef} style={{"margin": "auto", "padding": "10px"}} type="text" placeholder="Enter your UID here"/>

              <div className="loginButton" onClick={()=>this.login()}> Login</div>
    </div>

          </div>

        </div>
        );
      }
    }
    
    export default KitchenSinkApp;
