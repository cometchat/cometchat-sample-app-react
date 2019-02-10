import React from "react";
import Modal from './Modal';
import { connect } from 'react-redux';

import * as actionCreator from "./../../store/actions/cc_action";
import CCCall from './../call/CCCall';
import {CometChat} from "@cometchat-pro/chat";

import icon_call_accept from "./../../../public/img/icon_call_accept.svg";
import icon_call_reject from "./../../../public/img/icon_call_reject.svg";

class CallModal extends React.PureComponent {

    constructor(props) {
        super(props);    
    }

    componentDidMount(){ 

    console.log("Inside componentDidMount call status: "  + this.props.call.callStatus);

        if(this.props.call.callStatus == 1){
    
        }else{
           
            var callType = "";
            if(this.props.call_type =="audio")
                callType = CometChat.CALL_TYPE.AUDIO;
            else{
                callType = CometChat.CALL_TYPE.VIDEO;
            }

            this.props.initCall(this.props.call.callInitData.call_user_id,callType,this.props.call.callInitData.call_user);
        }        
    }

    cancelCall(){
        this.props.cancelCall(this.props.call.callData);        
    }

    
    render(){
        
        if(this.props.call.callStatus == 1){

            //show dom & start call

            return(
              <CCCall callData = {this.props.call.callData}></CCCall> 
            );



        }else{

            //init call ui
            return ( 
                <Modal>
                    <div className="modal">
                        <div class="CallModalContent">
                
                            <div className="callUserImage">
                                <img src={this.props.call.callInitData.calluser_avatar} class="callUserImageObj" />
                            </div>     
    
                            <div className="callUserStatus">
                                {this.props.call.callInitData.user_name}
                            </div>
                        </div>
                        
                        <div class="callModalFooter">
    
                            {/* <div class="btnAcceptCall" dangerouslySetInnerHTML={{__html:icon_call_accept}}>
                            </div> */}
    
                            <div class="btnRejectCall" dangerouslySetInnerHTML={{__html:icon_call_reject}} onClick={this.cancelCall.bind(this)} />                    
                            
                        </div>
                    </div>                 
                </Modal>
           );
        }

        


       
       
    }  

}



const mapStateToProps = (store) => {
    return {
       call : store.call
    };
};

const mapDispachToProps = dispatch => {
    return {
        initCall: (uid,callType,userType) => dispatch(actionCreator.initializeCall(uid,callType,userType)),
        cancelCall: (call) =>dispatch(actionCreator.cancelCall(call)),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CallModal);



