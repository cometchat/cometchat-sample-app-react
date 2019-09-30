const intialState = {
    usersList: [
    ],
    activeUsers: {
        
    },
    loggedInUser: {
        
    },
}

const reducers = (state = intialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case 'createUser':
            
        break;

        case 'getNewUserList':
            action.users.map((new_user) => {
                newState.usersList.push(new_user);       
            });   
        break;

        case 'updateUserList':
            const tempArray = [...state.usersList];
            action.users.map((user) => {
                if (state.loggedInUser.uid !== user.uid) {
                    tempArray.push(user);
                }
            });
            newState.usersList = tempArray;
        break;

        case 'deleteUser':
            var index = newState.usersList.findIndex( user => user.uid === action.data);
            newState.usersList.splice(index,1);
        break;

        case 'setUserSession':
            newState.loggedInUser = action.user;
        break;

        case 'unsetUserSession':
            newState.loggedInUser = {};
        break;

        case 'setUserOnline' :
            var index = newState.usersList.findIndex(user => user.uid == action.data.uid);
            if(index != -1 ){
                let usersList = [...state.usersList];
                usersList[index] = {...usersList[index],status:action.data.status};
                const newUpdatedState = {...state,usersList};
                return newUpdatedState;
            }
        break;

        case 'setUserTypingStatus' :
            var index = newState.usersList.findIndex(user => user.uid == action.uid);
            if(index != -1 ){
                let usersList = [...state.usersList];
                usersList[index] = {...usersList[index],typeStatus:action.typeStatus};
                const newUpdatedState = {...state,usersList};
                return newUpdatedState;
            }
        break;


        case 'UNSET_MESSAGE_UNREAD_COUNT_USER' : 
            var index1 = newState.usersList.findIndex(user => user.uid == action.data);
            if(index1 != -1 ){
                let usersList = [...state.usersList];
                usersList[index1] = {...usersList[index1],unreadCount:0};
                const newUpdatedState1 = {...state,usersList};
                return newUpdatedState1;
            }
        break;

        case 'UPDATE_MESSAGE_UNREAD_COUNT_LIST' :
            var unreadData = Object.keys(action.data); 
            if(unreadData.length === 0){
            }else{
                let usersList = [...state.usersList];
                unreadData.map( uidkey => {
                    var index = newState.usersList.findIndex(user => user.uid == uidkey);
                    if(index != -1 ){
                        usersList[index] = {...usersList[index],unreadCount:action.data[uidkey]};
                    }
                });
                const newUpdatedState = {...state,usersList};
                return newUpdatedState;
            }
        break;

        case 'setUserOffline' :
            var index1 = newState.usersList.findIndex(user => user.uid == action.data.uid);
            if(index1 != -1 ){
                let usersList = [...state.usersList];
                usersList[index1] = {...usersList[index1],status:action.data.status};
                const newUpdatedState1 = {...state,usersList};
                return newUpdatedState1;
            }
        break;
    }
    return newState;
}

export default reducers;