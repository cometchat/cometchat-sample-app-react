import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./style.scss";
import {Avatar} from '../../lib/CometChat';
import { CometChat } from '@cometchat-pro/chat';



class AllComponents extends React.Component {
 

  componentDidMount() {
    CometChat.getLoggedinUser().then(user => {
      if (!user) {
        window.location.href = '/login';
      }
    }, error => {
      console.log(error);
      window.location.href = '/login';
    });

  }

  logout = () => {
    CometChat.logout().then(() => {
      window.location.href = '/login';
    });
  }

  render() {
    return (
      <div className="light">
        <div style={{"display": "flex", "flexDirection": "row", "flexWrap": "wrap"}}>
          <p style={{"width": "90%", "fontSize": "24px","margin":"auto", "color": "rgb(67, 171, 255)", "paddingTop": "50px","textAlign": "center"}}>
            The UI Kit has three different ways to make fully customizable UI required to build a chat application.

  <span style={{"width": "90%","fontSize": "16px", "margin": "auto","color": "#AAA"}}>
              The UI Kit has been developed to help developers of different levels of experience to build a chat application in
              a
              few minutes to a couple of hours.
  </span>
          </p>

          <p style={{"width": "90%","textAlign":"center","fontSize": "16px", "margin": "auto", "color":"#333", "paddingTop": "50px"}}>
            The UI Kit has three different ways to make chat Applications.
</p>

          <div style={{"width": "90%", "margin": "50px","marginLeft": "auto", "marginRight": "auto", "maxWidth":"500px"}}>
            <div
              style={{"backgroundColor": "white", "width": "100%", "height": "100%", "boxShadow":"0px 0px 5px 0px #3335", "borderRadius": "10px", "padding": "5px"}}>
              <div style={{"textAlign": "center"}}>
                <Avatar src="https://data-us.cometchat.io/assets/images/avatars/cyclops.png">

                </Avatar>
                <h2>
                  UI Unified
      </h2>
                <p>
                  It open's Activity directly from UI Library. It is pre-defined UI helpful for user to build chat system by
                  integrating it within minutes.
      </p>
              </div>
              <a className="launchButton" href="/embeded-app">
                <div style={{"width": "100%", "height": "50px", "textAlign": "center", "borderTop": "0.3px solid #e8e8e8","display": "flex"}}>
                  <p style={{"margin": "auto"}}> Launch </p>
                </div>
              </a>
            </div>
          </div>


          <div style={{"width": "90%", "margin": "50px","marginLeft": "auto", "marginRight": "auto", "maxWidth":"500px"}}>
            <div
              style={{"backgroundColor": "white", "width": "100%", "height": "100%", "boxShadow":"0px 0px 5px 0px #3335", "borderRadius": "10px", "padding": "5px"}}>
              <div style={{"textAlign": "center"}}>
                <Avatar src="https://data-us.cometchat.io/assets/images/avatars/cyclops.png">

                </Avatar>
                <h2>
                  UI Screens
      </h2>
                <p>
                  It open's Screen Activity where user can use predefined screen present in library. User can create their own
                  layout using screen in few minutes.
      </p>
                <div style={{"display": "flex"}}>
                  <ul style={{"display":"flex", "width":"100%", "margin": "auto","padding": "5px"}}>
                    <li className="chips">
                      <a href="/conversation-screen">coversations</a>
                    </li>
                    <li className="chips">
                      <a href="/group-screen">group</a>
                    </li>
                    <li className="chips">
                      <a href="/contact-screen">contact</a>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>



          <div style={{"width": "90%", "margin": "50px","marginLeft": "auto", "marginRight": "auto", "maxWidth":"500px"}}>
            <div
              style={{"backgroundColor": "white", "width": "100%", "height": "100%", "boxShadow":"0px 0px 5px 0px #3335", "borderRadius": "10px", "padding": "5px"}}>
              <div style={{"textAlign": "center"}}>
                <Avatar src="https://data-us.cometchat.io/assets/images/avatars/cyclops.png">

                </Avatar>
                <h2>
                  UI Components
      </h2>
                <p>
                  It open's Activity directly from UI Library. It is pre-defined UI helpful for user to build chat system by
                  integrating it within minutes.
      </p>
                <div style={{"display": "flex"}}>
                  <ul style={{"display":"flex","width": "100%", "margin": "auto","padding": "5px"}}>
                    <li className="chips">
                      <a href="/contact-list">User</a>
                    </li>
                    <li className="chips">
                      <a href="/group-list">Groups</a>
                    </li>
                    <li className="chips">
                      <a href="/conversations-list">Conversations</a>
                    </li>

                    <li className="chips">
                      <a href="/components">demo components</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{"width": "90%", "margin": "50px","marginLeft": "auto", "marginRight": "auto", "maxWidth": "maxContent"}}>
          <div onClick={this.logout}
            style={{"width": "100%" ,"height": "100%","display":"flex"}}>
            <div style={{"backgroundColor": "#333", "color": "white", "cursor": "pointer",  "padding":"10px", "boxShadow": "0px 0px 5px 0px #3335", "borderRadius": "10px","textAlign":"center", "width":"maxContent","margin":"auto"}}>
                      Logout
            </div>
        </div>
      </div>
        </div>
        );
  }
}

export default AllComponents;
