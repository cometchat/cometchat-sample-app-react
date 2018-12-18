//cometchat login

import CCManager from './../../lib/cometchat/ccManager';
import {CometChat,sendMessage} from '@cometchat-pulse/cometchat-pulse.js';
 

//set User Session
export const loginInCC =(dispatch, UID)=>{
    return dispatch => {
     
        CometChat.login(UID, CCManager.apiKey).then(user=>{  
            console.log("AppUser Information :", {user});
            addMessageListener(dispatch);  
            return dispatch(setUserSession(user));
    
        }).catch(error=>{ 
    
            console.log("Print Error : ",{error});
      });
     

    }    
}

export const setUserSession=(val)=>{
    return {
        type: "setUserSession", 
        user:val,
    };
}


//setActiveUser

export const setActiveUser = (uid)=>{
    return dispatch => {
        //dispatch(getUserMessageHistory(uid,50));
        return dispatch(setActiveUsers(uid));
    };
};



export const setActiveUsers = (key)=>{
    return { 
        type: "updateActiveUser", 
        uid:key 
    };    
}


//get the user
export const getUsers=(limit=1000)=>{
    let usersRequest =  CCManager.usersRequestBuilder.setLimit(limit).build();
  
    return dispatch => {
        usersRequest.fetchNext().then(users => {
            return dispatch(updateUserList(users));
        },error=>{
            console.log("Print Error : "+ JSON.stringify(error));
        });
    }
}


//Set UpdateUserList

export const updateUserList = (val) =>{
    return{
        type:'updateUserList',
        users:val,
    }
}

 
//getGroups
export const getGroups=(limit=1000)=>{
   
    let groupRequest = CCManager.groupsRequestBuilder.setLimit(limit).build();

    return dispatch => {
        groupRequest.fetchNext().then(groups => { 
            console.log("Group Request output : "+ JSON.stringify(groups));      
            return dispatch(updateGroupList(groups));
        },error=>{
            console.log("Print Error : "+ JSON.stringify(error));
        });
    }
}

//UpdateGroupList
export const updateGroupList=(val)=>{
    return {
        type:'updateGroupList',
        groups:val,
    }
}


//addMessageListener 

export const addMessageListener=(dispatch)=>{
    console.log("inside addMessageListener ccAction",{dispatch});
    CCManager.addMessageListener(dispatch);    
}

//handle action message

export const handleActionMessage=(actionMsg)=>{
    console.log("Action Message recieved : "+ JSON.stringify(actionMsg));
    return {
        type:'NoAction',
        
    }

}

//handle Text Message 

export const handleTextMessage=(msg,dispatch)=>{

    console.log("Text Message recieved from : "+ msg.sender);
    dispatch(updateMessage(msg.sender,msg,"text Recieved : "));
}

//handle Media Message 

export const handleMediaMessage=(msg)=>{
    console.log("Media Message recieved : "+ JSON.stringify(msg));
    return {
        type:'NoAction',
    }
}


//sendMessage 

export const sendTextMessage=(uid,text)=>{

    let textMessage =  CCManager.getTextMessage(uid, text);

    return dispatch =>{
        CometChat.sendMessage(textMessage).then(
            (message) => {	
                // if(message instanceof TextMessage){
                    //console.log("mesage callback : " + JSON.stringify(message));
                    return dispatch(updateMessage(uid,message,"sendText"));
                //}
        
            
            }, (error) => {
                console.log("mesage callback error : " + JSON.stringify(error));
            //Handle any error
        });
    } 
}

export const updateMessage=(user,val,tag)=>{
    return {
        type:"updateMessage",
        message:val,
        uid : user,
        tags:tag
    }
}

export const updateMessageList = (message,val) =>{
    return{
        type:"updateMessageList",
        messages:message,
        uid:val
    }
}

//getUserMessageHistory
export const getUserMessageHistory=(uid,limit=50)=>{

    console.log("user id for other party : " + uid);
   
   // let uid="SUPERHERO2" //Uid of the user with the communication is happening.;

    let messageRequest = CCManager.messageRequestBuilder(uid,limit); 
    
    return dispatch =>{ 
        messageRequest.fetchPrevious().then(messages => {  
            // handle list of messages received
            return dispatch(updateMessageList(messages,uid,"messageHistory"));

    //    }).catch(error => {
    //         // handle exception
    //         console.log("mesage callback error : " + JSON.stringify(error));
      });
    }   
  
}

