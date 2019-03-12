import React,{Component} from "react";
import { connect } from "react-redux";

import Layout from "./layouts/Layout";
import {isEmpty} from "./lib/uiComponentLib";
import Login from "./components/login/Login";

import * as action from "./store/actions/cc_action";

class App extends Component {  
   
componentDidMount(){
   // this.props.login("superhero10");
}
    render() {    
        return (
            <CheckLoginUser loggedStatus = {this.props.loggedInUser} cc_layout = {this.props.cc_layout}/> 
        );
    }
}


function CheckLoginUser(props){

    

    if(isEmpty(props.loggedStatus)){
        console.log("show login screen");
        return <ShowLoginPage/>;
    }else{
        console.log("show Messenger");
        return <ShowMessenger cc_layout = {props.cc_layout}/>;
    }

}

function ShowMessenger(props) {
    return <Layout cc_layout = {props.cc_layout}/>;
}
 

function ShowLoginPage(props) {
    return <Login/>; 
}


const mapStateToProps = state => {
    return {
      
      loggedInUser : state.users.loggedInUser
    };
};
  
const mapDispachToProps = dispatch => {
    return {
        login : (uid) => dispatch(action.loginInCC(dispatch,uid))
    };
};

export default connect(mapStateToProps,mapDispachToProps)(App);







