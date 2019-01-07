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

    constructor(props) {
        super(props);

    }

    // componentWillMount(){
    //     window.addEventListener('resize', this.scrollDownMessageBox);
    // }

    // componentWillUnmount(){
    //     window.removeEventListener('resize', this.scrollDownMessageBox);
    // }

    // scrollDownMessageBox(e) {
    //     console.log("inside scroll down message event");
    //     //Later, you can stop observing
    //     var objDiv = document.getElementById("ccMessageBox");
    //     objDiv.scrollTop = objDiv.scrollHeight;
    // onChange={this.scrollDownMessageBox.bind(this)}

    // }


    render() {

        let messageUser = this.props.messageList.find(e => {

            if (e.muid == this.props.activeUser.id) {
                return e;
            }
        });

        console.log("inside messagebox : " + JSON.stringify(messageUser));

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





const mapStateToProps = (store) => {
    return {
        messageList: store.message.messages,
        user: store.users,
        loggedUid: store.users.loggedInUser.uid,
        activeUser: store.message.activeMessage,
    };
};

const mapDispachToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessageBox);


window.onload = function () {
    var objDiv = document.getElementById("ccMessageBox");
    if (objDiv != null) {
        objDiv.scrollTop = objDiv.scrollHeight;
    }

}