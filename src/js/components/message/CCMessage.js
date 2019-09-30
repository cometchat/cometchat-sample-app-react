import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import * as util from './../../lib/uiComponentLib';
import * as utils from './../../lib/uiComponentLib';
import * as actionCreator from './../../store/actions/cc_action';
var Userthumbnail = require('./../../../public/img/user.png');
import { CometChat} from "@cometchat-pro/chat";
import ImageViewerModal from './../modal/ImageViewerModal';
import EditMessageModal from './../modal/EditMessageModal';
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
        this.overlayMessageOptionRef = React.createRef();
    }

    openModalHandler = (image) => {
        this.setState({showModal: true,imageUrl:image,showModalEdit:false});
    }

    openEditModalHandler = () => {
        this.setState({showModal: false,imageUrl:"",showModalEdit:true});                
    }

    closeModalHandler = () => {
        this.setState({showModal: false,showModalEdit:false,image:""});
    }

    deleteMessage(id){
        this.props.deleteMessageHandle(id);
        this.overlayMessageOptionRef.current.hide();
    }

    editMessage (data){
        var event = new CustomEvent("editMessage", {detail:{message: data}});
        document.dispatchEvent(event); 
        this.overlayMessageOptionRef.current.hide();
    }

    render() {
        if(this.props.msgData.hasOwnProperty('deletedAt')){
            return null;
        }
        const clickEvents = {
            edit:()=>this.editMessage.bind(this,this.props.msgData),
            delete:(id)=>this.deleteMessage.bind(this,id)
        };
        var msg = {
            msgId : this.props.msgData.id,
            data: this.props.msgData.data,
            sid : this.props.msgData.sender.uid,
            loggedInUser: this.props.loggedUid,
            sendAt: this.props.msgData.sentAt,
            msgType : this.props.msgData.type,
        }
        msg.username = this.props.msgData.sender.name;
        msg.avatar = utils.CheckEmpty(this.props.msgData.sender.avatar) ? this.props.msgData.sender.avatar : Userthumbnail;
        const imageViewerModal  = this.state.showModal ? (<ImageViewerModal image_src={this.state.imageUrl} handleClose={this.closeModalHandler.bind(this)}/>) : null;
        const editMessageModal = this.state.showModalEdit ? (<EditMessageModal message={this.props.msgData} handleClose = {this.closeModalHandler.bind(this)} />):null;
        switch(this.props.msgData.category){
            case CometChat.CATEGORY_CALL: 
                return (
                    <MessageCall msg={msg} openImageViewer={(image)=>this.openModalHandler.bind(this,image)}/>
                );
            break;

            case CometChat.CATEGORY_MESSAGE:
                return (
                    <div key={msg.msgId}>
                        <MessageType overlay={this.overlayMessageOptionRef} msg={msg} event={clickEvents} msgData={this.props.msgData} openImageViewer={(image)=>this.openModalHandler.bind(this,image)}/>
                        {imageViewerModal}
                        {editMessageModal}
                    </div>
                );        
            break;
            
            case CometChat.CATEGORY_ACTION :
                return null;
            break;
        }
    }
}


function MessageCall(props){
    return null;
}

function MessageType(props) {
    if (props.msg.loggedInUser == props.msg.sid) {
        return <OutgoingMessage {...props} />;
    } else {
        return <IncomingMessage {...props} />;
    }
}


function IncomingMessage(props) {
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
            var eventData = {
                msgId: props.msg.msgId,
                event: props.event,
            };
            return (
                <div className="outgoing_msg">
                    <div className="sent_msg">
                        <div className="sent_withd_msg">
                            <span className="time_date color-light-tint-font">{util.convertStringToDate(props.msg.sendAt)}</span>
                            <OverlayTrigger ref={props.overlay} trigger={['click', 'scroll','focus']}  rootCloseEvent="focus" rootClose placement="right" overlay={popoverClickRootClose(eventData)} >
                                <p class="color-background border-radius-no-bottom-right color-font-white">{props.msg.data.text}</p>
                            </OverlayTrigger>
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


const popoverClickRootClose = (eventData)=> {
    return (
       <Popover id="popover-trigger-click-root-close" >
           <div>
               <span className="messageHeaderMenuItem" onClick={eventData.event.edit()} >
                    Edit
               </span> 
               <span className="messageHeaderMenuItem" onClick={eventData.event.delete(eventData.msgId)}>
                   Delete
               </span> 
           </div>
       </Popover>
    ) ;  
   };

const mapStateToProps = (store) => {
    return {
        loggedUid: store.users.loggedInUser.uid,
        users: store.users.usersList,
        activeUser: store.message.activeMessage,
    };
};

const mapDispachToProps = dispatch => {
    return {
        deleteMessageHandle : (messageId) => dispatch(actionCreator.handleDeleteMessage(messageId)),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessage);                   