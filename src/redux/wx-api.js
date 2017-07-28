import wx from 'labrador-immutable';
import { createAction } from 'redux-actions';

export const WX_AUTHORIZE = 'WX_AUTHORIZE';
export const WX_AUTHORIZE_SUCCESS = 'WX_AUTHORIZE_SUCCESS';
export const WX_AUTHORIZE_FAILURE = 'WX_AUTHORIZE_FAILURE';

export const WX_OPEN_SETTING = 'WX_OPEN_SETTING';
export const WX_OPEN_SETTING_SUCCESS = 'WX_OPEN_SETTING_SUCCESS';
export const WX_OPEN_SETTING_FAILURE = 'WX_OPEN_SETTING_FAILURE';

export const WX_CLEAR_STORAGE = 'WX_CLEAR_STORAGE';

export const WX_STOP_PULL_DOWN_REFRESH = 'WX_STOP_PULL_DOWN_REFRESH';

// 获取用户授权
export const authorize = createAction(WX_AUTHORIZE);
export const authorizeSuccess = createAction(WX_AUTHORIZE_SUCCESS);
export const authorizeFailure = createAction(WX_AUTHORIZE_FAILURE);

// 调起客户端小程序设置界面，返回用户设置的操作结果
export const openSetting = createAction(WX_OPEN_SETTING);
export const openSettingSuccess = createAction(WX_OPEN_SETTING_SUCCESS);
export const openSettingFailure = createAction(WX_OPEN_SETTING_FAILURE);

// 清理本地数据缓存
// TODO make a saga for this, and trigger global reset
export const clearStorage = createAction(WX_CLEAR_STORAGE, () => {
    wx.clearStorageSync();

    // NOTE This is actualy async
    wx.wx.reLaunch({
        url: 'entry'
    });
});

export const stopPullDownRefresh = createAction(WX_STOP_PULL_DOWN_REFRESH, () => {
    wx.stopPullDownRefresh();
});
