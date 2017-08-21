// src/lib/reducer/playlist-reducer.js
import { handleActions } from 'redux-actions';

// 初始 state
export const INITIAL_STATE = {
    // 播放列表
    list: [],
    // 下一首可播放歌曲序号
    next: 0
};

export default handleActions({
    PLAY_NEXT_SONG_SUCCESS: (state, action) => ({
        ...state,
        next: action.payload
    }),
    UPDATE_PLAYLIST_SUCCESS: (state, action) => ({
        ...state,
        next: 0,
        list: action.payload.map(src => ({
            id: src.sid,
            url: src.url,
            cover: src.picture,
            title: src.title,
            artist: src.artist,
            length: src.length,
            like: src.like === 1
        }))
    })
}, INITIAL_STATE)
