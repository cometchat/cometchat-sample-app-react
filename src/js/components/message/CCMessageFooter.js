import React, { Component } from 'react'
import {Row,Col,Button,Tooltip} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux'
import * as actionCreator from './../../store/actions/cc_action';



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

                await this.props.sendMessage(content,this.props.activeUser);      
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
                 <Col lg={2} className="cc-no-padding h-100" style = {{ textAlign: 'right'}}>
                    <div className = "ccMessageFooterMenu">
                        <span  className = "cc-icon " onClick={this.handleMessage.bind(this)} >
                            <FontAwesomeIcon icon="paper-plane" />
                        </span>                       
                    </div>
                </Col>
                <Col lg={8} className="h-100 cc-no-padding">
                    <div className="ccMessageEditorBox" contentEditable="true"  data-placeholder="Type a message..." 
                       ref={(div)=>{this.ccMessageEditorBox = div}} onKeyUp = {this.handleEnterPressed.bind(this)}>
                    </div>
                </Col>
                <Col lg={2} className="cc-no-padding h-100" style = {{ textAlign: 'right'}}>
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
    minHeight: "50px",
    maxHeight:"200px",
    backgroundColor: "#FFFFFF",
    position:"absolute",
    borderTop:"1px solid #ccc",
    bottom:"0px",
    width: "100%",
    
};
  

const mapStateToProps = (store) =>{
    return {
        activeUser: store.users.activeUsers.uid,
    };
};
  
const mapDispachToProps = dispatch => {
    return {
         sendMessage : (content,uid)=>dispatch(actionCreator.sendTextMessage(uid, content))
    };
};

export default connect( mapStateToProps, mapDispachToProps )(ccMessageFooter);


