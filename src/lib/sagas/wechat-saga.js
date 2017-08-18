// src/lib/sagas/wechat-saga.js
import { takeLatest, put, call } from 'redux-saga/effects';

import wx from '../wx.js';
import { WX_OPEN_SETTING, wxOpenSettingSuccess, wxOpenSettingFailure,
    wxAuthorizeSuccess, wxAuthorizeFailure, WX_GET_USER_INFO,
    wxGetUserInfoSuccess, wxGetUserInfoFailure, WX_CLEAR_STORAGE } from '../actions/wechat-act.js';

/**
 * 检验当前是否已获得授权
 * @private
 * @param {string} scope          权限域
 * @yield {boolean}
 */
export function* isAuthorized(scope) {
    try {
        const settings = yield call(wx.getSetting);
        return settings.authSetting[scope];
    } catch (err) {
        return false;
    }
}

/**
 * 获取用户授权
 * @protected
 * @emits {WX_AUTHORIZE_SUCCESS}
 * @emits {WX_AUTHORIZE_FAILURE}
 * @param {string} scope 请求的权限
 */
export function* authorize(scope) {
    const isAlreadyAuthorized = yield call(isAuthorized, scope);

    if (isAlreadyAuthorized) {
        yield put(wxAuthorizeSuccess({
            alreadyAuthorized: true,
            scope
        }));
        return;
    }

    try {
        yield call(wx.authorize, { scope });
        yield put(wxAuthorizeSuccess({ scope }));
    } catch (err) {
        yield put(wxAuthorizeFailure());
    }
}

/**
 * 调起设置界面 Worker
 * @private
 * @listens {WX_OPEN_SETTING}
 * @emits   {WX_OPEN_SETTING_SUCCESS}
 * @emits   {WX_OPEN_SETTING_FAILURE}
 */
export function* wxOpenSettingWorker() {
    try {
        const res = yield call(wx.openSetting);
        yield put(wxOpenSettingSuccess(res.authSetting));
    } catch (err) {
        yield put(wxOpenSettingFailure());
    }
}

/**
 * 获取用户信息 Saga Worker
 * @private
 * @listens {WX_GET_USER_INFO}
 * @emits   {WX_GET_USER_INFO_SUCCESS}
 * @emits   {WX_GET_USER_INFO_FAILURE}
 */
export function* wxGetUserInfoWorker() {
    try {
        yield call(authorize, 'scope.userInfo');
        const res = yield call(wx.getUserInfo);
        yield put(wxGetUserInfoSuccess(res.userInfo));
    } catch (err) {
        yield put(wxGetUserInfoFailure());
    }
}

/**
 * 清理本地数据缓存 Saga Worker
 * @private
 * @listens {WX_CLEAR_STORAGE}
 */
export function* wxClearStorageWorker() {
    yield call(wx.clearStorageSync);
    yield call(wx.reLaunch, {
        url: 'entry'
    });
}

/**
 * 微信 API Saga Watcher
 * @protected
 */
export default function* wechatWatcher() {
    yield takeLatest(WX_OPEN_SETTING, wxOpenSettingWorker);
    yield takeLatest(WX_GET_USER_INFO, wxGetUserInfoWorker);
    yield takeLatest(WX_CLEAR_STORAGE, wxClearStorageWorker)
}
