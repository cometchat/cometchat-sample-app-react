import React from "react";
import Modal from './Modal';

import MediaManager from "./../../lib/AVRecorder/MediaManager";

import icon_back from "./../../../public/img/icon_back.svg";

export default class CameraModal extends React.PureComponent {

    constructor(props) {
        super(props);    
    }

    componentDidMount(){   }

    
    render(){

        return ( 
            <Modal>
              <div className="modal">
                <div className="imageModalHeader">
                    <div className="imageViewerModalBackIcon" 
                        onClick = {this.props.handleClose}
                        dangerouslySetInnerHTML={{ __html: icon_back }} >

                    </div>
                </div>

                <div class="imageViewerModalContent">
                    <img id="imageViewer" height="100%" src={this.props.image_src}/>
                </div>
            
                  
              </div>                 
            </Modal>
       );
       
    }
    

}
