import React, { Component } from "react";
import { Row, Col, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from './../../store/actions/cc_action';

import translate from './../../lib/localization/translate';

var captainAmerica = require("./../../../public/img/captainamerica.png");
var ironMan = require("./../../../public/img/ironman.png");
var spiderman = require("./../../../public/img/spiderman.png");
var wolverine = require("./../../../public/img/wolverine.png");
import './login.scss';
 class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginbtn: translate.login,
      loginLoader:false,
    };
  }

  validateForm() {
    return this.state.email.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    if(!this.state.loginloader){
      var user = this.state.email;
      this.setState({
        loginbtn:translate.login_processing,
        loginLoader:true
      });

      var dom = document.getElementById('loginButton'); 
     dom.classList.add('animation-loader');
     dom.removeAttribute('disabled');

     document.getElementById('email').setAttribute('disabled',true);
      
      this.props.setUserSession(user);

    }
    
  }

  handleUserListItemClick = (user) =>{

    if(!this.state.loginLoader){
    console.log("user : " ,  user);
    this.setState({
        loginbtn:translate.login_processing,
        loginLoader:true
    });
    
     var dom = document.getElementById('loginButton'); 
     dom.classList.add('animation-loader');
     dom.removeAttribute('disabled');

     document.getElementById('email').setAttribute('disabled',true);
     //console.log(dom.getAttribute('class'));
      this.props.setUserSession(user);
    }
    
  }

  render() {
    return (
      <Row className="logincontainer border-radius-top">

        <Col md={4} class="login-form-container">
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="email" >
              <ControlLabel>{translate.username}</ControlLabel>
              <FormControl
                autoFocus
                className = "border-radius-full box-shadow border color-border font-size-20 H-64"
                type="Text"
                value={this.state.email}
                 placeholder={translate.login_placeholder}
                onChange={this.handleChange}
              />
            </FormGroup>
            <Button
              className="cc-submit-btn"
              block
              id="loginButton"
              
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"             
            >

              {this.state.loginbtn}

            </Button>
          </form>

          <div className="loginSampleContainer" >

            

            <label>{translate.login_message}</label>
            

            <div className="loginSampleUser" onClick={this.handleUserListItemClick.bind(this,"superhero1")} >
              <img className="loginSampleAvatar" src={ironMan} width={32} />
              <div className="loginSampleUserNameContainer"> 
                <div className="loginSampleUserName"> IronMan </div>
                <div className="loginSampleUserId"> superhero1</div>
              </div>
            </div>


            <div className="loginSampleUser" onClick={this.handleUserListItemClick.bind(this,"superhero2")}>
              <img className="loginSampleAvatar" src={captainAmerica} width={32} />
              <div className="loginSampleUserNameContainer"> 
                <div className="loginSampleUserName"> Captain America  </div>
                <div className="loginSampleUserId"> superhero2</div>
              </div>
            </div>


            <div className="loginSampleUser" onClick={this.handleUserListItemClick.bind(this,"superhero3")} >
              <img className="loginSampleAvatar" src={spiderman} width={32} />
              <div className="loginSampleUserNameContainer"> 
                <div className="loginSampleUserName"> SpiderMan </div>
                <div className="loginSampleUserId"> superhero3</div>
              </div>
            </div>


            <div className="loginSampleUser"onClick={this.handleUserListItemClick.bind(this,"superhero4")} >
              <img className="loginSampleAvatar" src={wolverine} width={32} />
              <div className="loginSampleUserNameContainer"> 
                <div className="loginSampleUserName"> Wolverine </div>
                <div className="loginSampleUserId"> superhero4</div>
              </div>
            </div>


            
          </div>
        </Col>


      </Row>
    );
  }
}



const mapStateToProps = state => {
  return {
    
    loggedInUser : state.users.loggedInUser
  };
};

const mapDispachToProps = dispatch => {
return {
    setUserSession: (object) => dispatch(actionCreator.loginInCC(dispatch,object)), 
  };
};

export default connect(
mapStateToProps,
mapDispachToProps
)(Login);
