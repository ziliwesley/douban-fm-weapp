// src/lib/reducer/index.js
import { combineReducers } from 'redux';

import appReducer from './app-reducer.js';
import doubanAuthReducer from './douban-auth-reducer.js';
import doubanRadioReducer from './douban-radio-reducer.js';
import wechatAuthReducer from './wx-auth-reducer.js';
import playStateReducer from './play-state-reducer.js';
import playlistReducer from './playlist-reducer.js';
import playerReducer from './player-reducer.js';

const rootReducer = combineReducers({
    app: appReducer,
    doubanAuth: doubanAuthReducer,
    doubanRadio: doubanRadioReducer,
    wechatAuth: wechatAuthReducer,
    playState: playStateReducer,
    playlist: playlistReducer,
    player: playerReducer
});

export default rootReducer;
