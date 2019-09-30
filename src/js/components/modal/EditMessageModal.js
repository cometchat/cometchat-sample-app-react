import React from "react";
import Modal from './Modal';

export default class EditMessageModal extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    
    render(){ 
        return ( 
            <Modal>
                <div className="groupCreateModal border-radius-top h-100pr">
                    <div class="createGroupModalContent"></div>
                </div>
            </Modal>
        );
    }
    
}
