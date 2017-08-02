import { handleActions } from 'redux-actions';

export const PLAYER_STATUS = {
    IDLE: 2,
    PLAYING: 1,
    PAUSED: 0
};

// 初始 state
export const INITIAL_STATE = {
    // 播放列表
    playlist: [],
    // 当前正在播放歌曲序号
    current: -1,
    // 下一首可播放歌曲序号
    next: 0,
    // 当前播放歌曲信息
    playing: {
        id: '',
        url: '',
        cover: '',
        title: '',
        artist: '',
        length: 0,
        like: false
    },
    playState: {
        current: 0,
        duration: 0,
        // 2：没有音乐在播放，1：播放中，0：暂停中
        status: PLAYER_STATUS.IDLE,
        leftRotate: -135,
        rightRotate: -135,
        isPlaying: false
    }
};

export default handleActions({
    PLAY_NEXT_SONG_SUCCESS: (state, action) => ({
        ...state,
        current: action.payload.current,
        next: action.payload.next,
        playing: action.payload.playing
    }),
    PLAY_NEXT_SONG_FAILURE: state => ({
        ...state,
        playing: INITIAL_STATE.playing
    }),
    UPDATE_PLAYLIST_SUCCESS: (state, action) => ({
        ...state,
        next: 0,
        playlist: action.payload.map(src => ({
            id: src.sid,
            url: src.url,
            cover: src.picture,
            title: src.title,
            artist: src.artist,
            length: src.length,
            like: src.like === 1
        }))
    }),
    PLAY_PROGRESS_UPDATE: (state, action) => ({
        ...state,
        playState: action.payload
    }),
    // 添加红心
    ADD_HEART: state => ({
        ...state,
        playing: {
            ...state.playing,
            like: true
        }
    }),
    // 移除红心
    REMOVE_HEART: state => ({
        ...state,
        playing: {
            ...state.playing,
            like: false
        }
    })
}, INITIAL_STATE)
