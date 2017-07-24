import { fork } from 'redux-saga/effects';

import doubanAuthWatcher from './douban-auth.js';
import wxAPIWatcher from './wx-api.js';

// 当action触发时，执行特定saga
export default function* root() {
    yield [
        fork(doubanAuthWatcher),
        fork(wxAPIWatcher)
    ];
}
