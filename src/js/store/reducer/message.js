import {CheckEmpty} from "./../../lib/uiComponentLib";
import update from 'immutability-helper';

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
            
            let index = newState.messages.findIndex(userMessage =>userMessage.muid === action.uid);

           
            
            if(index != -1 ){
                //uid is present    
                const copyMessageState = Object.assign({},state.messages[index]);

                copyMessageState.message.push(action.message);
                
                const PSMessageState = update(state,{messages:{index:{$set:[copyMessageState]}}});
                
                console.log("message single : ", JSON.stringify(PSMessageState));

                return PSMessageState;

                
            }else{
                //uid is not present
                
                return Object.assign({}, state, {
                    messages: [
                       ...state.messages,
                       {
                        'muid' : action.uid,
                        'message' : action.message
                       }
                    ]
                  });
            }

        
        
        break;

        case 'updateMessageList':
            
            //console.log("Message list received  : " + JSON.stringify(action.messages));
            console.log("User id received  : " + JSON.stringify(action.uid));

            //find if any object is available for uid 

            let index1 = newState.messages.findIndex(userMessage =>userMessage.muid === action.uid);
                        
            if(index1 != -1){

                //uid is present    
                const copyMessageState = Object.assign({},state.messages[index1]);

                copyMessageState.message.push(action.messages);
                
                const copyMessagesState =  Object.assign({}, state.messages);

                copyMessagesState[index1] = copyMessageState; 

                newState.messages = copyMessagesState; 


            }else{
                //uid is not present
                var tempObj = {
                    'muid' : action.uid,
                    'message' : action.messages
                }
                const NPMessageState = update(state,{messages:{$push:[tempObj]}});
                
                console.log("message : ", JSON.stringify(NPMessageState));

                return NPMessageState;
                
                 

                
                
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