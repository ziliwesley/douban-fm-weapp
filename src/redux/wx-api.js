import wx from 'labrador-immutable';
import { createAction } from 'redux-actions';

export const WX_AUTHORIZE = 'WX_AUTHORIZE';
export const WX_AUTHORIZE_SUCCESS = 'WX_AUTHORIZE_SUCCESS';
export const WX_AUTHORIZE_FAILURE = 'WX_AUTHORIZE_FAILURE';

export const WX_OPEN_SETTING = 'WX_OPEN_SETTING'
export const WX_OPEN_SETTING_SUCCESS = 'WX_OPEN_SETTING_SUCCESS'
export const WX_OPEN_SETTING_FAILURE = 'WX_OPEN_SETTING_FAILURE'

// 获取用户授权
export const authorize = createAction(WX_AUTHORIZE);

// 获取用户授权成功
export const authorizeSuccess = createAction(WX_AUTHORIZE_SUCCESS);

// 获取用户授权失败
export const authorizeFailure = createAction(WX_AUTHORIZE_FAILURE);

// 调起客户端小程序设置界面，返回用户设置的操作结果
export const openSetting = createAction(WX_OPEN_SETTING);

// 调起设置界面成功
export const openSettingSuccess = createAction(WX_OPEN_SETTING_SUCCESS);

// 调起设置界面失败
export const openSettingFailure = createAction(WX_OPEN_SETTING_FAILURE);
