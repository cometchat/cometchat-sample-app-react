import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import CCGroup from "./CCGroup";
import * as utils from './../../lib/uiComponentLib';
import * as actionCreator from '../../store/actions/cc_action';

class CCGroupList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            _activeGroupUID: this.props.activeGroups.id
        }       
    }


    handleClickUser = (group) => {

        switch(group.type){
        case "public":
            console.log("group type: ", (group.hasJoined));
            if(group.hasJoined == false){
               actionCreator.joinGroup(group);
            }

        break;

        case "password":
        console.log("group type: ", (group.type));
        break;
        
        case "private":
        console.log("group type: ", (group.type));
        break;
        

        }

        this.props.updateActiveMessage(group.guid);
        this.setState({ _activeGroupUID: group.guid });
    }

     shouldComponentUpdate = (nextProps, nextState) => {
        console.log("inside grouplist : ", {nextProps});
        if (this.props == nextProps) {
          //if (this.props.groupList.length == nextProps.groupList.length) {
            return false;
          //}
        }
        return true;
    };

    render() {

        let activeUserId = "";

        if(!(utils.isEmpty(this.props.activeGroups))){
            activeUserId = this.props.activeGroups.id;
        }

        console.log("inside ccgrplist render");
       
        
        return (
            this.props.groupList.map((el, index) => (
                <CCGroup 
                activeClass={activeUserId == el.guid ? "active" : ""} 
                key={el.guid} 
                status={el.type} 
                guid = {el.guid}
                
                avt={utils.CheckEmpty(el.icon) ? el.icon : false} 
                showMessageEvent={this.handleClickUser.bind(this, el)}>
                    {el.name}
                </CCGroup>
            ))
        );
    }
}

const mapStateToProps = (store) => {
    return {
        groupList: store.groups.groupsList,
        activeGroups: store.message.activeMessage
    };
};

const mapDispachToProps = dispatch => {
    return {
        updateActiveMessage: (key, type = "group") => dispatch(actionCreator.setActiveMessages(key, type)),
        fetchGroup: (limit) => dispatch(actionCreator.getGroups(limit)),

    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCGroupList);
