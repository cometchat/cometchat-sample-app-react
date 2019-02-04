import React, { Component } from "react";
import { Row, Col, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from './../../store/actions/cc_action';

 class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
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
    var user = this.state.email;
    
    this.props.setUserSession(user);
  }

  render() {
    return (
      <Row className="logincontainer border-radius-top">

        <Col md={4} class="login-form-container">
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="email" >
              <ControlLabel>Username</ControlLabel>
              <FormControl
                autoFocus
                className = "border-radius-full box-shadow border color-border font-size-20 H-64"
                type="Text"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </FormGroup>
            <Button
              className="cc-submit-btn"
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
            >
              Login
            </Button>
          </form>
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
