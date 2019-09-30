import React from "react";
import Modal from './Modal';
import MediaManager from "./../../lib/AVRecorder/MediaManager";
import icon_back from "./../../../public/img/icon_back.svg";

export default class CameraModal extends React.PureComponent {

    static videoDom = null; 
    static imageDom = null;
    static mediaManager = "";

    constructor(props) {
        super(props);
        this.state = {
            imageUrl:""
        };
    }

    componentWillUnmount(){
        MediaManager.stopPlaying();
    }

    componentDidMount(){
        CameraModal.videoDom = document.getElementById("vCameraCapture");
        CameraModal.imageDom = document.getElementById('iCameraImage');
        MediaManager.initCamera(CameraModal.videoDom);
    }

    captureImage(){
        let imageData = MediaManager.captureImage();
        this.setState({imageUrl: imageData});
        CameraModal.imageDom.style.display = "block";
        CameraModal.videoDom.style.display = "none";
        document.getElementById("btnCaptureImage").style.display="none";
        document.getElementById("btnCapturedImageSend").style.display="block";
        CameraModal.imageDom.src = imageData;
    }

    sendMessageCapturedImage=()=>{
        this.props.sendMessage(this.state.imageUrl);
    }
    
    render(){
        return ( 
            <Modal>
                <div className="modal">
                    <div className="cameraCaptureModalHeader">
                        <div className="cameraModalBackIcon" onClick = {this.props.handleClose} dangerouslySetInnerHTML={{ __html: icon_back }} ></div>
                    </div>
                    <div class="cameraCaptureModalContent">
                        <video id="vCameraCapture" autoPlay height="100%" width="100%"></video>
                        <img id="iCameraImage" height="100%"/>
                    </div>
                    <div className = "cameraCaptureModalFooter">
                        <div id="btnCaptureImage" className="cameraCaptureButton" onClick={this.captureImage.bind(this)}>
                            <div></div>
                        </div>
                        <div id= "btnCapturedImageSend" className="btn cameraSendButton" onClick={this.sendMessageCapturedImage.bind(this)} style={{ display: "none" }} >
                            Share
                        </div>
                    </div>
                </div>                 
            </Modal>
        );
    }

}
