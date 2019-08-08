import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import CCGroup from "./CCGroup";
import * as utils from './../../lib/uiComponentLib';
import * as actionCreator from '../../store/actions/cc_action';

import {CometChat} from '@cometchat-pro/chat';

class CCGroupList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            _activeGroupUID: this.props.activeGroups.id,
            searchMode:false,
            searchData:null,
           
        };
        this.subscribe();
    }


    subscribe(){

        document.addEventListener("fetchGroupKey", (e) => {
          var searchkey  = e.detail.key;
          console.log('custom message triggered  : ' , searchkey);
          if(searchkey.length == 0){
            this.setState({
              searchMode:false,
              searchData:null
            });
          }else{
            this.fetchGroupsWithSearchKey(searchkey);
          }          
         
        });
    
      }


      fetchGroupsWithSearchKey=(key)=>{
        let groupsRequest = new CometChat.GroupsRequestBuilder().setLimit(100).setSearchKeyword(key).build();

        groupsRequest.fetchNext().then(
            groupList => {
              /* groupList will be the list of Group class */
              console.log("Groups list fetched successfully", groupList);
              
                this.setState({
                    searchMode:true,
                    searchData:groupList
                });
            },
            error => {
              console.log("Groups list fetching failed with error", error);
            }
          );


      }

    // componentWillMount(){
    //    this.props.updateGroupUnReadMessage();
    // }
    


    handleClickUser = (group) => {
       
        // if(group.hasJoined == false){
        //     actionCreator.joinGroup(group);
        // }
        this.props.unsetUnReadMessage(group.guid);
        this.props.updateActiveMessage(group.guid);
        
        this.setState({ _activeGroupUID: group.guid });
    }

     shouldComponentUpdate = (nextProps, nextState) => {
        console.log("inside grouplist : ", {nextProps});
        if (this.props == nextProps && nextState == this.state) {
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
       
        if(this.state.searchMode){
            if(this.state.searchData != null){
                return this.state.searchData.map((el, index) => (
                    <CCGroup 
                    activeClass={""} 
                    key={el.guid} 
                    status={el.type} 
                    guid = {el.guid}
                    group_name = {el.name}
                    groupData = {el}
                    unreadCount = {el.hasOwnProperty("unreadCount")? el.unreadCount : 0 }
                    avt={utils.CheckEmpty(el.icon) ? el.icon : false} 
                    showMessageEvent={this.handleClickUser.bind(this, el)}/>
                  ));
            }else{

            }

        }else{
            return (
                this.props.groupList.map((el, index) => (
                    <CCGroup 
                    activeClass={activeUserId == el.guid ? "active" : ""} 
                    key={el.guid} 
                    status={el.type} 
                    guid = {el.guid}
                    group_name = {el.name}
                    groupData = {el}
                    unreadCount = {el.hasOwnProperty("unreadCount")? el.unreadCount : 0 }
                    avt={utils.CheckEmpty(el.icon) ? el.icon : false} 
                    showMessageEvent={this.handleClickUser.bind(this, el)}>
                        
                       
                    </CCGroup>
                ))
            );

        }
        
        
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
        
        unsetUnReadMessage:()=> (guid)=>dispatch(actionCreator.unsetUnReadGroupMessage(guid))

    };
};

export default connect(mapStateToProps, mapDispachToProps)(CCGroupList);
