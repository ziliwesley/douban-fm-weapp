import { fork, all } from 'redux-saga/effects';

import appWatcher from './app-saga.js';
import doubanAuthWatcher from './douban-auth-saga.js';
import doubanRadioWatcher from './douban-radio-saga.js';
import playListWatcher from './playlist-saga.js';
import wechatWatcher from './wechat-saga.js';
import playerWatcher from './player-saga.js';
import schedulerWatcher from './scheduler-saga.js';
import taskWatcher from './task-saga.js';

// 当action触发时，执行特定saga
export default function* root() {
    yield all([
        fork(appWatcher),
        fork(doubanAuthWatcher),
        fork(doubanRadioWatcher),
        fork(playListWatcher),
        fork(wechatWatcher),
        fork(playerWatcher),
        fork(schedulerWatcher),
        fork(taskWatcher)
    ]);
}
