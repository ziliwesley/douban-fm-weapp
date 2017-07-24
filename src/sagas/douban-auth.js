import { takeLatest, effects } from 'redux-saga';

import { showToast, navigateTo } from '../redux/wx-ui.js';
import request from '../utils/douban-request.js';

const { put, call } = effects;

import {
    DOUBAN_LOGIN,
    loginDoubanSuccess,
    loginDoubanFailure,
} from '../redux/douban-auth.js';

/**
 * 请求豆瓣登录 [POST]
 * @param  {string} username 豆瓣登录帐号(手机号/邮箱/用户名)
 * @param  {string} password 豆瓣登录密码
 * @return {Promise}
 */
function requestDoubanAuth(username, password) {
    return request({
        method: 'POST',
        url: 'https://www.douban.com/service/auth2/token',
        data: {
            'client_id': '02f7751a55066bcb08e65f4eff134361',
            'client_secret': '63cf04ebd7b0ff3b',
            'redirect_uri': 'http://douban.fm',
            'grant_type': 'password',
            username,
            password
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

/**
 * 登录豆瓣帐号 Worker
 * @param {string} action.payload.username 豆瓣登录帐号(手机号/邮箱/用户名)
 * @param {string} action.payload.password 豆瓣登录密码
 */
export function* loginDouban({ payload: { username, password } }) {
    try {
        const res = yield call(
            requestDoubanAuth,
            username,
            password);

        yield put(loginDoubanSuccess(res, {
            loginName: username
        }));

        yield put(showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
        }));
        // 返回首页
        yield put(navigateTo('entry'));
    } catch (err) {
        yield put(loginDoubanFailure(err));

        yield put(showToast({
            title: '登录豆瓣账户失败',
            icon: 'fail',
            duration: 1500
        }));
    }
}

/**
 * 豆瓣授权相关 Watcher
 */
export default function* doubanAuthWatcher() {
    yield takeLatest(DOUBAN_LOGIN, loginDouban);
}
