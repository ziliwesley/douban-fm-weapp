// src/lib/reducer/wx-auth-reducer.js
import { handleActions } from 'redux-actions';

// 初始state
export const INITIAL_STATE = {
    nickName: '尚未获得微信用户授权',
    // Avatar placeholder
    avatarUrl: '/images/avatar-placeholder.png',
    gender: 0,
    province: '',
    city: '',
    country: '',
    requesting: false,
    authorized: false
};

export default handleActions({
    // 获取用户信息
    WX_GET_USER_INFO: state =>
        ({
            ...state,
            requesting: true
        }),
    WX_GET_USER_INFO_SUCCESS: (state, action) =>
        ({
            ...state,
            nickName: action.payload.nickName,
            avatarUrl: action.payload.avatarUrl,
            gender: action.payload.gender,
            province: action.payload.province,
            city: action.payload.city,
            country: action.payload.country,
            requesting: false,
            authorized: true
        }),
    WX_GET_USER_INFO_FAILURE: state =>
        ({
            ...state,
            requesting: false,
            authorized: false
        }),
    WX_CLEAR_STORAGE: () => INITIAL_STATE
}, INITIAL_STATE);
