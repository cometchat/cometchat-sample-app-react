import React, { Component } from "react";
import cometchatLogo from "../../resources/images/cometchat_white.png";
import ironman from "../../resources/images/ironman@2x.png";
import captainamerica from "../../resources/images/captainamerica@2x.png";
import spiderman from "../../resources/images/spiderman@2x.png";
import wolverine from "../../resources/images/wolverine@2x.png";
import loader from "../../resources/images/loading1.gif";
import DemoUser from "./DemoUser";

class LoginForm extends Component {
  componentDidMount() {
    if (this.props.uid !== "") window.location = "/#/chat";
  }

  render() {
    return (
      <React.Fragment>
        <div className="cc-logo">
          <img src={cometchatLogo} alt="cometchat logo" />
        </div>
        <div className="border-0 login-form-box bg-white px-5 py-5 col-lg-6 col-sm-12 col-md-9 col-xs-12">
          <form className="">
            <div className="form-group">
              <input
                required
                className="form-control form-control-lg"
                placeholder="Enter UID"
                type="text"
                onChange={e => this.props.handleInputChange(e)}
              />
            </div>
            <div className="form-group mb-0 mt-3">
              <button
                disabled={this.props.loginBtnDisabled}
                className="btn btn-cc btn-lg btn-block"
                id="cc_login_btn"
                onClick={event => this.props.handleLogin(event)}
              >
                {this.props.loginBtnDisabled ? "Processing" : "Login"}
                {this.props.loginBtnDisabled ? (
                  <img className="loader" src={loader} alt="loading..." />
                ) : (
                  ""
                )}
              </button>
            </div>
            <p className="text-center mt-3 info-text">
              Haven't created a user yet? Select one of our default users for
              testing :
            </p>
            <div>
              <DemoUser
                name="IronMan"
                avatar={ironman}
                uid="superhero1"
                margin="mr-2"
                handleDemoLogin={this.props.handleDemoLogin}
              />
              <DemoUser
                name="CaptainAmerica"
                avatar={captainamerica}
                uid="superhero2"
                margin=""
                handleDemoLogin={this.props.handleDemoLogin}
              />
              <DemoUser
                name="SpiderMan"
                avatar={spiderman}
                uid="superhero3"
                margin="mr-2"
                handleDemoLogin={this.props.handleDemoLogin}
              />
              <DemoUser
                name="Wolverine"
                avatar={wolverine}
                uid="superhero4"
                margin=""
                handleDemoLogin={this.props.handleDemoLogin}
              />
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginForm;
