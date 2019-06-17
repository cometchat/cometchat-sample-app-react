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

    showShimmer(){
        console.log("showshimmer");
    }

    hideShimmer(){
        console.log("hideshimmer");
    }

    fetchBlockedUserList(){
        this.showShimmer();       
        this.blockedUsersRequest.fetchNext().then(
            userList => {        
                console.log("Blocked user list received:", userList);        
                if(userList.length > 0){
                    var newState = {...this.state}
                    newState.userlist = userList;
                    this.setState(newState);
                    this.hideShimmer();
                }
            },
            error => {
                console.log("Blocked user list fetching failed with error:", error);
            }
        ); 
    }

    UnblockUser(uid){
        var userlist = [uid];
        var buffer_user = this.state.userlist.find(user => user.uid == uid);
        console.log("buffer_user : " , buffer_user);
        CometChat.unblockUsers(userlist).then(
            list => {
                console.log("users list unblocked", { list });
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
       console.log("uid to unblock ", uid);
       this.UnblockUser(uid);
    }

    handleClose(){
        this.props.handlblockedUserEvent;
    }

    render(){

        

        if(this.state.userlist == undefined || this.state.userlist.length == 0 ){
            return(
                <div id="blockedUserContainer" className="blockedUserContainer"> 
                
                    <div className="buHeader">
                        
                        <div  class="buHeaderClose header-icon font-title color-font-title size-title"
                        onClick = {this.props.handlblockedUserEvent}
                        dangerouslySetInnerHTML={{ __html: icon_back }} />
                        <span class="buHeaderTitle font-title color-font-title size-title"> Blocked User</span>
                        {/* <span class="buHeaderClose header-icon font-title color-font-title size-title"> X </span> */}
                    </div>
    
                    <div className="buNoUserList buUserList">


                        No Blocked User Found

    
                    </div>
                
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

                        ))  } 

                        
    
                    </div>
                
                </div>
            );
        }
        
    }


}


const mapStateToProps = state => {
    return {
      
    };
};
  
const mapDispachToProps = dispatch => {
    return {
        updateUserlistlocal : (list) => dispatch(action.updateUserList(list)),
    };
};

export default connect(mapStateToProps,mapDispachToProps)(CCBlockedUserList);