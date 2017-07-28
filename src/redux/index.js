import { combineReducers } from 'redux';
import configureStore from './createStore';
import rootSaga from '../sagas/';

import doubanAuthReducer from './douban-auth.js';
import doubanRadioReducer from './douban-radio.js';
import wechatAuthReducer from './wx-auth.js';

function createStore() {
    const rootReducer = combineReducers({
        doubanAuth: doubanAuthReducer,
        doubanRadio: doubanRadioReducer,
        wechatAuth: wechatAuthReducer
    });

    return configureStore(rootReducer, rootSaga);
}

export default createStore();
