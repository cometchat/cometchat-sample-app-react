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
            newState.age += action.value;
            break;

        case 'getNewUserList':
            newState.age -= action.value;
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
            newState.age -= action.value;
            break;

        case 'updateActiveUser':

            newState.activeUsers = state.usersList.find(user => user.uid === action.uid);

            break;
        case 'setUserSession':

            console.log("inside user reducers : " + JSON.stringify(action.user));
            newState.loggedInUser = action.user;
            break;
        case 'unsetUserSession':

            break;
    }
    return newState;
}


export default reducers;