import React, { Component } from "react";
import { connect } from "react-redux";
import * as utils from "./../lib/uiComponentLib";
import CallIncomingNotificationModal from "./modal/CallIncomingNotificationModal";
import CallModal from "./modal/CallModal";
var Userthumbnail = require('./../../public/img/user.png');

class CCCallController extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const callIncomingModal = this.props.call.showIncomingNotification? (<CallIncomingNotificationModal user_avatar={utils.CheckEmpty(this.props.call.callData.sender.avatar) ? this.props.call.callData.sender.avatar : Userthumbnail} user_name={this.props.call.callData.sender.name}></CallIncomingNotificationModal>):null;

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

export default connect(mapStateToProps, null)(CCCallController);