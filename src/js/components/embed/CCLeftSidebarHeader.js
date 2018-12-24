import React, { Component } from "react";
import { Row, Col, OverlayTrigger, Button, Popover } from 'react-bootstrap';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class CCLeftSidebarHeader extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        let title = this.props.tabTitle;
        let tabName =   title.charAt(0).toUpperCase() + title.slice(1);
        return (<Row className="sidebarHeader">
        <div>
            <span class="font-title color-font-title size-title">{tabName}</span>

            <div className="header-icon">
                <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose}>
                    <FontAwesomeIcon  icon="ellipsis-v" />
                </OverlayTrigger>

            </div>

            <div className="header-icon margin-right-10">
                <FontAwesomeIcon  icon="edit" />
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


