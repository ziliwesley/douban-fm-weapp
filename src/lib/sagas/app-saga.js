// src/lib/sagas/app-saga.js
import { takeLatest, put, take, fork, call } from 'redux-saga/effects';

import wx from '../wx.js';
import { RELOAD, reload, reloadComplete, appReady,
    APP_START, RELOAD_COMPLETE } from '../actions/app-act.js';
import { fetchChannelList, FETCH_CHANNEL_LIST_COMPLETE, switchChannel,
    SWITCH_CHANNEL_COMPLETE } from '../actions/douban-radio-act.js'

/**
 * 程序启动任务
 * (应只会执行一次)
 * @private
 * @listens {APP_START}
 * @emits   {APP_READY}
 */
export function* startupWorker() {
    // 首次数据加载
    yield put(reload());

    yield take(RELOAD_COMPLETE);

    // 触发 [APP_READY]
    yield put(appReady());
}

/**
 * 数据重新载入任务 [RELOAD]
 * @private
 * @listens {RELOAD}
 * @emits   {RELOAD_COMPLETE}
 */
export function* reloadWorker() {
    // 同一时间只有一个 Reload "Thread" 触发
    while (yield take(RELOAD)) {
        yield call(wx.showNavigationBarLoading);

        // 更新频道列表
        yield put(fetchChannelList());
        // 等待加载完毕
        yield take(FETCH_CHANNEL_LIST_COMPLETE);

        // 自动切换频道
        yield put(switchChannel(0));
        // 等待切换完毕
        yield take(SWITCH_CHANNEL_COMPLETE);

        yield call(wx.hideNavigationBarLoading);

        yield put(reloadComplete());
    }
}

/**
 * 监听程序生命周期相关事件
 * @protected
 */
export default function* appWatcher() {
    yield takeLatest(APP_START, startupWorker);
    yield fork(reloadWorker);
}
