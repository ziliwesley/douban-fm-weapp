import { fork } from 'redux-saga/effects';

import startupWatcher from './startup.js';
import doubanAuthWatcher from './douban-auth.js';
import doubanRadioWatcher from './douban-radio.js';
import wxAPIWatcher from './wx-api.js';
import playerWatcher from './player.js';

// 当action触发时，执行特定saga
export default function* root() {
    yield [
        fork(startupWatcher),
        fork(doubanAuthWatcher),
        fork(doubanRadioWatcher),
        fork(wxAPIWatcher),
        fork(playerWatcher)
    ];
}
