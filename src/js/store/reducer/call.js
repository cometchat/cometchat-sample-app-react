import update from 'immutability-helper';

const initialState = {
    callData: {},
    showIncomingNotification : false,
    showCallWindow:false    
}

const reducers = (state = initialState, action) => {
    const newState = { ...state };

    //ToDo : dummy actions for
    switch (action.type) {
        case 'INIT_CALL':
            newState.state = "call initialized";                      
            console.log("Inside Splash handler : " );

        break;

        case 'INCOMING_CALL':

            console.log("inside call reducer : " + action.tag);
            newState.callData  = action.data;
            newState.showIncomingNotification = true;

        break;

        case 'INCOMING_ACCEPT_CALL':

        console.log("inside call reducer : " + action.tag);

        newState.showCallWindow = true;
        newState.showIncomingNotification = false;

        break;

        case 'OUTGOING_ACCEPTED_CALL':

            console.log("inside call reducer : " + action.tag);

            newState.showCallWindow = true;
            newState.showIncomingNotification = false;

        break;

        case 'OUTGOING_REJECTED_CALL':
            newState.callData  = {};
            newState.showIncomingNotification = false;
            newState.showCallWindow=false;
        break;

        case 'INCOMING_REJECT_CALL':
        console.log("inside call reducer : " + action.tag);
            newState.callData  = {};
            newState.showIncomingNotification = false;
        break;


        case 'INCOMING_CANCELLED_CALL':

        newState.callData  = {};
        newState.showIncomingNotification = false;
        newState.showCallWindow=false;

        break;

        case 'INCOMING_END_CALL':
            newState.callData  = {};
            newState.showIncomingNotification = false;
            newState.showCallWindow=false;
        break;

        case 'OUTGOING_CANCEL_CALL':
            newState.callData  = {};
            newState.showIncomingNotification = false;
            newState.showCallWindow=false;
        break;



    }
    return newState;
}


export default reducers;