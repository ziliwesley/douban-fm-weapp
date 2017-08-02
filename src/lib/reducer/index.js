import { combineReducers } from 'redux';

import doubanAuthReducer from './douban-auth.js';
import doubanRadioReducer from './douban-radio.js';
import wechatAuthReducer from './wx-auth.js';
import playerReducer from './player.js';


const rootReducer = combineReducers({
    doubanAuth: doubanAuthReducer,
    doubanRadio: doubanRadioReducer,
    wechatAuth: wechatAuthReducer,
    player: playerReducer
});

export default rootReducer;
