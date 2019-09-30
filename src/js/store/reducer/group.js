const intialState = {
    groupsList:[
    ],
}

const reducers = (state = intialState, action)=> {
    const newState = {...state};
    switch(action.type){
        case 'updateGroup': 
            const tempArray1 = [action.group, ...state.groupsList];                
            newState.groupsList = tempArray1;
        break;
        
        case 'getNewGroupList': 
            newState.age -= action.value;
        break;

        case 'updateGroupList':
            const tempArray = [...state.groupsList];
            action.groups.map( (group) =>{
                tempArray.push(group);
            });
            newState.groupsList = tempArray;
        break;

        case 'deleteGroup': 
            newState.age -= action.value;
        break;

        case 'group_joined':
            let index1 = newState.groupsList.findIndex(group =>group.guid === action.data.guid);
            if(index1 != -1 ){
                let groupsList = [...state.groupsList];
                groupsList[index1] = {...groupsList[index1],hasJoined:true};
                const PSGroupState= {...state,groupsList};
                return PSGroupState;
            }
        break;

        case 'group_left':
            let index = newState.groupsList.findIndex(group =>group.guid === action.data);
            if(index != -1 ){
                let groupsList = [...state.groupsList];
                groupsList[index] = {...groupsList[index],hasJoined:false};
                const PSGroupState= {...state,groupsList};
                return PSGroupState;
            }
        break;


        case 'UPDATE_MESSAGE_UNREAD_COUNT_GROUP_LIST':
            var unreadData = Object.keys(action.data); 
            if(unreadData.length === 0){
                }else{
                let groupsList = [...state.groupsList];
                unreadData.map( uidkey => {
                    var index = newState.groupsList.findIndex(group =>group.guid === uidkey);
                    if(index != -1 ){
                        groupsList[index] = {...groupsList[index],unreadCount:action.data[uidkey]};
                    }
                });
                const newUpdatedState = {...state,groupsList};
                return newUpdatedState;
            }
        break;


        case 'UNSET_MESSAGE_UNREAD_COUNT_GROUP':
            var index1 = newState.groupsList.findIndex(group =>group.guid === action.data);
            if(index1 != -1 ){
                let groupsList = [...state.groupsList];
                groupsList[index1] = {...groupsList[index1],unreadCount:0};
                const newUpdatedState1 = {...state,groupsList};
                return newUpdatedState1;
            }
        break;
        
    }
    return newState;
}


export default reducers;