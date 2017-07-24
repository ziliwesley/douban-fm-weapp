import { createAction, handleActions } from 'redux-actions';
import immutable from 'seamless-immutable';

export const GET_USER_INFO = 'GET_USER_INFO';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAILURE = 'GET_USER_INFO_FAILURE';

// 获取用户授权
export const getUserInfo = createAction(GET_USER_INFO);

// 获取用户授权成功
export const getUserInfoSuccess = createAction(GET_USER_INFO_SUCCESS);

// 获取用户授权失败
export const getUserInfoFailure = createAction(GET_USER_INFO_FAILURE);

// 初始state
export const INITIAL_STATE = immutable({
    nickName: '',
    avatarUrl: '',
    gender: 0,
    province: '',
    city: '',
    country: '',
    requesting: false
});

export default handleActions({
    // 获取用户信息
    GET_USER_INFO: state =>
        state.merge({
            requesting: true
        }),
    GET_USER_INFO_SUCCESS: (state, action) =>
        state.merge({
            nickName: action.payload.nickName,
            avatarUrl: action.payload.avatarUrl,
            gender: action.payload.gender,
            province: action.payload.province,
            city: action.payload.city,
            country: action.payload.country,
            requesting: false
        }),
    GET_USER_INFO_FAILURE: state =>
        state.merge({
            requesting: false
        })
}, INITIAL_STATE);
