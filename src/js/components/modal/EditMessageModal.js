import React from "react";
import Modal from './Modal';

import MediaManager from "./../../lib/AVRecorder/MediaManager";

import icon_back from "./../../../public/img/icon_back.svg";

export default class EditMessageModal extends React.PureComponent {

    constructor(props) {
        super(props);
        
        console.log("edit message : " , props);
    }

    componentDidMount(){   }

    
    render(){ 

        return ( 
            <Modal>
                 <div className="groupCreateModal border-radius-top h-100pr">
                    {/* <div className="imageModalHeader">
                        <div className="imageViewerModalBackIcon" 
                            onClick = {this.props.handleClose}
                            dangerouslySetInnerHTML={{ __html: icon_back }} >

                        </div>
                    </div> */}

                    <div class="createGroupModalContent">
                       
                    </div>
                </div>
              
                  
              
            </Modal>
       );
       
    }
    

}
