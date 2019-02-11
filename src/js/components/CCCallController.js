import React, { Component } from "react";
import { connect } from "react-redux";
import * as utils from "./../lib/uiComponentLib";
import * as actionCreator from './../store/actions/cc_action';

import CallIncomingNotificationModal from "./modal/CallIncomingNotificationModal";

import CallModal from "./modal/CallModal";

var Userthumbnail = require('./../../public/img/user.png');

class CCCallController extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
      
    }
    componentDidMount() {
        
    }


    
    render() {

        console.log("inside cccallcontroller with new ui  : " + this.props.call.showCallWindow  + "\n callincomingmodel : " + this.props.call.showIncomingNotification);

        const callIncomingModal = this.props.call.showIncomingNotification? (<CallIncomingNotificationModal 
            user_avatar={utils.CheckEmpty(this.props.call.callData.sender.avatar) ? this.props.call.callData.sender.avatar : Userthumbnail} 
            user_name={this.props.call.callData.sender.name}></CallIncomingNotificationModal>):null;

        const callWindow = this.props.call.showCallWindow?(<CallModal></CallModal>):null;
        
        return(
            <div>
                {callIncomingModal}
                {callWindow}
            </div>
        );
        
    }

}



const mapStateToProps = (store) => {
    return {
        call : store.call,        
    };
};

const mapDispachToProps = dispatch => {
    return {
                
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCCallController);
