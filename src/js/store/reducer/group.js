const intialState = {
    groupsList:[
    ],

   
}

const reducers = (state = intialState, action)=> {
    const newState = {...state};

    //ToDo : dummy actions for
    switch(action.type){
        case 'createGroup': 
            newState.age += action.value;
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

        
    }
    return newState;
}


export default reducers;