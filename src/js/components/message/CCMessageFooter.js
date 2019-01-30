import React, { Component } from "react";
import { Row, Col, Button, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";

import cameraModel from "CameraModal";

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

    this.state = { showAttach: false };
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
        // this.setState({
        //   showButton: "true"
        // });
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

      this.sendMediaMessage(file);

      this.toggleAttachMenu();
      //   console.log(
      //     "filename : " + file.name + " : " + file.type + " : " + file.size
      //   );
    }

  };

  handleMediaMessageGallery = e => {
    document.getElementById("ccMessageInputGallery").click();
  };

  handleMediaMessageCamera = e => {
    //showCamera();
  };

  handleAttachMenu = (e) =>{

    this.toggleAttachMenu();
  }

  toggleAttachMenu(){
    if(this.state.showAttach){

      console.log("hide attachmenu");
      document.getElementById("attachMenuContainer").style.opacity = "0";
      document.getElementsByClassName("attachIcon")[0].setAttribute("active", "false");

        this.setState({
          showAttach: false
        });
    }else{
      console.log("show attachmenu");
      document.getElementById("attachMenuContainer").style.opacity = "1";
      document.getElementsByClassName("attachIcon")[0].setAttribute("active", "true");
      this.setState({
        showAttach: true
      });
    }
  }





  async sendMediaMessage(content) {
    try {
      await this.props.sendMediaMessage(
        content,
        this.props.activeUser,
        this.props.activeMessageType
      );
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div>
         <Row id="attachMenuContainer" class="attachMenuContainer">
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

            <Col lg={2} class="attachMenu">
              <center>
              <input
                id="ccMessageInputCamera"
                multiple={true}
                name="ccMessageInputFile"
                type="file"
                accept="audio/*,video/*,image/*"
                ref={this.inputRef}
                style={ccMessageInputFile}
                />
                <div class="attachMenuIcon color-font-theme" dangerouslySetInnerHTML={{ __html: icon_attach_cam }}></div>
              </center>

              <div class=" attachMenuText color-font"> 
                  Camera
              </div> 
            </Col>

            <Col lg={2} class="attachMenu">
              <center>
              <input
                id="ccMessageInputFileVideo"
                multiple={true}
                name="ccMessageInputFile"
                type="file"
                accept="video/*"
                ref={this.inputRef}
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
    sendMessage: (content, uid, msgType) =>
      dispatch(actionCreator.sendTextMessage(uid, content, msgType)),
    sendMediaMessage: (content, uid, msgType) =>
      dispatch(actionCreator.sendMediaMessage(uid, content, msgType))
  };
};

export default connect(
  mapStateToProps,
  mapDispachToProps
)(ccMessageFooter);
