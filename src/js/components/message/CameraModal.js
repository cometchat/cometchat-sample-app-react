import React from "react";
import Modal from './../Modal';


export default class CameraModal extends React.PureComponent {

    constructor(props) {
        super(props);
        
    }
    

    render(){

       return ( <Modal>
        <div styleName="wrapper">
          <div styleName="inner">
            <button onClick={this.props.handleClose} styleName="close">
              <div>close</div>
            </button>
            {this.props.children}
          </div>
        </div>
      </Modal>
       );
       
    }
    

}