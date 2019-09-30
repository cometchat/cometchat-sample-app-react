import React, { Component } from "react";
import { connect } from "react-redux";
import { Col } from "react-bootstrap";
import * as actionCreator from './../../store/actions/cc_action';
import './style.sass';

class SplashLoader extends Component {

    componentDidMount() {
        if (this.props.isSyncStarted == 0) {
            this.props.startFetching();
            this.fetchAllInit();
        }
    }

    async fetchAllInit() {
        try {
            await this.props.fetchUser(50);
            await this.props.fetchGroup(50);
            await this.props.registerListener();
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        return (
            <Col lg={12} className="splashContainer">
                <div class="loaderContainer">Loading <span class="loader__dot">.</span>
                    <span class="loader__dot">.</span>
                    <span class="loader__dot">.</span>
                    <span class="loader__dot">.</span>
                </div>
            </Col>
        );
    }

}


const mapStateToProps = (store) => {
    return {
        currentStage: store.app.splashHandler.stage,
        isSyncStarted: store.app.splashHandler.syncStarted
    };
};

const mapDispachToProps = dispatch => {
    return {
        fetchUser: (limit) => dispatch(actionCreator.getUsers(limit)),
        fetchGroup: (limit) => dispatch(actionCreator.getGroups(limit)),
        registerListener: () => actionCreator.addMessageListener(dispatch),
        startFetching: () => dispatch(actionCreator.startFetching()),

    };
};

export default connect(mapStateToProps, mapDispachToProps)(SplashLoader);