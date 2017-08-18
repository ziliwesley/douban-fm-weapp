// src/lib/actions/wechat-act.js
import { createAction } from 'redux-actions';

export const WX_OPEN_SETTING = 'WX_OPEN_SETTING';
export const WX_OPEN_SETTING_SUCCESS = 'WX_OPEN_SETTING_SUCCESS';
export const WX_OPEN_SETTING_FAILURE = 'WX_OPEN_SETTING_FAILURE';

export const WX_GET_USER_INFO = 'WX_GET_USER_INFO';
export const WX_GET_USER_INFO_SUCCESS = 'WX_GET_USER_INFO_SUCCESS';
export const WX_GET_USER_INFO_FAILURE = 'WX_GET_USER_INFO_FAILURE';

export const WX_CLEAR_STORAGE = 'WX_CLEAR_STORAGE';

export const WX_AUTHORIZE_SUCCESS = 'WX_AUTHORIZE_SUCCESS';
export const WX_AUTHORIZE_FAILURE = 'WX_AUTHORIZE_FAILURE';

// 调起客户端小程序设置界面，返回用户设置的操作结果
export const wxOpenSetting = createAction(WX_OPEN_SETTING);
export const wxOpenSettingSuccess = createAction(WX_OPEN_SETTING_SUCCESS);
export const wxOpenSettingFailure = createAction(WX_OPEN_SETTING_FAILURE);

// 获取用户授权
export const wxAuthorizeSuccess = createAction(WX_AUTHORIZE_SUCCESS);
export const wxAuthorizeFailure = createAction(WX_AUTHORIZE_FAILURE);

// 获取微信用户信息
export const wxGetUserInfo = createAction(WX_GET_USER_INFO);
export const wxGetUserInfoSuccess = createAction(WX_GET_USER_INFO_SUCCESS);
export const wxGetUserInfoFailure = createAction(WX_GET_USER_INFO_FAILURE);

// 清空本地缓存
export const wxClearStorage = createAction(WX_CLEAR_STORAGE);
