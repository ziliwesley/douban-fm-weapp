// src/lib/reducer/douban-radio-reducer.js
import { handleActions } from 'redux-actions';

// 初始 state
export const INITIAL_STATE = {
    // 频道分组
    channelGroups: [],
    error: null,
    fetching: false,
    active: -1
};

export default handleActions({
    // 请求加载频道列表
    FETCH_CHANNEL_LIST: state => ({
        ...state,
        error: null,
        fetching: true
    }),
    FETCH_CHANNEL_LIST_SUCCESS: (state, action) => ({
        ...state,
        channelGroups: action.payload.groups,
        error: null,
        fetching: false
    }),
    FETCH_CHANNEL_LIST_FAILURE: (state, action) => ({
        ...state,
        channelGroups: [],
        error: `${action.payload.request}: ${action.payload.msg} (${action.payload.code})`
    }),
    SWITCH_CHANNEL: (state, action) => ({
        ...state,
        fetching: true,
        active: action.payload
    }),
    SWITCH_CHANNEL_SUCCESS: (state) => ({
        ...state,
        fetching: false
    }),
    SWITCH_CHANNEL_FAILURE: (state) => ({
        ...state,
        fetching: false
    })
}, INITIAL_STATE);
