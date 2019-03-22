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

    //ToDo : dummy actions for
    switch (action.type) {
        case 'createUser':
            
            break;

        case 'getNewUserList':
                
                console.log("inside user.js : " + JSON.stringify(action.users));
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
            
            break;

        case 'setUserSession':

            console.log("inside user reducers : " + JSON.stringify(action.user));
            newState.loggedInUser = action.user;
            break;

        case 'unsetUserSession':
        newState.loggedInUser = {};
        break;

        case 'setUserOnline' :
            console.log("inside user reducer", action.data);

            var index = newState.usersList.findIndex(user => user.uid == action.data.uid);

            if(index != -1 ){

                let usersList = [...state.usersList];

                usersList[index] = {...usersList[index],status:action.data.status};

                const newUpdatedState = {...state,usersList};

                console.log("User online : ", JSON.stringify(newUpdatedState));

                return newUpdatedState;
            }


        break;

        case 'setUserOffline' :
            var index1 = newState.usersList.findIndex(user => user.uid == action.data.uid);

            if(index1 != -1 ){

                let usersList = [...state.usersList];

                usersList[index1] = {...usersList[index1],status:action.data.status};

                const newUpdatedState1 = {...state,usersList};

                console.log("User online : ", JSON.stringify(newUpdatedState1));

                return newUpdatedState1;
            }


        break;
    }
    return newState;
}


export default reducers;