// src/lib/actions/douban-radio-act.js
import { createAction } from 'redux-actions';

export const FETCH_CHANNEL_LIST = 'FETCH_CHANNEL_LIST';
export const FETCH_CHANNEL_LIST_SUCCESS = 'FETCH_CHANNEL_LIST_SUCCESS';
export const FETCH_CHANNEL_LIST_FAILURE = 'FETCH_CHANNEL_LIST_FAILURE';
export const FETCH_CHANNEL_LIST_COMPLETE = 'FETCH_CHANNEL_LIST_COMPLETE';

export const SWITCH_CHANNEL = 'SWITCH_CHANNEL';
export const SWITCH_CHANNEL_SUCCESS = 'SWITCH_CHANNEL_SUCCESS';
export const SWITCH_CHANNEL_FAILURE = 'SWITCH_CHANNEL_FAILURE';
export const SWITCH_CHANNEL_COMPLETE = 'SWITCH_CHANNEL_COMPLETE';

export const ADD_HEART = 'ADD_HEART';
export const ADD_HEART_SUCCESS = 'ADD_HEART_SUCCESS';
export const ADD_HEART_FAILURE = 'ADD_HEART_FAILURE';

export const REMOVE_HEART = 'REMOVE_HEART';
export const REMOVE_HEART_SUCCESS = 'REMOVE_HEART_SUCCESS';
export const REMOVE_HEART_FAILURE = 'REMOVE_HEART_FAILURE';

export const NEVER_PLAY = 'NEVER_PLAY';
export const NEVER_PLAY_SUCCESS = 'NEVER_PLAY_SUCCESS';
export const NEVER_PLAY_FAILURE = 'NEVER_PLAY_FAILURE';

// 请求加载频道列表
export const fetchChannelList = createAction(FETCH_CHANNEL_LIST);
export const fetchChannelListSuccess = createAction(FETCH_CHANNEL_LIST_SUCCESS);
export const fetchChannelListFailure = createAction(FETCH_CHANNEL_LIST_FAILURE);
export const fetchChannelListComplete = createAction(FETCH_CHANNEL_LIST_COMPLETE);

// 切换至频道
export const switchChannel = createAction(SWITCH_CHANNEL);
export const switchChannelSuccess = createAction(SWITCH_CHANNEL_SUCCESS);
export const switchChannelFailure = createAction(SWITCH_CHANNEL_FAILURE);
export const switchChannelComplete = createAction(SWITCH_CHANNEL_COMPLETE);

// 添加红心
export const addHeart = createAction(ADD_HEART);
export const addHeartSuccess = createAction(ADD_HEART_SUCCESS);
export const addHeartFailure = createAction(ADD_HEART_FAILURE);

// 移除红心
export const removeHeart = createAction(REMOVE_HEART);
export const removeHeartSuccess = createAction(REMOVE_HEART_SUCCESS);
export const removeHeartFailure = createAction(REMOVE_HEART_FAILURE);

// 不再播放
export const neverPlay = createAction(NEVER_PLAY);
export const neverPlaySuccess = createAction(NEVER_PLAY_SUCCESS);
export const neverPlayFailure = createAction(NEVER_PLAY_FAILURE);
