import React, { Component } from 'react'
import {Row,Col,Button,Tooltip} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux'
import * as actionCreator from './../../store/actions/cc_action';

import SVGInline  from "react-svg-inline";
import icon_attach from './../../../public/img/icon_attach.svg'

class ccMessageFooter extends Component{

    constructor(props) {
        super(props);
        this.state = { showButton: "true" };
    }
    
    handleEnterPressed(e){
        
        if(e.key == 'Enter'){
            console.log('enter pressed here! ');
        }else{
            var content = this.ccMessageEditorBox.innerHTML;

            if(content.length > 0){
                this.setState({
                    showButton : "false"
                })
            }else{
                this.setState({
                    showButton : "true"
                });    
            }

        }
    }

    handleMessage(e){

        
        this.sendTextMessage();        
    }

    async sendTextMessage(){
         var content = this.ccMessageEditorBox.innerHTML;
         console.log("inside message handler : " + content );
         if(content.length > 0 ){
            try{

                await this.props.sendMessage(content,this.props.activeUser,this.props.activeMessageType);      
                this.ccMessageEditorBox.innerHTML = "";
                this.setState({
                    showButton : "true"
                })
            }catch(error){
                console.log(error);
            }
        

        }
        
        
        
    }

    sendMediaMessage=(e)=>{
        
    }

    render(){
        return(
            
            <Row style={ccMessageFooterStyle}>
                 <Col lg={2} className="cc-no-padding h-100" >
                    <div className = "ccMessageFooterMenu">
                        <span  className = "cc-icon color-font-theme " onClick={this.handleMessage.bind(this)} dangerouslySetInnerHTML={{__html: icon_attach}}/>
                                             
                    </div>
                </Col>
                <Col lg={8} className="h-100 cc-no-padding">
                    <div className="ccMessageEditorBox border border-radius-full color-border-grey" contentEditable="true"  data-placeholder="Type a message..." 
                       ref={(div)=>{this.ccMessageEditorBox = div}} onKeyUp = {this.handleEnterPressed.bind(this)}>
                    </div>
                </Col>
                <Col lg={2} className="cc-no-padding h-100" >
                    <div className = "ccMessageFooterMenu">
                        
                        <span  className = "cc-icon " onClick={this.handleMessage.bind(this)} >
                            <FontAwesomeIcon icon="paper-plane" />
                        </span>
                       
                    </div>
                </Col>
            </Row>
        );
    }

};

var ccMessageFooterStyle = {
    position: "absolute",
    minHeight: "65px",
    maxHeight:"200px",
    backgroundColor: "#FFFFFF",
    bottom:"0px",
    width: "100%",
    
};
  

const mapStateToProps = (store) =>{
    return {
        activeUser: store.message.activeMessage.id,
        activeMessageType : store.message.activeMessage.type,

    };
};
  
const mapDispachToProps = dispatch => {
    return {
         sendMessage : (content,uid,msgType)=>dispatch(actionCreator.sendTextMessage(uid, content,msgType))
    };
};

export default connect( mapStateToProps, mapDispachToProps )(ccMessageFooter);


