import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as actionCreator from './../store/actions/cc_action'

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
            <center>
                <h1>
                    Loading...
                </h1>
            </center>
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