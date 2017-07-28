import { createAction, handleActions } from 'redux-actions';

export const FETCH_CHANNEL_LIST = 'FETCH_CHANNEL_LIST';
export const FETCH_CHANNEL_LIST_SUCCESS = 'FETCH_CHANNEL_LIST_SUCCESS';
export const FETCH_CHANNEL_LIST_FAILURE = 'FETCH_CHANNEL_LIST_FAILURE';

// 请求加载频道列表
export const fetchChannelList = createAction(FETCH_CHANNEL_LIST);
export const fetchChannelListSuccess = createAction(FETCH_CHANNEL_LIST_SUCCESS);
export const fetchChannelListFailure = createAction(FETCH_CHANNEL_LIST_FAILURE);

// 初始 state
export const INITIAL_STATE = {
    // 频道分组
    channelGroups: [],
    error: null,
    fetching: false
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
    })
}, INITIAL_STATE);
