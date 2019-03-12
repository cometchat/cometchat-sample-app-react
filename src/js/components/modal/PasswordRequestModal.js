import React from "react";
import Modal from './Modal';

import { Row, Col, Button, FormGroup, FormControl, ControlLabel,InputGroup } from "react-bootstrap";

import { connect } from 'react-redux';
import icon_back from "./../../../public/img/icon_back.svg";

import * as actionCreator from './../../store/actions/cc_action';
import CCManager from './../../lib/cometchat/ccManager';


class PasswordRequestModal extends React.PureComponent {

    constructor(props) {
        super(props);    
        this.state = {
            password:"",
            showError:false,
        }
    }

    handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value,
          showError:false
        });
      }

    validateForm() {
        return this.state.password.length > 0  ;
      }

    componentDidMount(){   }

    handlePassword  = () =>{
        actionCreator.joinPasswordGroup(this.props.group,this.state.password).then(
            groupData =>{
                  console.log("Joined Password Group", groupData); 
                  this.props.joinGroup();
                  this.props.close();

                  
            },error=>{
                //console.log("Group joining failed with exception:", error); 
                this.setState({showError:true});
            }
        );
    }

    render(){

        const errorFeedback = this.state.showError ? (<span style={{color:"red"}}>Please Enter Valid Password</span>):null;

        return ( 
            <Modal >
                <div className="groupCreateModal border-radius-top h-100pr">
                    <div class="createGroupModalContent">

                        <Row className="createGroupFormContainer">
                            <Row>
                                <Col lg={12}><FormGroup controlId="password" >

                                    <ControlLabel>Password</ControlLabel>
                                    <FormControl
                                        autoFocus
                                        className = "border-radius-full box-shadow border color-border font-size-20 H-64"
                                        type="Password"
                                        placeholder="Password"
                                        onChange={this.handleChange.bind(this)}
                                        
                                    />
                                    {errorFeedback}
                                    </FormGroup>
                                </Col>

                        
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <Button onClick={this.props.close} variant="primary" size="lg" className="createGroupButtonCancel">
                                        Cancel
                                    </Button>
                                

                                </Col>
                                <Col lg={6}>
                                    <Button 
                                        onClick = {this.handlePassword.bind(this)}
                                        disabled={!this.validateForm()} 
                                        variant="primary" 
                                        size="lg" 
                                        className="createGroupButton">
                                       Enter
                                    </Button>
                                </Col>
                                
                            </Row>

                        </Row>

                    </div>
            
                  
              </div>     
               
                             
            </Modal>
       );       
    }     

}

const mapStateToProps = (store) =>{
    return {
        
        
    };
  };
  
  const mapDispachToProps = dispatch => {
    return {
        //createGroup: (group) =>    dispatch(actionCreator.createGroup(group)),


    };
  };
  
  export default connect( mapStateToProps, mapDispachToProps )(PasswordRequestModal);
  
  



