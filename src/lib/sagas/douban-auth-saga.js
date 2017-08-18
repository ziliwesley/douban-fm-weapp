// src/lib/sagas/douban-auth-saga.js
import { takeLatest, put, call, fork } from 'redux-saga/effects';

import { DOUBAN_LOGIN, loginDoubanSuccess, loginDoubanFailure } from '../actions/douban-auth-act.js';
import { reload } from '../actions/app-act.js';
import request from '../utils/request.js';
import { showToast, navigateBack } from '../helpers/saga-helpers.js';

/**
 * 登录豆瓣帐号 Saga Worker
 * @private
 * @listens {DOUBAN_LOGIN}
 * @emits   {DOUBAN_LOGIN_SUCCESS}
 * @emits   {DOUBAN_LOGIN_FAILURE}
 * @param   {string} action.payload.username 豆瓣登录帐号(手机号/邮箱/用户名)
 * @param   {string} action.payload.password 豆瓣登录密码
 */
export function* loginDouban({ payload: { username, password } }) {
    try {
        const res = yield call(request, {
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

        yield put(loginDoubanSuccess(res, {
            loginName: username
        }));

        yield fork(showToast, {
            title: '登录成功',
            icon: 'success',
            duration: 1500
        });
        yield put(reload());
        // 返回
        yield fork(navigateBack, {
            delta: 1
        });
    } catch (err) {
        yield put(loginDoubanFailure(err));

        yield fork(showToast, {
            title: '登录豆瓣账户失败',
            icon: 'fail',
            duration: 1500
        });
    }
}

/**
 * 豆瓣授权相关 Watcher
 * @protected
 */
export default function* doubanAuthWatcher() {
    yield takeLatest(DOUBAN_LOGIN, loginDouban);
}
