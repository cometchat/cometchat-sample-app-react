import React, { Component } from "react";
import { Row, Col, OverlayTrigger, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CCMessage from './CCMessage';
import { connect } from 'react-redux';
import { calculateAvailableHeight, CheckEmpty } from './../../lib/uiComponentLib';


var heightCCMessageBox = calculateAvailableHeight(74, 65, "ccMessage");

var ccMessageBoxStyle = {

    height: heightCCMessageBox,
    overflow: "auto",

};

class CCMessageBox extends Component {
    constructor(props){
        super(props);


    }

    shouldComponentUpdate(nextProps,nextState){
        console.log("next props : " + JSON.stringify(nextProps) );
        return true;
    }

    render() {

        console.log("inside messagebox : " + JSON.stringify(this.props.messageList));
        var messageUser = this.props.messageList.find(e => {

            if (e.muid == this.props.activeUser.id) {
                return e;
            }
        });

      

        if (!CheckEmpty(messageUser)) {
            return (
                <Row ref={(div) => { this.MessageBox = div }} id="ccMessageBox" className="ccMessageBox" style={ccMessageBoxStyle}>
                </Row>
            );
        } else {

            return (
                <Row ref={(div) => { this.MessageBox = div }} className="ccMessageBox" style={ccMessageBoxStyle} >
                    {
                        messageUser.message.map((msg, index) => (
                            <CCMessage key={index} msgData={msg} />
                        ))


                    }
                </Row>

            );
        }
    }
}





const mapStateToProps = store => {
    return {
        messageList: store.message.messages,
        loggedUid: store.users.loggedInUser.uid,
        activeUser: store.message.activeMessage,
    };
};

const mapDispachToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessageBox);

