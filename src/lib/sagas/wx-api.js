import { takeLatest, put, call } from 'redux-saga/effects';
import wx from '../wx.js';

import {
    WX_AUTHORIZE,
    WX_OPEN_SETTING,
    authorizeSuccess,
    authorizeFailure,
    openSettingSuccess,
    openSettingFailure
} from '../actions/wx-api.js';

import {
    GET_USER_INFO,
    getUserInfoSuccess,
    getUserInfoFailure
} from '../actions/wx-auth.js';

/**
 * 检验当前是否已获得授权
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
 * 获取用户授权 Worker
 * @param {string} options.payload: scope 页面路径
 */
export function* authorize({ payload: scope }) {
    const isAlreadyAuthorized = yield call(isAuthorized, scope);

    if (isAlreadyAuthorized) {
        yield put(authorizeSuccess());
        return;
    }

    try {
        yield call(wx.authorize, { scope });
        yield put(authorizeSuccess());
    } catch (err) {
        yield put(authorizeFailure());
    }
}

/**
 * 获取用户信息 Worker
 */
export function* getUserInfo() {
    try {
        yield call(wx.authorize, { scope: 'scope.userInfo' });
        const res = yield call(wx.getUserInfo);
        yield put(getUserInfoSuccess(res.userInfo));
    } catch (err) {
        yield put(getUserInfoFailure());
    }
}

/**
 * 调起设置界面 Worker
 */
export function* openSetting() {
    try {
        const res = yield call(wx.openSetting);
        yield put(openSettingSuccess(res.authSetting));
    } catch (err) {
        yield put(openSettingFailure());
    }
}

export default function* wxAPIWatcher() {
    yield takeLatest(WX_AUTHORIZE, authorize);
    yield takeLatest(GET_USER_INFO, getUserInfo);
    yield takeLatest(WX_OPEN_SETTING, openSetting);
}
