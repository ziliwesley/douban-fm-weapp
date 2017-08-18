// src/lib/reducer/douban-auth-reducer.js
import { handleActions } from 'redux-actions';

// 初始 state
export const INITIAL_STATE = {
    accessToken: null,
    loginName: null,
    userName: null,
    userId: null,
    error: null,
    fetching: false
};

export default handleActions({
    // 请求登录action
    DOUBAN_LOGIN: state => ({
        ...state,
        fetching: true,
        error: null
    }),
    // 注销action
    DOUBAN_LOGOUT: () => INITIAL_STATE,
    // 登录成功
    // TODO: 计算 expire 时间
    DOUBAN_LOGIN_SUCCESS: (state, action) => ({
        ...state,
        fetching: false,
        error: null,
        loginName: action.meta.loginName,
        accessToken: action.payload['access_token'],
        userName: action.payload['douban_user_name'],
        userId: action.payload['douban_user_id']
    }),
    DOUBAN_LOGIN_FAILURE: (state, action) => ({
        ...state,
        fetching: false,
        error: `${action.payload.request}: ${action.payload.msg} (${action.payload.code})`
    }),
    WX_CLEAR_STORAGE: () => INITIAL_STATE
}, INITIAL_STATE);
