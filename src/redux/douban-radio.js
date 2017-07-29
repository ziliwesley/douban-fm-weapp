import { createAction, handleActions } from 'redux-actions';

export const FETCH_CHANNEL_LIST = 'FETCH_CHANNEL_LIST';
export const FETCH_CHANNEL_LIST_SUCCESS = 'FETCH_CHANNEL_LIST_SUCCESS';
export const FETCH_CHANNEL_LIST_FAILURE = 'FETCH_CHANNEL_LIST_FAILURE';

export const SWITCH_CHANNEL = 'SWITCH_CHANNEL';
export const SWITCH_CHANNEL_SUCCESS = 'SWITCH_CHANNEL_SUCCESS';
export const SWITCH_CHANNEL_FAILURE = 'SWITCH_CHANNEL_FAILURE';

// 请求加载频道列表
export const fetchChannelList = createAction(FETCH_CHANNEL_LIST);
export const fetchChannelListSuccess = createAction(FETCH_CHANNEL_LIST_SUCCESS);
export const fetchChannelListFailure = createAction(FETCH_CHANNEL_LIST_FAILURE);

// 切换至频道
export const switchChannel = createAction(SWITCH_CHANNEL);
export const switchChannelSuccess = createAction(SWITCH_CHANNEL_SUCCESS);
export const switchChannelFailure = createAction(SWITCH_CHANNEL_FAILURE);

// 初始 state
export const INITIAL_STATE = {
    // 频道分组
    channelGroups: [],
    playlist: [],
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
    SWITCH_CHANNEL_SUCCESS: (state, action) => ({
        ...state,
        fetching: false,
        playlist: action.payload
    }),
    SWITCH_CHANNEL_FAILURE: (state, action) => ({
        ...state,
        fetching: false
    })
}, INITIAL_STATE);
