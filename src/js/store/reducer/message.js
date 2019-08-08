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

        case 'editMessage':

            console.log("Edit Message : " + action.msgid);

            let msgUserEditIndex =  newState.messages.findIndex(userMessage =>userMessage.muid === action.uid);

            if(msgUserEditIndex != 1){

                var newEditState = Object.assign({},state.messages[msgUserEditIndex]);

                const msgEditIndex = newEditState.message.findIndex(message=> message.id === action.msgid);
                
                newEditState.message[msgEditIndex] = action.msgdata;

                const editMessageState = update(state,{messages:{msgUserEditIndex:{$set:newEditState}}});

                return editMessageState;


            }


        break;

        case 'deleteMessage': 
              console.log("message to delete : " + action.msgid);     

              let msguserDelIndex =  newState.messages.findIndex(userMessage =>userMessage.muid === action.uid);

              if(msguserDelIndex != -1 ){

                var newDelState = Object.assign({},state.messages[msguserDelIndex]);

                const msgDelIndex = newDelState.message.findIndex(message=>message.id=== action.msgid);

                newDelState.message.splice(msgDelIndex,1);

                const DelMessageState = update(state,{messages:{msguserDelIndex:{$set:[newDelState]}}});
                console.log("Delete Message : " +  DelMessageState);
                return DelMessageState;

              }
        break;

        case 'updateMessageDelivered':
        
            let msgDindex = newState.messages.findIndex(userMessage =>userMessage.muid === action.uid);

            
            console.log("kshitiz","single message received index : " + action.deliveredAt );
            if(msgDindex != -1 ){

                //uid is present    
                var copyPSMessageState = Object.assign({},state.messages[msgDindex]);

                console.log("Kshitiz",copyPSMessageState);
                
                const messageIndex = copyPSMessageState.message.findIndex(message=>message.id=== action.msgid);
                
                if(messageIndex != -1){
                    console.log("kshitiz","single message received index : " + messageIndex );
                    console.log("kshitiz",);
                  
                    const newMessageState = {...copyPSMessageState.message[messageIndex],"deliveredAt": action.deliveredAt};
                    copyPSMessageState.message[messageIndex]=newMessageState;
        
                    console.log("kshitiz", JSON.stringify(copyPSMessageState));
                    const PSMessageState = update(state,{messages:{msgDindex:{$set:[copyPSMessageState]}}});
                    console.log("message delivered single : ", JSON.stringify(PSMessageState));
                    return PSMessageState;
                }
            }

        break;

        case 'updateMessageRead':
        
        let msgReadIndex = newState.messages.findIndex(userMessage =>userMessage.muid === action.uid);
        console.log("kshitiz","single message received index : " + action.readAt );
        
        if(msgReadIndex != -1 ){

            //uid is present    
            var copyPSMessageState = Object.assign({},state.messages[msgReadIndex]);

            console.log("Kshitiz",copyPSMessageState);
            
            const messageIndex = copyPSMessageState.message.findIndex(message=>message.id=== action.msgid);
            
            if(messageIndex != -1){
                console.log("kshitiz","single message received index : " + messageIndex );
                console.log("kshitiz",);
                const newMessageState = {...copyPSMessageState.message[messageIndex],"readAt": action.readAt};
                copyPSMessageState.message[messageIndex]=newMessageState;
    
                console.log("kshitiz", JSON.stringify(copyPSMessageState));
                const PSMessageState = update(state,{messages:{msgReadIndex:{$set:[copyPSMessageState]}}});
                console.log("message delivered single : ", JSON.stringify(PSMessageState));
                return PSMessageState;
            }
        }

    break;

        case 'updateMessage':
          
            console.log(action.tags + " : " + JSON.stringify(action.uid));

            //find if any object is available for uid 
            let index = newState.messages.findIndex(userMessage =>userMessage.muid === action.uid);

           console.log("single message received index : " + index );
            
            if(index != -1 ){

                //uid is present    
                const copyPSMessageState = Object.assign({},state.messages[index]);

                copyPSMessageState.message.push(action.message);
                
                const PSMessageState = update(state,{messages:{index:{$set:[copyPSMessageState]}}});
                
                console.log("message single : ", JSON.stringify(PSMessageState));

                return PSMessageState;
                
            }
            
            // else{
            //     //uid is not present
                
            //     var tempObj = {
            //         'muid' : action.uid,
            //         'message' : [action.message]
            //     }

            //     const PSSMessageState = update(state,{messages:{$push:[tempObj]}});
               
            //     console.log("message : ", JSON.stringify(PSSMessageState));

            //     return PSSMessageState;
            // }
        
        break;

        case 'updateMessageList':
            
            //console.log("Message list received  : " + JSON.stringify(action.messages));
            console.log("User id received  : " + JSON.stringify(action.uid));

            //find if any object is available for uid 
            let index1 = newState.messages.findIndex(userMessage =>userMessage.muid === action.uid);
                        
            if(index1 != -1){

                //uid is present    
                const copyMessageState = Object.assign({},state.messages[index1]);

                action.messages.map((msg)=>{
                    copyMessageState.message.push(msg);
                });
                
                const copyMessagesState =  Object.assign({}, state.messages);

                const NPLMessageState = update(state,{messages:{index:{$set:[copyMessageState]}}});
                
                console.log("message single : ", JSON.stringify(NPLMessageState));

                return NPLMessageState;


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

        case 'deleteActiveMessage' : {
            newState.activeMessage = {};
        }
    }
    return newState;
}


export default reducers;