import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from './../../lib/uiComponentLib';
import * as utils from './../../lib/uiComponentLib';

var Userthumbnail = require('./../../../public/img/user.png');
var Groupthumbnail = require('./../../../public/img/group.jpg');

import { CometChat} from "@cometchat-pro/chat";

import ImageViewerModal from './../modal/ImageViewerModal';

import icon_msg_file from './../../../public/img/icon_msg_file.svg';
import icon_msg_delivered from './../../../public/img/icon_delivered.svg';
import icon_read from './../../../public/img/icon_read.svg';


class CCMessage extends Component {

    constructor(props){
        
        super(props);

        this.state = {
            showModal : false,
            imageUrl:""
        }
    }



    openModalHandler = (image) => {

        console.log("insideopenmodal : " + image );

        this.setState({
            showModal: true,
            imageUrl:image
        });
          
                
      }
    
      closeModalHandler = () => {
          this.setState({
            showModal: false,
            image:""
            
          });
      }

     

    

    render() {
        console.log("message : " + JSON.stringify(this.props.msgData));
        var msg = {
            msgId : this.props.msgData.id,
            data: this.props.msgData.data,
            sid : this.props.msgData.sender.uid,
            loggedInUser: this.props.loggedUid,
            sendAt: this.props.msgData.sentAt,
            msgType : this.props.msgData.type,
        }
        console.log("message sender id : " + JSON.stringify(msg.sid.uid));

        msg.username = this.props.msgData.sender.name;
        msg.avatar = utils.CheckEmpty(this.props.msgData.sender.avatar) ? this.props.msgData.sender.avatar : Userthumbnail;

        const imageViewerModal  = this.state.showModal ? (<ImageViewerModal image_src={this.state.imageUrl} handleClose={this.closeModalHandler.bind(this)}/>) : null;

        switch(this.props.msgData.category){
            case CometChat.CATEGORY_CALL: 
                return (
                    //to handle all call messages
                    
                    <MessageCall msg={msg} openImageViewer={(image)=>this.openModalHandler.bind(this,image)}/>
                        
                    
                );
            break;

            case CometChat.CATEGORY_MESSAGE:
            
                //to handle all messages
                return (
                    <div key={msg.msgId}>
                        <MessageType msg={msg} msgData={this.props.msgData} openImageViewer={(image)=>this.openModalHandler.bind(this,image)}/>
                        {imageViewerModal}
                    </div>
                );        
            break;
            
            case CometChat.CATEGORY_ACTION :
                    console.log("inside category action :",  this.props.msgData);
                    //to handle group action
                return (
                    <div key={msg.msgId} className="messageActionsContainer">
                        <MessageAction msg={this.props.msgData} openImageViewer={(image)=>this.openModalHandler.bind(this,image)}/>
                        
                    </div>
                );      
            break;

        }
        
    }
}


function MessageCall(props){
    return null;
    // if(props.msg.data.action  === 'initiated'){
    //     return null;
    // }else{
    //     return (<h2>{props.msg.data.action}</h2>);
    // }
        
    
}

function MessageAction(props){
    return (<span className="actionMessageSpan"> {props.msg.message} </span>);
}



function handleReadAt(message){
    CometChat.markMessageAsRead(message);
    console.log("inside mark MesssageRead", message );
  }
function MessageType(props) {
    if (props.msg.loggedInUser == props.msg.sid) {

        console.log("Mesage : type : " + props.msg.msgType);
        //outgoing message
        return <OutgoingMessage {...props} />;
    } else {
        //incoming message 
        return <IncomingMessage {...props} />;
    }
}


function IncomingMessage(props) {
    console.log("Mesage : type : " + props.msg.msgType);
    if(props.msgData.readAt == undefined){
        handleReadAt(props.msgData);
    }

    switch(props.msg.msgType){
        case CometChat.MESSAGE_TYPE.IMAGE : {
            let image = props.msg.data.url;

            return (
                 

                <div className="incoming_msg" onClick = {props.openImageViewer(image)}>
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <img class="color-dark-tint-font border-radius-no-bottom-left" src={props.msg.data.url} />                            
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
        } break;

        case CometChat.MESSAGE_TYPE.VIDEO : {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <video class="color-dark-tint-font border-radius-no-bottom-left" preload="auto" controls>
                                <source src={props.msg.data.url}/>
                            </video>                            
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.AUDIO: {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <audio preload="auto" controls>
                                <source src={props.msg.data.url}/>
                            </audio>   
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.FILE : {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <a href={props.msg.data.url} download={props.msg.msgId} target="_blank" >
                                <p class="color-light-tint color-dark-tint-font border-radius-no-bottom-left">
                            
                                    <div class="file_icon"  dangerouslySetInnerHTML={{ __html: icon_msg_file}}></div>
                            
                                    <div class="file_name"> 
                                        {props.msg.data.url}
                                    </div> 
                                </p>
                            </a>
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.TEXT : {
            return (
                <div className="incoming_msg">
                    <div className="incoming_msg_img">
                        <img className="img-circle" src={props.msg.avatar} alt="" style={{ width: "32px", height: "32px" }} />
                    </div>
        
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <p class="color-light-tint color-dark-tint-font border-radius-no-bottom-left">{props.msg.data.text}
                            </p>
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        </div>
                    </div>
                </div>
            );
            
        }
        break;

        default :
        return null;
        break;
    }


   
}

function OutgoingMessage(props) {
    let messageStatus=null;
    console.log("inside outgoing",props.msgData);
    // if(props.msgData.sentAt != undefined || props.msgData.deliveredAt != undefined){
    //     messageStatus = (<span mesasgeStatus="sent" className="time_date color-light-tint-font">sent</span>);
    // }
    
  
    if(props.msgData.receiverType != "group"){
        if(props.msgData.readAt != undefined){
            messageStatus = (<span mesasgeStatus="read" className="time_date color-light-tint-font" dangerouslySetInnerHTML={{__html:icon_read}}></span>);
        }else{
            if(props.msgData.deliveredAt != undefined){
                messageStatus = (<span mesasgeStatus="delivered" className="time_date color-light-tint-font" dangerouslySetInnerHTML={{__html:icon_msg_delivered}}></span>);
            }else{
                if(props.msgData.sentAt != undefined){
                    messageStatus = (<span mesasgeStatus="sent" className="time_date color-light-tint-font" dangerouslySetInnerHTML={{__html:icon_msg_delivered}}></span>);
                }
            }
        }
    }

    

    console.log("messageStatus",messageStatus);
    switch(props.msg.msgType){
        case CometChat.MESSAGE_TYPE.IMAGE : {
            return (
                <div className="outgoing_msg" onClick = {props.openImageViewer(props.msg.data.url)}>
                    <div className="sent_msg">
                        <div className="sent_withd_msg">
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                            <img class="" src={props.msg.data.url}/>
                            {messageStatus}
                        </div>
                    </div>
                </div>       
            );
        } break;

        case CometChat.MESSAGE_TYPE.VIDEO : {
            return (

            <div className="outgoing_msg">
                <div className="sent_msg">
                    <div className="sent_withd_msg">
                        <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        <video preload="auto" controls>
                            <source src={props.msg.data.url}/>
                        </video>
                        {messageStatus}
                    </div>
                </div>
            </div>   
               
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.AUDIO: {
            return (

                <div className="outgoing_msg">
                    <div className="sent_msg">
                        <div className="sent_withd_msg">
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                            <audio preload="auto" controls>
                                <source src={props.msg.data.url}/>
                            </audio>
                            {messageStatus}
                        </div>
                    </div>
                </div>                 
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.FILE : {
            return (
                <div className="outgoing_msg">
                <div className="sent_msg">
                    <div className="sent_withd_msg">
                        <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                        <a href={props.msg.data.url} download={props.msg.msgId} target="_blank">
                            <p class="color-background border-radius-no-bottom-right color-font-white">
                            
                                <div class="file_icon"  dangerouslySetInnerHTML={{ __html: icon_msg_file}}>
                                </div>
                                
                                <div class="file_name"> 
                                    {props.msg.data.url}
                                </div> 
                            </p>
                        </a>
                        {messageStatus}
                    </div>
                </div>
            </div>
            );
        }
        break;

        case CometChat.MESSAGE_TYPE.TEXT : {

           
            return (
                <div className="outgoing_msg">
                    <div className="sent_msg">
                        <div className="sent_withd_msg">
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                            <p class="color-background border-radius-no-bottom-right color-font-white">{props.msg.data.text}
                            </p>
                            {messageStatus}
                        </div>
                    </div>
                </div>
            );
        }
        break;

        default:
            return null;
        break;
    }


 
}

const mapStateToProps = (store) => {
    return {
        loggedUid: store.users.loggedInUser.uid,
        users: store.users.usersList,
        activeUser: store.message.activeMessage,
    };
};

const mapDispachToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessage);



