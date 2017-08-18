// src/lib/reducer/player-reducer.js
import { handleActions } from 'redux-actions';

// 初始 state
export const INITIAL_STATE = {
    id: '',
    url: '',
    cover: '',
    title: '',
    artist: '',
    channelName: '',
    channelId: 0,
    length: 0,
    like: false
};

export default handleActions({
    CHANGE_SONG: (state, action) => ({
        ...state,
        ...action.payload
    }),
    PLAY_NEXT_SONG_FAILURE: () => INITIAL_STATE,
    // 添加红心
    ADD_HEART: state => ({
        ...state,
        like: true
    }),
    // 移除红心
    REMOVE_HEART: state => ({
        ...state,
        like: false
    })
}, INITIAL_STATE)
