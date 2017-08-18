// src/lib/sagas/player-saga.js
import { effects, eventChannel } from 'redux-saga';

import wx from '../wx.js';
import { STOP_MUSIC, playMusic, pauseMusic, stopMusic } from '../actions/player-act.js';
import { playNextSong } from '../actions/playlist-act.js';

const { takeLatest, put, call } = effects;

/**
 * 监听微信播放器播放状态
 * e.g. 播放/暂停/停止
 * @private
 * @return {EventChannel}
 */
export function createPlayStateEvtChannel() {
    return eventChannel(emitter => {
        wx.onBackgroundAudioPlay(res => {
            emitter(playMusic(res));
        });

        wx.onBackgroundAudioPause(res => {
            emitter(pauseMusic(res))
        });

        wx.onBackgroundAudioStop(res => {
            emitter(stopMusic(res))
        });

        return () => {
            console.log('createPlayStateEvtChannel() unregistered');
        }
    });
}


/**
 * 自动播放 Saga Worker
 * @private
 * @listens {STOP_MUSIC}
 */
export function* autoPlayWorker() {
    try {
        const playState = yield call(wx.getBackgroundAudioPlayerState);
        if (playState.duration === playState.currentPosition &&
            playState.duration !== undefined) {
            yield put(playNextSong());
        }
    } catch (err) {
        console.error(err);
    }
}

/**
 * 播放器相关 Watcher
 * @protected
 */
export default function* doubanRadioWatcher() {
    // 通过 saga 重新分发事件
    function* redispatch(action) {
        yield put(action);
    }

    const evtChannel = createPlayStateEvtChannel(); 

    yield takeLatest(STOP_MUSIC, autoPlayWorker);
    yield takeLatest(evtChannel, redispatch);
}
