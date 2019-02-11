import React, { PureComponent } from 'react';
import Modal from './../modal/Modal';
import { connect } from 'react-redux'

import * as actionCreator from "./../../store/actions/cc_action";

class CCCall extends PureComponent{
    
    constructor(props){
        super(props);
    }

    componentDidMount(){
        var callDom = document.getElementById('callInterface');
        this.props.startCall(this.props.callData,callDom);
    }
    render(){
        return (

            <Modal>
              <div id="callInterface" class="modal">

              </div>
            </Modal>
        );    
    }
}



const mapStateToProps = (store) => {
    return {
       
    };
};

const mapDispachToProps = dispatch => {
    return {
        startCall: (call,callDom) => dispatch(actionCreator.startCall(call,callDom)),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCCall);