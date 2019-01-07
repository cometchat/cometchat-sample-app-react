import { updateMessageList } from "../actions/cc_action";
import {CheckEmpty} from "./../../lib/uiComponentLib"

const intialState = {
    messages:[],
    activeMessage : {}
}

//only CRD messages action 

const reducers = (state = intialState, action)=> {
    const newState = {...state};

    //ToDo : dummy actions for
    switch(action.type){
        
        case 'createMessage': 
            
        break;
        
        case 'getNewMessage': 
            
            break;

        case 'deleteMessages': 
                   
            
        break;

        case 'updateMessage':
          
            console.log(action.tags + " : " + JSON.stringify(action.uid));

            //find if any object is available for uid 
           
            let _userMessageList = newState.messages.find( userMessage => userMessage.muid === action.uid);
            
            if(CheckEmpty(_userMessageList)){
                //uid is present    
                newState.messages.map( userMessage => {

                    if(userMessage.muid === action.uid){
                        userMessage.message.push(action.message);
                    }
                    return userMessage;
                });

            }else{
                //uid is not present
                let tempobject = { 
                    muid : action.uid,
                    message : action.message
                };
                newState.messages.push(tempobject);    
            }

        
            console.log("message : ", JSON.stringify(newState));
        
        break;

        case 'updateMessageList':
            
            //console.log("Message list received  : " + JSON.stringify(action.messages));
            console.log("User id received  : " + JSON.stringify(action.uid));

            //find if any object is available for uid 
            
            let userMessageList = newState.messages.find( userMessage => userMessage.muid === action.uid);
            
            if(CheckEmpty(userMessageList)){
                //uid is present    
                newState.messages.map( userMessage => {

                    if(userMessage.muid === action.uid){
                        userMessage.message = action.messages;
                    }
                    return userMessage;
                });

            }else{
                //uid is not present
                let tempobject = { 
                    muid : action.uid,
                    message : action.messages
                };
                newState.messages.push(tempobject);    
            }            
        
        break;
        case 'updateActiveMessage' :

            console.log("updateActiveMessage : " + action.uid);

            newState.activeMessage = {
                type: action.utype,
                id:  action.uid
            };
            
        break;
    }
    return newState;
}


export default reducers;