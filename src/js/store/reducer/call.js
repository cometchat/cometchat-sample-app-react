const CALL_STATUS = {
    NO_CALL:-1,
    CALLING : 0,
    CALL_ACTIVE :1,
    CALL_ENDED :2, 
    CALL_BUSY :3,
};

const initialState = {
    callData: {},
    showIncomingNotification : false,
    showCallWindow:false,
    callInitData:{},
    callStatus: CALL_STATUS.NO_CALL
}

const reducers = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {

        case 'SHOW_CALL_SCREEN':
            newState.callInitData = action.data;
            newState.showCallWindow = true;
            newState.callStatus = CALL_STATUS.CALLING;
        break;

        case 'INIT_CALL':
            newState.callData  = action.data;                
            newState.callStatus = CALL_STATUS.CALLING;
        break;

        case 'INCOMING_CALL':
            newState.callData  = action.data;
            newState.showIncomingNotification = true;
        break;

        case 'INCOMING_ACCEPT_CALL':
            newState.showCallWindow = true;
            newState.showIncomingNotification = false;
            newState.callStatus = CALL_STATUS.CALL_ACTIVE;
        break;

        case 'OUTGOING_ACCEPTED_CALL':
            newState.showCallWindow = true;
            newState.callStatus = CALL_STATUS.CALL_ACTIVE;
            newState.showIncomingNotification = false;
        break;

        case 'OUTGOING_REJECTED_CALL':
            newState.callData  = {};
            newState.showIncomingNotification = false;
            newState.showCallWindow=false;
            newState.callStatus = CALL_STATUS.CALL_ENDED;
        break;

        case 'INCOMING_REJECT_CALL':
            newState.callData  = {};
            newState.showIncomingNotification = false;
            newState.callStatus = CALL_STATUS.CALL_ENDED;
        break;


        case 'INCOMING_CANCELLED_CALL':
            newState.callData  = {};
            newState.showIncomingNotification = false;
            newState.showCallWindow=false;
            newState.callStatus = CALL_STATUS.CALL_BUSY;
        break;

        case 'INCOMING_END_CALL':
            newState.showIncomingNotification = false;
            newState.showCallWindow=false;
            newState.callStatus = CALL_STATUS.CALL_ENDED;
        break;

        case 'OUTGOING_CANCEL_CALL':
            newState.callData  = {};
            newState.showIncomingNotification = false;
            newState.showCallWindow=false;
            newState.callStatus = CALL_STATUS.CALL_ENDED;
        break;
    }
    return newState;
}


export default reducers;