import { createAction } from 'redux-actions';

export const UPDATE_PLAY_STATE = 'UPDATE_PLAY_STATE';
export const UPDATE_PLAY_STATE_SUCCESS = 'UPDATE_PLAY_STATE_SUCCESS';
export const UPDATE_PLAY_STATE_FAILURE = 'UPDATE_PLAY_STATE_FAILURE';

// 更新播放状态
export const updatePlayState = createAction(UPDATE_PLAY_STATE);
export const updatePlayStateSuccess = createAction(UPDATE_PLAY_STATE_SUCCESS);
export const updatePlayStateFailure = createAction(UPDATE_PLAY_STATE_FAILURE);
