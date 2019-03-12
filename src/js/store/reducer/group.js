
import update from 'immutability-helper';

const intialState = {
    groupsList:[
    ],

   
}

const reducers = (state = intialState, action)=> {
    const newState = {...state};

    //ToDo : dummy actions for
    switch(action.type){
        case 'updateGroup': 
            const tempArray1 = [action.group, ...state.groupsList];
            //tempArray1.push(action.group);                 
            newState.groupsList = tempArray1;
        break;
        
        case 'getNewGroupList': 
            newState.age -= action.value;
        break;

        case 'updateGroupList': 

            //newState.usersList = action.users;
            const tempArray = [...state.groupsList];
             action.groups.map( (group) =>{
                tempArray.push(group);
             });
     
            
            newState.groupsList = tempArray;            
            // console.log(JSON.stringify(newState.usersList));

        break;

        case 'deleteGroup': 
            newState.age -= action.value;
        break;

        case 'group_joined':

        let index1 = newState.groupsList.findIndex(group =>group.guid === action.data.guid);

        console.log("single message received index : " + index1 );

        if(index1 != -1 ){

            let groupsList = [...state.groupsList];
            
            groupsList[index1] = {...groupsList[index1],hasJoined:true};

            const PSGroupState= {...state,groupsList};

            console.log("Group single : ", JSON.stringify(PSGroupState));

            return PSGroupState;
            
        }

        break;

        case 'group_left':

        let index = newState.groupsList.findIndex(group =>group.guid === action.data);

        console.log("single message received index : " + index );

        if(index != -1 ){

            let groupsList = [...state.groupsList];
            
            groupsList[index] = {...groupsList[index],hasJoined:false};

            const PSGroupState= {...state,groupsList};

            console.log("Group single : ", JSON.stringify(PSGroupState));

            return PSGroupState;
            
        }

        break;

        
    }
    return newState;
}


export default reducers;