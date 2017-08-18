// src/lib/sagas/scheduler-saga.js
import { delay, effects } from 'redux-saga';

import { SCHEDULER_START, SCHEDULER_STOP } from '../actions/scheduler-act.js';
import { updatePlayState } from '../actions/task-act.js';

const { take, race, put, select } = effects;

/**
 * 定期任务调度
 * @protected
 * @listens {SCHEDULER_START}
 * @listens {SCHEDULER_STOP}
 */
export default function* scheduler() {
    let counter = 0;
    while (yield take(SCHEDULER_START)) {
        while (true) {
            counter += 1;

            const { end } = yield race({
                tick: delay(1000),
                end: take(SCHEDULER_STOP)
            });

            if (end) {
                // 暂停
                break;
            }

            const { ready, reloading } = yield select(state => state.app);

            // Dispatch tasks at every specific ticks
            // Every second
            // --------------------------------------------------
            if (ready && !reloading) {
                yield put(updatePlayState());
            }
        }
    }
}
