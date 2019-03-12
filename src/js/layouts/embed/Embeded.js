import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "./../../lib/uiComponentLib";
import { Grid, Row, Col } from 'react-bootstrap';
import CCLeftSidebar from '../../components/embed/CCLeftSidebar';
import CCMessageContainer from '../../components/message/CCMessageContainer';
import * as actionCreator from './../../store/actions/cc_action';
import SplashLoader from "../../components/SplashLoader";

import CCCallController from "./../../components/CCCallController";


class Embeded extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
      
    }
    componentDidMount() {
        
        
    }
    
    render() {


     
        console.log("showloader : " + this.props.showLoader);

        if (this.props.showLoader) {

            return (
                <Grid fluid={true} className="border-radius-top bg-white h-100pr">
                    <Row className="ccShowGrid bg-white border-radius-top ">
                        <SplashLoader/>
                    </Row>
                </Grid>
            );

        } else {

            console.log("inside embedded : ", this.props.activeMessage );
            return (

                <Grid fluid={true} className="border-radius-top bg-white h-100pr">
                    <Row className="ccShowGrid">
                        <Col xs={12} lg={4} className = "border-radius-top-no-right h-100pr color-left-panel">
                            <CCLeftSidebar></CCLeftSidebar>
                        </Col>
                        <Col xsHidden lg={8} style={{ height: "100%" }}>
                            <ActiveUserMessageContainer dataContent={this.props.activeMessage} />
                        </Col>
                    </Row>

                    <CCCallController/>
                </Grid>
            );
        }



    };


}

function ActiveUserMessageContainer(props) {

    const contentType = props.dataContent;
    if (isEmpty(contentType)) {
        return <BlankMessageContainer />;
    } else {
        return <ShowActiveMessage />;
    }
}



function BlankMessageContainer(props) {
    return (
        <div class="outer">
            <div class="middle">
                <div class="inner">
                    <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
                    <h1>Start Chatting </h1>
                    <p>Once upon a midnight dreary...</p>
                </div>
            </div>
        </div>
    );
}


function ShowActiveMessage(props) {
    return <CCMessageContainer />;
}


const mapStateToProps = (store) => {
    return {
        activeMessage: store.message.activeMessage,
        showLoader: store.app.splashHandler.showLoader,
     
        
    };
};

const mapDispachToProps = dispatch => {
    return {
            
        
    };
};

export default connect(mapStateToProps, mapDispachToProps)(Embeded);
