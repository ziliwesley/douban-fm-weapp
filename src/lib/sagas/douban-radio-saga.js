// src/lib/sagas/douban-radio-saga.js
import { takeLatest, put, call, take, race } from 'redux-saga/effects';

import { FETCH_CHANNEL_LIST, fetchChannelListSuccess, fetchChannelListFailure,
    fetchChannelListComplete, SWITCH_CHANNEL, switchChannelSuccess, switchChannelFailure,
    ADD_HEART, REMOVE_HEART, NEVER_PLAY, addHeartSuccess, addHeartFailure,
    removeHeartSuccess, removeHeartFailure, neverPlaySuccess, neverPlayFailure,
    NEVER_PLAY_SUCCESS, switchChannelComplete
} from '../actions/douban-radio-act.js';
import { updatePlaylist, UPDATE_PLAYLIST_SUCCESS, UPDATE_PLAYLIST_FAILURE,
    updatePlaylistSuccess, playNextSong, PLAY_NEXT_SONG_SUCCESS,
    PLAY_NEXT_SONG_FAILURE } from '../actions/playlist-act.js';
import { request } from '../helpers/saga-helpers.js';
import { getCurrentChannel } from './playlist-saga.js';

const DOUBAN_ACTION_TYPE = {
    HEART: 'r',
    UNHEART: 'u',
    NEVER_PLAY: 'b'
};

/**
 * 加载豆瓣电台频道 Saga Worker
 * @private
 * @listens {FETCH_CHANNEL_LIST}
 * @emits   {FETCH_CHANNEL_LIST_SUCCESS}
 * @emits   {FETCH_CHANNEL_LIST_FAILURE}
 * @emits   {FETCH_CHANNEL_LIST_COMPLETE}
 */
export function* fetchChannelListWorker() {
    try {
        const res = yield call(request, {
            url: 'https://api.douban.com/v2/fm/app_channels?app_name=radio_android&apikey=02f7751a55066bcb08e65f4eff134361&user_accept_play_third_party=1&version=651&audio_patch_version=4'
        });
        yield put(fetchChannelListSuccess(res));
    } catch (err) {
        yield put(fetchChannelListFailure(err));
    }
    yield put(fetchChannelListComplete());
}

/**
 * 切换豆瓣 MHz 频道
 * @private
 * @listens {SWITCH_CHANNEL}
 * @emits   {SWITCH_CHANNEL_SUCCESS}
 * @emits   {SWITCH_CHANNEL_FAILURE}
 * @emits   {SWITCH_CHANNEL_COMPLETE}
 * @param   {number} options.payload: channelId  频道 Id
 */
export function* switchChannelWorker({ payload: channelId }) {    
    // 自动更新播放列表
    yield put(updatePlaylist(channelId));

    // 等待结果
    const { sucd, fail } = yield race({
        sucd: take(UPDATE_PLAYLIST_SUCCESS),
        fail: take(UPDATE_PLAYLIST_FAILURE)
    });

    if (sucd) {
        // 播放下一首歌曲
        yield put(playNextSong());

        // 等待结果
        const { playSucd, playFail } = yield race({
            playSucd: take(PLAY_NEXT_SONG_SUCCESS),
            playFail: take(PLAY_NEXT_SONG_FAILURE)
        });

        if (playSucd) {
            yield put(switchChannelSuccess());
        } else {
            yield put(switchChannelFailure(playFail));
        }
    } else {
        yield put(switchChannelFailure(fail));
    }

    yield put(switchChannelComplete());
}

/**
 * 返回对应歌曲操作上报操作 Saga Worker
 * @private
 * @param  {string}     type                 操作类型
 * @param  {Function}   successActionCreator 成功后 ActionCreator
 * @param  {Function}   failureActionCreator 失败后 ActionCreator
 * @return {function(opts: Object): Generator}
 */
export function createDoubanFeedbackWorker(type, successActionCreator, failureActionCreator) {
    return function* ({ payload: { songId, progress }}) {
        try {
            const { id } = yield call(getCurrentChannel);

            const res = yield call(request, {
                method: 'GET',
                url: `https://api.douban.com/v2/fm/playlist?formats=null&pt=${progress.toFixed(3)}&apikey=02f7751a55066bcb08e65f4eff134361&channel=${id}&kbps=64&type=${type}&version=651&sid=${songId}&audio_patch_version=4&app_name=radio_android&pb=64&user_accept_play_third_party=1&client=s%3Amobile%7Cv%3A4.6.11%7Cy%3Aandroid+5.1.1%7Cf%3A651%7Cm%3AOPPO%7Cd%3A7e91aa3bc63255a67f8907ec0e6a381c726fb34d%7Ce%3Aoneplus_one_e1001`
            });

            // 需要更新播放列表
            if (res.song && res.song.length) {
                yield put(updatePlaylistSuccess(res.song));
            }

            yield put(successActionCreator(res));
        } catch (err) {
            yield put(failureActionCreator(err));
        }
    }
}

/**
 * 不再播放歌曲上报完毕后自动播放新的下一首歌曲
 * @listens {NEVER_PLAY_SUCCESS}
 */
export function* afterNeverPlayWorker() {
    yield put(playNextSong());
}

/**
 * 加为红心 Saga Worker
 * @private
 * @listens {ADD_HEART}
 * @emits   {ADD_HEART_SUCCESS}
 * @emits   {ADD_HEART_FAILURE}
 */
const addHeartWorker = createDoubanFeedbackWorker(
    DOUBAN_ACTION_TYPE.HEART,
    addHeartSuccess,
    addHeartFailure
);

/**
 * 取消红心 Saga Worker
 * @private
 * @listens {REMOVE_HEART}
 * @emits   {REMOVE_HEART_SUCCESS}
 * @emits   {REMOVE_HEART_FAILURE}
 */
const removeHeartWorker = createDoubanFeedbackWorker(
    DOUBAN_ACTION_TYPE.UNHEART,
    removeHeartSuccess,
    removeHeartFailure
);

/**
 * 不再播放 Saga Worker
 * @private
 * @listens {NEVER_PLAY}
 * @emits   {NEVER_PLAY_SUCCESS}
 * @emits   {NEVER_PLAY_FAILURE}
 */
const neverPlayWorker = createDoubanFeedbackWorker(
    DOUBAN_ACTION_TYPE.NEVER_PLAY,
    neverPlaySuccess,
    neverPlayFailure
);

/**
 * 豆瓣电台相关 Watcher
 * @protected
 */
export default function* doubanRadioWatcher() {
    yield takeLatest(FETCH_CHANNEL_LIST, fetchChannelListWorker);
    yield takeLatest(SWITCH_CHANNEL, switchChannelWorker);
    yield takeLatest(ADD_HEART, addHeartWorker);
    yield takeLatest(REMOVE_HEART, removeHeartWorker);
    yield takeLatest(NEVER_PLAY, neverPlayWorker);
    yield takeLatest(NEVER_PLAY_SUCCESS, afterNeverPlayWorker);
}
