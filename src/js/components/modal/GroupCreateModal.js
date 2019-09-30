import React from "react";
import Modal from './Modal';
import { Row, Col, Button, FormGroup, FormControl, ControlLabel,InputGroup } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from './../../store/actions/cc_action';
import CCManager from './../../lib/cometchat/ccManager';

class GroupCreateModal extends React.PureComponent {

    constructor(props) {
        super(props);    
        this.state = {
            groupType : CCManager.GroupType.PUBLIC,
            group_name:"",
            guid:"",
            group_password:""
        }
    }

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    }

    validateForm() {
        return this.state.guid.length > 0 && this.state.group_name.length > 0 && ((this.state.groupType===CCManager.GroupType.PASSWORD)?this.state.group_password.length > 0 : true) ;
    }

    handleCreateGroup  = () =>{
        var data = {
            guid :this.state.guid,
            groupName:this.state.group_name,
            groupType:this.state.groupType,
            password:this.state.group_password
        };
        this.props.createGroup(data)
        this.props.close();
    }

    render(){
        const passwordView  = this.state.groupType === CCManager.GroupType.PASSWORD?(<Col lg={12}><FormGroup controlId="group_password" ><ControlLabel>Password</ControlLabel><FormControl autoFocus className = "border-radius-full box-shadow border color-border font-size-20 H-64" type="Password" placeholder="Password" onChange={this.handleChange.bind(this)}  /></FormGroup></Col>):null;

        return ( 
            <Modal >
                <div className="groupCreateModal border-radius-top h-100pr">
                    <div class="createGroupModalContent">
                        <Row className="createGroupFormContainer">
                            <Row>
                                <Col lg={12}>   
                                    <FormGroup controlId="guid" >
                                        <ControlLabel>GUID</ControlLabel>
                                        <FormControl
                                            autoFocus
                                            className = "border-radius-full box-shadow border color-border font-size-20 H-64"
                                            type="Text"
                                            placeholder=" Enter Group Id"
                                            onChange={this.handleChange.bind(this)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg={12}>
                                    <FormGroup controlId="group_name" >
                                        <ControlLabel>Group Name</ControlLabel>
                                        <FormControl                                          
                                            className = "border-radius-full box-shadow border color-border font-size-20 H-64"
                                            type="Text"
                                            placeholder=" Enter Group Name"
                                            onChange={this.handleChange.bind(this)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg={12}>
                                    <FormGroup>
                                        <ControlLabel>Group Type</ControlLabel>
                                        <select
                                            id="groupType"               
                                            className = "form-control border-radius-full box-shadow border color-border font-size-20 H-64"
                                            onChange={this.handleChange.bind(this)}>
                                            <option value={CCManager.GroupType.PUBLIC}>Public</option>
                                            <option value={CCManager.GroupType.PASSWORD}>Password</option>
                                            <option value={CCManager.GroupType.PRIVATE}>Private</option>
                                        </select>
                                    </FormGroup>
                                </Col>
                                {passwordView}
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <Button onClick={this.props.close} variant="primary" size="lg" className="createGroupButtonCancel">
                                        Cancel
                                    </Button>
                                </Col>
                                <Col lg={6}>
                                    <Button 
                                        disabled={!this.validateForm()} 
                                        onClick={this.handleCreateGroup.bind(this)} 
                                        variant="primary" 
                                        size="lg" 
                                        className="createGroupButton">
                                        Create
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
  
const mapDispachToProps = dispatch => {
    return {
        createGroup: (group) =>    dispatch(actionCreator.createGroup(group)),
    };
};
  
export default connect( null, mapDispachToProps )(GroupCreateModal);