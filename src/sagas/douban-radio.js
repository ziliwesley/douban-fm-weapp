import { takeLatest, effects } from 'redux-saga';

import request from '../utils/douban-request.js';
import {
    FETCH_CHANNEL_LIST,
    fetchChannelListSuccess,
    fetchChannelListFailure,
    SWITCH_CHANNEL,
    switchChannel,
    switchChannelSuccess,
    switchChannelFailure,
    ADD_HEART,
    REMOVE_HEART,
    NEVER_PLAY,
    addHeartSuccess,
    addHeartFailure,
    removeHeartSuccess,
    removeHeartFailure,
    neverPlaySuccess,
    neverPlayFailure
} from '../redux/douban-radio.js';
import {
    updatePlaylist,
    playNextSong,
    UPDATE_PLAYLIST_SUCCESS,
    UPDATE_PLAYLIST_FAILURE,
    PLAY_NEXT_SONG_SUCCESS,
    PLAY_NEXT_SONG_FAILURE
} from '../redux/player.js';
import {
    stopPullDownRefresh
} from '../redux/wx-api.js';
import {
    showNavigationBarLoading,
    hideNavigationBarLoading
} from '../redux/wx-ui.js';

const { put, call, select, take, race } = effects;
const DOUBAN_ACTION_TYPE = {
    HEART: 'r',
    UNHEART: 'u',
    NEVER_PLAY: 'b'
};

/**
 * 获取豆瓣频道列表(分组)
 * @param  {string} token    授权 Token
 * @param  {string} userId   用户 Id
 * @return {Promise}
 */
function fetchChannelList(token, userId) {
    const options = {
        method: 'GET',
        url: 'https://api.douban.com/v2/fm/app_channels?app_name=radio_android&apikey=02f7751a55066bcb08e65f4eff134361&user_accept_play_third_party=1&version=651&audio_patch_version=4'
    };

    if (userId) {
        options.url += `&user_id=${userId}`;
    }

    if (token) {
        options.header = {
            'Authorization': `Bearer ${token}`
        };
    }

    return request(options);
}

/**
 * 歌曲操作上报
 * @param  {string} token    授权 Token
 * @param  {string} userId   用户 Id
 * @param  {string} type     操作类型
 * @param  {string} songId   歌曲 Id
 * @param  {number} progress 0 到 100 之间浮点数, 代表播放进度
 * @return {Promise}
 */
function uploadDoubanFeedback(token, userId, songId, type, progress) {
    const options = {
        method: 'GET',
        url: `https://api.douban.com/v2/fm/playlist?formats=null&pt=${progress.toFixed(3)}&apikey=02f7751a55066bcb08e65f4eff134361&channel=-10&kbps=64&type=${type}&version=651&sid=${songId}&audio_patch_version=4&app_name=radio_android&pb=64&user_accept_play_third_party=1&client=s%3Amobile%7Cv%3A4.6.11%7Cy%3Aandroid+5.1.1%7Cf%3A651%7Cm%3AOPPO%7Cd%3A7e91aa3bc63255a67f8907ec0e6a381c726fb34d%7Ce%3Aoneplus_one_e1001`
    }

    if (userId) {
        options.url += `&user_id=${userId}`;
    }

    if (token) {
        options.header = {
            'Authorization': `Bearer ${token}`
        };
    }

    return request(options);
}

export function* fetchChannelListWorker() {
    try {
        const { accessToken: token, userId } = yield select(state => state.doubanAuth);
        const active = yield select(state => state.doubanRadio.active);

        // 导航栏显示加载状态
        yield put(showNavigationBarLoading());

        const res = yield call(fetchChannelList, token, userId);
        const nextActive = active === -1 ? 0 : active;

        yield put(fetchChannelListSuccess(res));
        yield put(stopPullDownRefresh());
        // 自动切换频道
        // TODO
        // Check if the channelId is still a valid one
        yield put(switchChannel(nextActive));
    } catch (err) {
        yield put(fetchChannelListFailure(err));
    }

    // 导航栏结束加载状态
    yield put(hideNavigationBarLoading());
}

/**
 * 切换豆瓣 MHz 频道
 * @param {number} options.payload: channelId  频道 Id
 */
export function* switchChannelWorker({ payload: channelId }) {
    // 导航栏显示加载状态
    yield put(showNavigationBarLoading());
    
    // 自动更新播放列表
    yield put(updatePlaylist(channelId));

    // 等待结果
    const { updateSuccess, updateError } = yield race({
        updateSuccess: take(UPDATE_PLAYLIST_SUCCESS),
        updateError: take(UPDATE_PLAYLIST_FAILURE)
    });

    if (updateSuccess) {
        // 播放下一首歌曲
        yield put(playNextSong());

        // 等待结果
        const { playSuccess, playError } = yield race({
            playSuccess: take(PLAY_NEXT_SONG_SUCCESS),
            playError: take(PLAY_NEXT_SONG_FAILURE)
        });

        if (playSuccess) {
            yield put(switchChannelSuccess());
        } else {
            yield put(switchChannelFailure(playError));
        }
    } else {
        yield put(switchChannelFailure(updateError));
    }

    // 导航栏结束加载状态
    yield put(hideNavigationBarLoading());
}

/**
 * 返回对应歌曲操作上报操作 Worker
 * @param  {string} type  操作类型
 * @return {GeneratorFunction}
 */
/**
 * 返回对应歌曲操作上报操作 Worker
 * @param  {string}     type                 操作类型
 * @param  {Function}   successActionCreator 成功后 ActionCreator
 * @param  {Function}   failureActionCreator 失败后 ActionCreator
 * @return {GeneratorFunction}
 */
export function createDoubanFeedbackWorker(type, successActionCreator, failureActionCreator) {
    return function* ({ payload: { songId, progress }}) {
        try {
            const { accessToken: token, userId } = yield select(state => state.doubanAuth);

            const res = yield call(uploadDoubanFeedback, token, userId, songId, type, progress);
            yield put(successActionCreator(res));
        } catch (err) {
            yield put(failureActionCreator(err));
        }
    }
}

/**
 * 豆瓣电台相关 Watcher
 */
export default function* doubanRadioWatcher() {
    yield takeLatest(FETCH_CHANNEL_LIST, fetchChannelListWorker);
    yield takeLatest(SWITCH_CHANNEL, switchChannelWorker);
    yield takeLatest(ADD_HEART, createDoubanFeedbackWorker(
        DOUBAN_ACTION_TYPE.HEART,
        addHeartSuccess,
        addHeartFailure
    ));
    yield takeLatest(REMOVE_HEART, createDoubanFeedbackWorker(
        DOUBAN_ACTION_TYPE.UNHEART,
        removeHeartSuccess,
        removeHeartFailure
    ));
    yield takeLatest(NEVER_PLAY, createDoubanFeedbackWorker(
        DOUBAN_ACTION_TYPE.NEVER_PLAY,
        neverPlaySuccess,
        neverPlayFailure
    ));
}
