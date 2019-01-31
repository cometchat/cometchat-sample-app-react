import React from "react";
import Modal from './Modal';

import MediaManager from "./../../lib/AVRecorder/MediaManager";

import icon_back from "./../../../public/img/icon_back.svg";

export default class CameraModal extends React.PureComponent {

  static mediaManager = "";
    constructor(props) {
        super(props);
        
    }


    componentDidMount(){
      
    }
    

    render(){

       return ( 
            <Modal>
              <div className="modal">
                <div className="cameraCaptureModalHeader">
                    <span></span>
                </div>
                  <button onClick={this.props.handleClose}>Close</button>

                  <video id="vCameraCapture" autoPlay height="100%" width="100%"></video> 
              </div>                 
            </Modal>
       );
       
    }
    

}


/**<div class="modal">


        <div class="cameraCaptureModalHeader" style="
            width: 100%;
            height: 58px;
            position: fixed;
            z-index: 9;
            padding: 0PX;
            padding-top: 16px;
            top: 0;
            padding-left: 16px;
            border-bottom: 0px;
        ">
            <div style="
                height: 32px;
                width: 32px;
                color: #ffffff;">

                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" version="1.1">
                   
                  <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1">
                    <g id="g3348" fill="currentColor" transform="scale(1.3333333,1.3333333)">
                      <path id="path3338" d="M 0,0 24,0 24,24 0,24 Z" inkscape:connector-curvature="0" style="fill:none"></path>
                      <path id="path3340" d="M 20,11 7.83,11 13.42,5.41 12,4 4,12 12,20 13.41,18.59 7.83,13 20,13 20,11 Z" inkscape:connector-curvature="0"></path>
                    </g>
                  </g>
                </svg>
            </div>
        </div>
        
        <div class="modal-content" style="
            height: 100%;
            width: 100%;
            align-items: center;
            display: block;
            justify-content: center;">
      
      
      <video id="vCameraCapture" autoplay="" height="100%" width="100%" style="
    background: #000;
"></video></div>
      <div class="" style="
    position: absolute;
    bottom: 0;
    display: flex;
    text-align: center;
    margin-bottom:  32px;
">
         

<div class="" data-dismiss="modal" style="
    border-radius: 50%;
    background: #000;
    height: 54px;
    width: 54px;
    border: 4px solid #fff;
    align-items: center;
    align-content: center;
    justify-content: center;
    display: flex;
    cursor: pointer;
    "><div style="
    border-radius: 50%;
    background: #fff;
    height: 42px;
    width: 42px;
    border: 2px solid #000;
    text-align: center;
    align-items: center;
    justify-content: center;
    align-content: center;
"></div></div>
      </div>
    </div> */ 