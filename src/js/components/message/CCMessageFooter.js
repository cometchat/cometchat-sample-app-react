import React, { Component } from "react";
import { Row, Col, Button, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import {CometChat} from "@cometchat-pro/chat";

import CameraModal from './../modal/CameraModal';
import * as utils from './../../lib/uiComponentLib';

import * as actionCreator from "./../../store/actions/cc_action";

import icon_attach from "./../../../public/img/icon_attach.svg";
import icon_send from "./../../../public/img/icon_send.svg";
import icon_attach_gallery from "./../../../public/img/icon_attach_gallery.svg";
import icon_attach_location from "./../../../public/img/icon_attach_location.svg";
import icon_attach_mic from "./../../../public/img/icon_attach_mic.svg";
import icon_attach_cam from "./../../../public/img/icon_attach_cam.svg";
import icon_attach_video from "./../../../public/img/icon_attach_video.svg";
import icon_attach_file from "./../../../public/img/icon_attach_file.svg";

class ccMessageFooter extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.state = { 
      showAttach: false, 
      isShowingCameraModal:false
    };
  }

  handleEnterPressed(e) {
    if (e.key == "Enter") {
      console.log("enter pressed here! ");
    } else {
      var content = this.ccMessageEditorBox.innerHTML;
    }
  }

  handleMessage(e) {
    this.sendTextMessage();
  }

  async sendTextMessage() {
    var content = this.ccMessageEditorBox.innerHTML;
    console.log("inside message handler : " + content);
    if (content.length > 0) {
      try {
        await this.props.sendMessage(
          content,
          this.props.activeUser,
          this.props.activeMessageType
        );
        this.ccMessageEditorBox.innerHTML = "";
      } catch (error) {
        console.log(error);
      }
    }
  }

  getFileGallery = e => {
    
    var ele = document.getElementById("ccMessageInputGallery");

    var files = ele.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.sendMediaMessage(file,CometChat.MESSAGE_TYPE.IMAGE);
     
      //   console.log(
      //     "filename : " + file.name + " : " + file.type + " : " + file.size
      //   );
    }

    this.toggleAttachMenu();

  };


  getFileVideo=e=>{
    var ele = document.getElementById("ccMessageInputFileVideo");

    var files = ele.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.sendMediaMessage(file,CometChat.MESSAGE_TYPE.VIDEO);
      
      console.log( "filename : " + JSON.stringify(file) + "\n" +file.name + " : " + file.type + " : " + file.size  );

    }

    this.toggleAttachMenu();

  }

  handleMediaMessageGallery = e => {
    document.getElementById("ccMessageInputGallery").click();
  };

  handleMediaMessageVideo = e =>{
    document.getElementById("ccMessageInputFileVideo").click();
  };

  handleAttachMenu = (e) =>{

    this.toggleAttachMenu();
  }

  toggleAttachMenu(){
    if(this.state.showAttach){
      document.getElementById("attachMenuContainer").style.opacity = "0";
      document.getElementsByClassName("attachIcon")[0].setAttribute("active", "false");
      document.getElementById("attachMenuContainer").setAttribute("active", "false");

      this.setState({
          showAttach: false
      });
    }else{
      document.getElementById("attachMenuContainer").style.opacity = "1";
      document.getElementsByClassName("attachIcon")[0].setAttribute("active", "true");
      document.getElementById("attachMenuContainer").setAttribute("active", "true");
      this.setState({
        showAttach: true
      });
    }
  }

  openModalHandler = (modalName) => {

    switch(modalName){
      case 'camera':    this.setState({isShowingCameraModal: true}); break;
    }
    
  }

  closeModalHandler = () => {
      this.setState({
          isShowingCameraModal: false
      });
  }

  recieveCaptureImage = (data) =>{
    console.log("received data ccfooter: " + data);
    //onrecieve data 

    let fileObject = utils.dataURLtoFile(data, 'a.png')
    this.closeModalHandler();
    this.toggleAttachMenu();


    this.sendMediaMessage(fileObject,CometChat.MESSAGE_TYPE.IMAGE);
  }

  //send media message
  async sendMediaMessage(content,mediaType) {
    try {
      await this.props.sendMediaMessage(
        content,
        this.props.activeUser,
        this.props.activeMessageType,
        mediaType
      );
    } catch (error) {
      console.log(error);
    }
  }

  render() {

    const cameraModal  = this.state.isShowingCameraModal ? (<CameraModal sendMessage = {this.recieveCaptureImage.bind(this)} handleClose={this.closeModalHandler.bind(this)}/>) : null;

    
    return (
      <div>
         <Row id="attachMenuContainer" class="attachMenuContainer" active="false">
          <div class="attachMenuWrapper">
            <Col lg={2} class="attachMenu" onClick={this.handleMediaMessageGallery.bind(this)}>
              <center>
              <input
                id="ccMessageInputGallery"
                multiple={true}
                name="ccMessageInputFile"
                type="file"
                accept="audio/*,video/*,image/*"
                ref={this.inputRef}
                style={ccMessageInputFile}
                onChange={this.getFileGallery.bind(this)}
              />
                <div class="attachMenuIcon color-font-theme" dangerouslySetInnerHTML={{ __html: icon_attach_gallery }}></div>
              </center>
              <div class=" attachMenuText color-font"> 
                  Gallery
              </div> 
            </Col>

            <Col lg={2} class="attachMenu" onClick={this.openModalHandler.bind(this,'camera')}>
              <center>
                <div class="attachMenuIcon color-font-theme" dangerouslySetInnerHTML={{ __html: icon_attach_cam }}></div>
              </center>

              <div class=" attachMenuText color-font"> 
                  Camera
              </div> 
            </Col>

            <Col lg={2} class="attachMenu" onClick={this.handleMediaMessageVideo.bind(this)} >
              <center>
              <input
                id="ccMessageInputFileVideo"
                multiple={true}
                name="ccMessageInputFile"
                type="file"
                accept="video/x-ms-wmv,video/x-msvideo,video/quicktime,video/MP2T,application/x-mpegURL,video/3gpp,video/mp4,video/x-m4v"
                ref={this.inputRef}
                onChange={this.getFileVideo.bind(this)}
                style={ccMessageInputFile}
                />
                <div class="attachMenuIcon color-font-theme" dangerouslySetInnerHTML={{ __html: icon_attach_video }}></div>
              </center>

              <div class=" attachMenuText color-font"> 
                  Video
              </div> 
            </Col>

            <Col lg={2} class="attachMenu">
              <center>
              <input
                id="ccMessageInputAudio"
                multiple={true}
                name="ccMessageInputFile"
                type="file"
                accept="audio/*"
                ref={this.inputRef}
                style={ccMessageInputFile}
                />
                <div class="attachMenuIcon color-font-theme" dangerouslySetInnerHTML={{ __html: icon_attach_mic }}></div>
              </center>

              <div class=" attachMenuText color-font"> 
                  Audio
              </div> 
            </Col>

            <Col lg={2} class="attachMenu">
              <center>
                <div class="attachMenuIcon color-font-theme" dangerouslySetInnerHTML={{ __html: icon_attach_file }}></div>
              </center>

              <div class=" attachMenuText color-font"> 
                  Files
              </div> 
            </Col>

            <Col lg={2} class="attachMenu">
              <center>
                <div class="attachMenuIcon color-font-theme" dangerouslySetInnerHTML={{ __html: icon_attach_location }}></div>
              </center>

              <div class=" attachMenuText color-font"> 
                  Location
              </div> 
            </Col>
          </div>     
          
        </Row>
        <Row style={ccMessageFooterStyle}>
          <Col lg={2} className="cc-no-padding h-100 align-center">
            <div className="ccMessageFooterMenu" onClick={this.handleAttachMenu.bind(this)} >
             
              <span
                className="attachIcon color-font-theme"
                active="false"                
                dangerouslySetInnerHTML={{ __html: icon_attach }}
              />
            </div>
          </Col>
          <Col lg={8} className="h-100 cc-no-padding ">
            <div
              className="ccMessageEditorBox border border-radius-full color-border-grey"
              contentEditable="true"
              data-placeholder="Type a message..."
              ref={div => {
                this.ccMessageEditorBox = div;
              }}
              onKeyUp={this.handleEnterPressed.bind(this)}
            />
          </Col>
          <Col lg={2} className="cc-no-padding h-100 align-center" >
            <div className="ccMessageFooterMenu">
              <span className="cc-icon sendButton " onClick={this.handleMessage.bind(this)} dangerouslySetInnerHTML={{__html:icon_send}}/>
            </div>
          </Col>
        </Row>

        {cameraModal}

      </div>
    );
  }
}

var ccMessageFooterStyle = {
  position: "absolute",
  minHeight: "65px",
  maxHeight: "200px",
  backgroundColor: "#FFFFFF",
  bottom: "0px",
  width: "100%"
};

var ccMessageInputFile = {
  fontsize: "1px",
  width: "0px",
  height: "0px",
  opacity: "0",
  filter: "alpha(opacity=0)",
  position: "relative",
  top: "-40",
  left: "-20"
};

const mapStateToProps = store => {
  return {
    activeUser: store.message.activeMessage.id,
    activeMessageType: store.message.activeMessage.type
  };
};

const mapDispachToProps = dispatch => {
  return {
    sendMessage: (content, uid, msgType) =>         dispatch(actionCreator.sendTextMessage(uid, content, msgType)),
    sendMediaMessage: (content, uid, msgType,mediaType) =>    dispatch(actionCreator.sendMediaMessage(uid, content, msgType,mediaType)),
    
  };
};

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ccMessageFooter);
