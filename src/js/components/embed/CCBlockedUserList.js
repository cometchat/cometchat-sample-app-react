import React,{Component} from 'react';
import CCManager from './../../lib/cometchat/ccManager';
import * as utils from "./../../lib/uiComponentLib";
import CCBlockedUser from "./CCBlockedUser";
import icon_back from "./../../../public/img/icon_back.svg";
import { CometChat } from "@cometchat-pro/chat";
import { connect } from 'react-redux';
import * as action from "./../../store/actions/cc_action";

 class CCBlockedUserList extends Component{
    constructor(props){
        super(props);
        this.state={
            userlist: [],
        }
        this.blockedUsersRequest = CCManager.getBlockedUsersRequestBuilder(100);
    }

    componentDidMount(){
        document.getElementById('blockedUserContainer').style.width="100%";
        this.fetchBlockedUserList()
    }

    fetchBlockedUserList(){    
        this.blockedUsersRequest.fetchNext().then(
            userList => {     
                if(userList.length > 0){
                    var newState = {...this.state}
                    newState.userlist = userList;
                    this.setState(newState);
                }
            },
            error => {
                console.log("Blocked user list fetching failed with error:", error);
            }
        ); 
    }

    unblockUser(uid){
        var userlist = [uid];
        var buffer_user = this.state.userlist.find(user => user.uid == uid);
        CometChat.unblockUsers(userlist).then(
            list => {
                this.props.updateUserlistlocal([buffer_user]);
                this.updateUserlist(uid);
                
            }, error => {
                console.log("unblocking user fails with error", error);
            }
        );
    }

    updateUserlist(uid){
        var index = this.state.userlist.findIndex( user => user.uid === uid);
        var newState = {...this.state};
        newState.userlist.splice(index,1);
        this.setState(newState);
    }

    componentWillUnmount(){
        document.getElementById('blockedUserContainer').style.width="0";
    }

    handleClickUser(uid){
       this.unblockUser(uid);
    }

    handleClose(){
        this.props.handlblockedUserEvent;
    }

    render(){
        if(this.state.userlist == undefined || this.state.userlist.length == 0 ){
            return(
                <div id="blockedUserContainer" className="blockedUserContainer"> 
                    <div className="buHeader">
                        <div  class="buHeaderClose header-icon font-title color-font-title size-title" onClick = {this.props.handlblockedUserEvent} dangerouslySetInnerHTML={{ __html: icon_back }} />
                        <span class="buHeaderTitle font-title color-font-title size-title"> Blocked User</span>
                    </div>
                    <div className="buNoUserList buUserList">No Blocked User Found</div>
                </div>
            );
        }else{
            return(
                <div id="blockedUserContainer" className="blockedUserContainer"> 
                    <div className="buHeader">
                        <div  class="buHeaderClose header-icon font-title color-font-title size-title"
                        onClick = {this.props.handlblockedUserEvent}
                        dangerouslySetInnerHTML={{ __html: icon_back }} />
                        <span class="buHeaderTitle font-title color-font-title size-title"> Blocked User</span>
                    </div>
                    <div className="buUserList">
                        { 
                            this.state.userlist.map((el,index) =>(
                                <CCBlockedUser
                                    key={el.uid}
                                    uid={el.uid}
                                    avt={utils.CheckEmpty(el.avatar) ? el.avatar : false}
                                    handleUnblock={this.handleClickUser.bind(this, el.uid)}
                                >
                                    {el.name}
                                </CCBlockedUser>
                            ))  
                        }
                    </div>
                </div>
            );
        } 
    }
}
  
const mapDispachToProps = dispatch => {
    return {
        updateUserlistlocal : (list) => dispatch(action.updateUserList(list)),
    };
};

export default connect(null,mapDispachToProps)(CCBlockedUserList);