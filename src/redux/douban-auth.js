import { createAction, handleActions } from 'redux-actions';

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
    })
}, INITIAL_STATE);
