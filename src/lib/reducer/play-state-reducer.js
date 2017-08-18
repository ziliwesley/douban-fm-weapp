// src/lib/reducer/play-state-reducer.js
import { handleActions } from 'redux-actions';

export const PLAYER_STATUS = {
    IDLE: 2,
    PLAYING: 1,
    PAUSED: 0
};

// 初始 state
export const INITIAL_STATE = {
    current: 0,
    duration: 0,
    // 2：没有音乐在播放，1：播放中，0：暂停中
    status: PLAYER_STATUS.IDLE,
    leftRotate: -135,
    rightRotate: -135,
    isPlaying: false
};

export default handleActions({
    UPDATE_PLAY_STATE_SUCCESS: (state, action) => ({
        ...state,
        ...action.payload
    })
}, INITIAL_STATE)
