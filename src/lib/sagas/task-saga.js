// src/lib/sagas/task-saga.js
import { takeLatest, put, select, call } from 'redux-saga/effects';

import wx from '../wx.js';
import {
    UPDATE_PLAY_STATE, updatePlayStateSuccess, updatePlayStateFailure
} from '../actions/task-act.js';

import { PLAYER_STATUS } from '../reducer/play-state-reducer.js';

/**
 * 更新微信后台歌曲播放状态 Saga Worker
 * @private
 * @listen {UPDATE_PLAY_STATE}
 * @emits  {UPDATE_PLAY_STATE_SUCCESS}
 * @emits  {UPDATE_PLAY_STATE_FAILURE}
 */
export function* updatePlayStateWorker() {
    try {
        const {
            currentPosition: current,
            duration,
            status
        } = yield call(wx.getBackgroundAudioPlayerState);

        const previousPlayState = yield select(state => state.playState);

        // Avoid identical actions being dispatched multiple times
        if (current === previousPlayState.current &&
            duration === previousPlayState.duration &&
            status === previousPlayState.status) {
            return;
        }

        // Calculate information for component rendering
        const isPlaying = status === PLAYER_STATUS.PLAYING;
        const percentage = current / duration;
        const degree = percentage * 360;
        const rightRotate = degree > 180 ?
            45 : degree - 135;
        const leftRotate = degree > 180 ?
            degree - 180 - 135 : -135;

        yield put(updatePlayStateSuccess({
            current,
            duration,
            status,
            isPlaying,
            leftRotate,
            rightRotate
        }));
    } catch (err) {
        console.error('Unable to get playState of wx background audio player', err);
        yield put(updatePlayStateFailure(err));
    }
}

/**
 * 任务 Saga Watcher
 * @protected
 */
export default function* taskWatcher() {
    yield takeLatest(UPDATE_PLAY_STATE, updatePlayStateWorker);
}
