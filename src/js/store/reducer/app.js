const initialState = {
    splashHandler: {
        stage: 0,
        syncStarted:0,
        showLoader: true
    }
}

const reducers = (state = initialState, action) => {
    const newState = { ...state };

    //ToDo : dummy actions for
    switch (action.type) {
        case 'UPDATED_STAGE':
            newState.splashHandler.stage += (100/3);
            
            if(newState.splashHandler.stage >= 100){
                newState.splashHandler.syncStarted = 0;
                newState.splashHandler.showLoader = false;
            }
            console.log("Inside Splash handler : " + newState.splashHandler.stage);
        break;

        case 'SHOW_LOADER':
            newState.splashHandler.showLoader = true;
        break;

        case 'SYNC_STARTED':
            newState.splashHandler.syncStarted = 1;
        break;

        case 'STOP_LOADER':
            newState.splashHandler.syncStarted = 0;
            newState.splashHandler.showLoader = false;
        break;
    }
    return newState;
}


export default reducers;