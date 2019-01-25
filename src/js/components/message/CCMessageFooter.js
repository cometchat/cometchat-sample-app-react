import React, { Component } from "react";
import { Row, Col, Button, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import * as actionCreator from "./../../store/actions/cc_action";

import SVGInline from "react-svg-inline";
import icon_attach from "./../../../public/img/icon_attach.svg";
import icon_send from "./../../../public/img/icon_send.svg";
import icon_attach_gallery from "./../../../public/img/icon_attach_gallery.svg";

class ccMessageFooter extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.state = { showButton: "true" };
  }

  handleEnterPressed(e) {
    if (e.key == "Enter") {
      console.log("enter pressed here! ");
    } else {
      var content = this.ccMessageEditorBox.innerHTML;

      if (content.length > 0) {
        this.setState({
          showButton: "false"
        });
      } else {
        this.setState({
          showButton: "true"
        });
      }
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
        this.setState({
          showButton: "true"
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  getFileData = e => {
    var ele = document.getElementById("ccMessageInputFile");

    var files = ele.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      this.sendMediaMessage(file);
      //   console.log(
      //     "filename : " + file.name + " : " + file.type + " : " + file.size
      //   );
    }
  };

  handleMediaMessage = e => {
    console.log("inside handle message Media");
    document.getElementById("ccMessageInputFile").click();
  };

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
        <Row style={ccMessageFooterStyle}>
          <Col lg={12}>
              <div class="attachMenu">
                  <span className = "cc-icon color-font-theme" 
                  dangerouslySetInnerHTML={{ __html: icon_attach_gallery }}
                  ></span>
                  <span> Gallery</span>
              </div>
          </Col>
        </Row>

        <Row style={ccMessageFooterStyle}>
          <Col lg={2} className="cc-no-padding h-100 align-center">
            <div className="ccMessageFooterMenu">
              <input
                id="ccMessageInputFile"
                multiple={true}
                name="ccMessageInputFile"
                type="file"
                accept="image/*"
                ref={this.inputRef}
                style={ccMessageInputFile}
                onChange={this.getFileData.bind(this)}
              />
              <span
                className="cc-icon color-font-theme"
                onClick={this.handleMediaMessage.bind(this)}
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
  width: "1px",
  height: "1px",
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
