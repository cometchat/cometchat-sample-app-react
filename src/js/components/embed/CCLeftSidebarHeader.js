import React,{Component} from "react";
import {Row,Col,OverlayTrigger,Button,Popover} from 'react-bootstrap';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class CCLeftSidebarHeader extends Component{

    render(){
        return EXtHTML;
    }
}

const popoverClickRootClose = (
    <Popover id="popover-trigger-click-root-close">
      <h3>Setting List here</h3>
    </Popover>
  );

const EXtHTML = (
    <Row className = "sidebarHeader">
        <Col lg={2} md={2} sm={2} xs={2} className = "cc-no-padding">
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose}>
                <FontAwesomeIcon  className = "cc-icon" icon="cog" />
            </OverlayTrigger>   
        </Col>

        <Col lg={8} md={8} sm={8} xs={8} >
            <h1 class = "cc-title">CometChat</h1>    
        </Col>

        <Col lg={2} md={2} sm={2} xs={2}>
            <FontAwesomeIcon  className = "cc-icon" icon="edit" />
        </Col>

    </Row>
);


