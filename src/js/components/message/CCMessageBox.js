import React,{Component} from "react";
import {Row,Col,OverlayTrigger,Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CCMessage from './CCMessage';
import {connect} from 'react-redux';
import {calculateAvailableHeight, CheckEmpty} from './../../lib/uiComponentLib';


var heightCCMessageBox = calculateAvailableHeight(74,65,"ccMessage");

var ccMessageBoxStyle = {
    
    height : heightCCMessageBox,
    overflow:"auto",

};

class CCMessageBox extends Component{

    constructor(props){
        super(props);

    }


    // componentWillUnmount(){
    //     unsetOberserver();
    // }

    render(){
        //this.addMessageBoxEvent();
        let messageUser = this.props.messageList.find(e => {
                
            if(e.muid == this.props.activeUser.uid){
                return e;
            }
        });

        //setEvent();

        if(!CheckEmpty(messageUser)){
            return (
                <Row  ref={(div)=>{this.MessageBox = div}} id="ccMessageBox" className = "ccMessageBox" style={ccMessageBoxStyle}></Row>
            );
        }else{
           
            return (
                <Row  ref={(div)=>{this.MessageBox = div}} className = "ccMessageBox" style={ccMessageBoxStyle}>
                        {   
                            messageUser.message.map((msg,index)=>(
                                <CCMessage  key={index} msgData = {msg} />
                            ))

                            
                        }       
                </Row>
                
            );
        }    
    }
}

function unsetOberserver(){    
 //Later, you can stop observing
 observer.disconnect();

}

function setObserver(){
    // Select the node that will be observed for mutations
    var targetNode = document.getElementById('ccMessageBox');

    // Options for the observer (which mutations to observe)
    var config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                console.log('A child node has been added or removed.');
            }
            else if (mutation.type == 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

}



const mapStateToProps = (store) =>{
    return {
      messageList : store.message.messages,
      user: store.users,
      loggedUid : store.users.loggedInUser.uid,
      activeUser : store.users.activeUsers,
    };
};
  
const mapDispachToProps = dispatch => {
    return {
        
    };
};

export default connect( mapStateToProps, mapDispachToProps )(CCMessageBox);
