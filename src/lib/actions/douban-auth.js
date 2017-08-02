import { createAction } from 'redux-actions';

export const DOUBAN_LOGIN = 'DOUBAN_LOGIN';
export const DOUBAN_LOGIN_SUCCESS = 'DOUBAN_LOGIN_SUCCESS';
export const DOUBAN_LOGIN_FAILURE = 'DOUBAN_LOGIN_FAILURE';
export const DOUBAN_LOGOUT = 'DOUBAN_LOGOUT';

// 请求登录action
export const loginDouban = createAction(DOUBAN_LOGIN);

// 注销action
export const logoutDouban = createAction(DOUBAN_LOGOUT);

// 登录成功
export const loginDoubanSuccess = createAction(DOUBAN_LOGIN_SUCCESS,
    payload => payload,
    // Transfer request meta
    (payload, meta) => meta);

// 登录失败
export const loginDoubanFailure = createAction(DOUBAN_LOGIN_FAILURE);
