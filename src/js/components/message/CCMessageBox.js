import React, { Component } from "react";
import { Row, Col, OverlayTrigger, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CCMessage from './CCMessage';
import { connect } from 'react-redux';
import { calculateAvailableHeight, CheckEmpty } from './../../lib/uiComponentLib';
import * as actionCreator from './../../store/actions/cc_action';

var heightCCMessageBox = calculateAvailableHeight(74, 65, "ccMessage");

var ccMessageBoxStyle = {

    height: heightCCMessageBox,
    overflow: "auto",

};



class CCMessageBox extends Component {
    constructor(props){
        super(props);
    }

    componentWillMount(){
        this.fetchfirstTimeMessage(this.props.activeUser.id);
    }


    fetchfirstTimeMessage(userid){
        
        var messageUser = this.props.messageList.findIndex((e) => e.muid == userid);
    
        console.log("component did mount in messagebox : " , {messageUser})
    
        if (messageUser == -1) {
          try{
            console.log("inside fetch Message : " + userid);
            this.props.getMessage(userid,50);
            
          }catch(error){
            console.log(error);
          };   
        }
        
      }

      shouldComponentUpdate(nextProps,nextState){

        console.log("next props messagebox : " + JSON.stringify(nextProps) );

        if(nextProps.activeUser != this.props.activeUser){
            this.fetchfirstTimeMessage(nextProps.activeUser.id);
        }

        return true;
    }

    render() {
        
        
        console.log("inside messagebox : ",JSON.stringify(this.props.messageList));

        var messageUser = this.props.messageList.find((e) => {

            if (e.muid == this.props.activeUser.id) {
                return e;
            }
        });
        
        console.log("inside messagebox messageUser: ",{messageUser} );

      

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
        getMessage: (uid,limit) => dispatch(actionCreator.getUserMessageHistory(uid,limit))
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessageBox);

