import React, { Component } from "react";
import { Row, Col, OverlayTrigger, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CCMessage from './CCMessage';
import { connect } from 'react-redux';
import { calculateAvailableHeight, CheckEmpty } from './../../lib/uiComponentLib';
import * as actionCreator from './../../store/actions/cc_action';


var heightCCMessageBox = calculateAvailableHeight(79, 65, "ccMessage");

var ccMessageBoxStyle = {

    height: heightCCMessageBox,
    overflow: "auto",

};

var ccNewMessageNotifierStyle =  {
    top: (heightCCMessageBox-10),
}



class CCMessageBox extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            displayStatusNewMessage : false,
        }

        this.refsMessageBox = React.createRef();
    }

    componentWillMount(){
        this.fetchfirstTimeMessage(this.props.activeUser.type, this.props.activeUser.id);
    }


    fetchfirstTimeMessage(userType,userid){
        
        var messageUser = this.props.messageList.findIndex((e) => e.muid == userid);
    
        console.log("component did mount in messagebox : " , {messageUser});
      if (messageUser == -1) {
          try{
            console.log("inside fetch Message : " + userid);
            this.props.getMessage(userType,userid,50);
            
          }catch(error){
            console.log(error);
          };   
        }
        
      }

    shouldComponentUpdate(nextProps,nextState){

        console.log("next props messagebox : " + JSON.stringify(nextProps) );

        if(nextProps.activeUser != this.props.activeUser){
            this.fetchfirstTimeMessage(nextProps.activeUser.type,nextProps.activeUser.id);

            //this.showUnReadButton();
            
        }
        return true;
    }

    componentDidUpdate(){
        console.log("inside component did update");
        this.scrollToBottom();

    }


    showUnReadButton =() => {
        this.setState({displayStatusNewMessage:true});
        
    }

    hideUnReadButton = () =>{
        this.setState({displayStatusNewMessage:false});
    }

    scrollToBottom() {
        var node = document.getElementById("ccMessageBox");
        //node.scrollTop = node.scrollHeight;
        const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        if (bottom) {      
          
            console.log("reached bottom");
            // this.hideUnReadButton();

          }else{
            console.log("reached not bottom");
            node.scrollTop  = node.scrollHeight ;
            //this.showUnReadButton();
          } 
      }




    render() {

        var displayStatus = this.state.displayStatusNewMessage;

        let classVar = ['messageBoxNewMessageNotification'];

        if (displayStatus) {
            classVar.push('displayBlock');
        }else{
            classVar.push('hideBlock');
        }
        
        
        //console.log("inside messagebox : ",JSON.stringify(this.props.messageList));

        var messageUser = this.props.messageList.find((e) => {

            if (e.muid == this.props.activeUser.id) {
                return e;
            }
        });
        
        //console.log("inside messagebox messageUser: ",{messageUser} );

        if (!CheckEmpty(messageUser)) {
            return (
                <div id="ccMessageBoxContainer" key="15646896846sadasd" >
                
                    <Row ref={this.refsMessageBox} key="ccmessagebox_b" id="ccMessageBox" className="ccMessageBox" style={ccMessageBoxStyle}>
                    
                    </Row>
                </div>
            );
        } else {

            return (
                <div id="ccMessageBoxContainer" key="15646896846" >
                                     
                        <div ref={this.refsMessageBox} key="ccmessagebox_d"  id="ccMessageBox" className="ccMessageBox row" style={ccMessageBoxStyle}>
                       
                            {
                                messageUser.message.map((msg, index) => {
                                
                                
                                if(index == messageUser.length-1){
                                    console.log("checking ccm index : " + index);        
                                    this.scrollToBottom();
                               }
                                return    (
                                    <CCMessage key={msg.id} msgData={msg} />
                                )

                                    
                                
                                
                            
                                })
                            }

                            

                        </div>
                        
                    
                    <Row key="ccunreadMessage" class={classVar.join(' ')} style={ccNewMessageNotifierStyle} onClick = {this.scrollToBottom.bind(this)}>
                            <span>Recent message ▼</span>
                    </Row>

                </div>
                
                


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
        getMessage: (uType,uid,limit) => dispatch(actionCreator.getUserMessageHistory(uType,uid,limit))
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCMessageBox);

