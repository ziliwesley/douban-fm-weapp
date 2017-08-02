import { effects } from 'redux-saga';

import { fetchChannelList } from '../actions/douban-radio.js';

const { put } = effects;

export function* startup() {
    yield put(fetchChannelList());
}

/**
 * 启动事件 Watcher
 */
export default function* doubanRadioWatcher() {
    // yield takeLatest('STARTUP', startup);
}
