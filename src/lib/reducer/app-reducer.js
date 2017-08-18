// src/lib/reducer/app-reducer.js
import { handleActions } from 'redux-actions';

export const INITIAL_STATE = {
    reloading: false,
    ready: false
};

export default handleActions({
    APP_READY: state => ({
        ...state,
        ready: true
    }),
    RELOAD: state => ({
        ...state,
        reloading: true
    }),
    RELOAD_COMPLETE: state => ({
        ...state,
        reloading: false
    })
}, INITIAL_STATE);
