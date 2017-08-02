import { createAction } from 'redux-actions';

export const GET_USER_INFO = 'GET_USER_INFO';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAILURE = 'GET_USER_INFO_FAILURE';

// 获取用户授权
export const getUserInfo = createAction(GET_USER_INFO);

// 获取用户授权成功
export const getUserInfoSuccess = createAction(GET_USER_INFO_SUCCESS);

// 获取用户授权失败
export const getUserInfoFailure = createAction(GET_USER_INFO_FAILURE);
