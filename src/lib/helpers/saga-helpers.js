// src/lib/helpers/saga-helpers.js
import { call, select } from 'redux-saga/effects';

import wx from '../wx.js';
import requestUtil from '../utils/request.js';

/**
 * 针对 Redux Saga 封装后的 HTTP 请求 Helper 方法
 * @public
 * @param {Object}    options.header HTTP 请求头
 * @param {Object}    restOpts       其他请求选项
 */
export function* request({
    url,
    header = {},
    ...restOpts
}) {
    const { accessToken: token, userId } = yield select(state => state.doubanAuth);

    if (userId) {
        url += `&user_id=${userId}`;
    }

    if (token) {
        header['Authorization'] = `Bearer ${token}`;
    }

    const res = yield call(requestUtil, {
        ...restOpts,
        url,
        header
    });

    return res;
}

/**
 * 转换返回 Promise 的 Function => Saga Helper
 * ```js
 * // 不关心结果
 * yiled fork(showModal, opts);
 * // 关心结果
 * const { sucd, fail } = yiled fork(showModal, opts);
 * ```
 * @private
 * @param  {function(opts: Object): Promise} asyncFn
 * @return {function(opts: Object): Generator}
 */
export function transformAsyncFn(asyncFn) {
    return function* sagaHelper(opts) {
        try {
            const resp = yield call(asyncFn, opts);
            return { sucd: resp };
        } catch (rejection) {
            return { fail: rejection }
        }
    };
}

/**
 * 调用 wx.playBackgroundAudio 后台播放歌曲
 * @public
 */
export const playBackgroundAudio = transformAsyncFn(wx.playBackgroundAudio);

/**
 * 调用 wx.showToast 显示消息提示框
 * @public
 */
export const showToast = transformAsyncFn(wx.showToast);

/**
 * 调用 wx.showLoading 显示 loading 提示框
 * @public
 */
export const showLoading = transformAsyncFn(wx.showLoading);

/**
 * 跳转页面
 * @public
 */
export const navigateTo = transformAsyncFn(wx.navigateTo);

/**
 * 返回
 * @public
 */
export const navigateBack = transformAsyncFn(wx.navigateBack);

/**
 * 页面切换
 * @public
 */
export const redirectTo = transformAsyncFn(wx.redirectTo);

