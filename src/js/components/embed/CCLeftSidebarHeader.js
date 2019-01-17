import React, { Component } from "react";

import SVGInline  from "react-svg-inline";

import { Row, Col, OverlayTrigger, Button, Popover } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import iconNewMessage from './../../../public/img/icon_new_message.svg';
import iconMore from './../../../public/img/icon_more.svg';



export default class CCLeftSidebarHeader extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        let title = this.props.tabTitle;
        let tabName = title.charAt(0).toUpperCase() + title.slice(1);
        return (<Row className="sidebarHeader">
            <div>
                <span class="font-title color-font-title size-title">{tabName}</span>
                
                <div className="header-icon">
                    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose}>
                        <SVGInline svg={ iconMore } className="header-icon" height="32px" width="20px"/> 
                    </OverlayTrigger>

                </div>

                <div className="header-icon margin-right-10">
                    <SVGInline svg={ iconNewMessage } className="header-icon" height="32px" width="20px"  /> 
                </div>




            </div>

        </Row>);
    }
}

const popoverClickRootClose = (
    <Popover id="popover-trigger-click-root-close">
        <h3>Setting List here</h3>
    </Popover>
);


