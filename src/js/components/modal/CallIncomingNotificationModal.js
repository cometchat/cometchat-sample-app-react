import React from "react";
import Modal from './Modal';

import { connect } from 'react-redux';

import * as actionCreator from "./../../store/actions/cc_action";
import * as utils from './../../lib/uiComponentLib';

import icon_call_accept from "./../../../public/img/icon_call_notification_accept.svg";
import icon_call_reject from "./../../../public/img/icon_call_notification_reject.svg";

var Userthumbnail = require('./../../../public/img/user.png');


class CallIncomingNotification extends React.PureComponent {

    constructor(props) {
        super(props);    
    }

    componentDidMount(){   }

    acceptCall(){

        this.props.acceptCall(this.props.call.callData);

    }

    rejectCall(){
        this.props.rejectCall(this.props.call.callData);
    }
    render(){

        const user_avatar = utils.CheckEmpty(this.props.user_avatar) ? this.props.user_avatar : Userthumbnail ;

        return ( 
            <Modal >
                
                <div className="callNotificationModal">
                    <div class="CallNotificationHeader" >
                        <span class="CallNotificationUserImageContainer" >
                        
                            <img class="img-circle" src={user_avatar} height="40px" width="40px"/>
                        </span>
                        
                        <div className = "CallNotificationDetailContainer">
                            
                            <div class="CallNotificationUserName">
                                <span>{this.props.user_name}</span>
                            </div>

                            <div class="CallNotificationUserStatus">
                                <span>Incoming Call</span>
                            </div>
                        </div>

                        <div class="btnAcceptCallNotification" dangerouslySetInnerHTML={{__html:icon_call_accept}}
                        onClick={this.acceptCall.bind(this)} />
                             
                        

                        <div class="btnRejectCallNotification" dangerouslySetInnerHTML={{__html:icon_call_reject}}
                        onClick={this.rejectCall.bind(this)} />
                            
                        
                    </div>
                </div>    
                             
            </Modal>
       );
       
    }
    

}


const mapStateToProps = (store) =>{
    return {
        call :  store.call,
        
    };
  };
  
  const mapDispachToProps = dispatch => {
    return {
        acceptCall: (call) =>    dispatch(actionCreator.acceptCall(call)),
        rejectCall: (call) =>    dispatch(actionCreator.rejectCall(call)),

    };
  };
  
  export default connect( mapStateToProps, mapDispachToProps )(CallIncomingNotification);
  
  



