import * as actionTypes from './actionTypes';

import { CometChat } from '@cometchat-pro/chat';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (user) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        user: user,
        isLoggedIn: true
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logoutSuccess = () => {
    return {
        type: actionTypes.AUTH_LOGOUT,
        authRedirectPath: "/login"
    };
}

export const logout = () => {
    return dispatch => {
        CometChat.logout().then(dispatch(logoutSuccess()));
    }
    
};

export const auth = (uid, authKey) => {

    return dispatch => {

        dispatch(authStart());

        CometChat.login(uid, authKey).then((user) => {

            if(user) {
                dispatch(authSuccess(user));
            } else {
                dispatch(authFail(user));
            }
            
        }).catch(error => {
            console.log('CometChatLogin Failed', error);
            dispatch(authFail(error));
        });
    };
};

export const authCheckState = () => {
    return dispatch => {
        CometChat.getLoggedinUser().then(user => {
            
            if(user) {
                dispatch(authSuccess(user));
            } else {
                dispatch(authFail(user));
            }
      
        }).catch(error => {
            dispatch(authFail(error));
        });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};