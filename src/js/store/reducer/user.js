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

            break;
    }
    return newState;
}


export default reducers;