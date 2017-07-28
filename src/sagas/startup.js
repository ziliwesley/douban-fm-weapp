import wx from 'labrador-immutable';
import { takeLatest, effects } from 'redux-saga';

import { fetchChannelList } from '../redux/douban-radio.js';

const { put, call } = effects;

export function* startup() {
    yield put(fetchChannelList());
}

/**
 * 启动事件 Watcher
 */
export default function* doubanRadioWatcher() {
    yield takeLatest('STARTUP', startup);
}
