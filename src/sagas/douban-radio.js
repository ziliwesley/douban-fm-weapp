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
} from '../redux/douban-radio.js';
import {
    stopPullDownRefresh
} from '../redux/wx-api.js';
import {
    showNavigationBarLoading,
    hideNavigationBarLoading
} from '../redux/wx-ui.js';

const { put, call, select } = effects;

/**
 * 获取豆瓣频道列表(分组)
 * @param  {string} token 授权 Token
 * @return {Promise}
 */
function requestChannelList(token) {
    const options = {
        method: 'GET',
        url: 'https://api.douban.com/v2/fm/app_channels?app_name=radio_android&apikey=02f7751a55066bcb08e65f4eff134361&user_accept_play_third_party=1&version=651&audio_patch_version=4'
    };

    if (token) {
        options.header = {
            'Content-Type': `Bearer ${token}`
        };
    }

    return request(options);
}

function requestPlaylist(token, channelId) {
    const options = {
        method: 'GET',
        url: `https://api.douban.com/v2/fm/playlist?apikey=02f7751a55066bcb08e65f4eff134361&max=30&channel=${channelId}&kbps=64&type=n&version=651&audio_patch_version=4&mode=offline&app_name=radio_android&user_accept_play_third_party=1&client=s%3Amobile%7Cv%3A4.6.11%7Cy%3Aandroid+5.1.1%7Cf%3A651%7Cm%3AOPPO%7Cd%3A7e91aa3bc63255a67f8907ec0e6a381c726fb34d%7Ce%3Aoneplus_one_e1001`
    };

    if (token) {
        options.header = {
            'Content-Type': `Bearer ${token}`
        };
    }

    return request(options);
}

export function* fetchChannelList() {
    try {
        const token = yield select(state => state.doubanAuth.accessToken);
        const active = yield select(state => state.doubanRadio.active);

        // 导航栏显示加载状态
        yield put(showNavigationBarLoading());

        const res = yield call(requestChannelList, token);
        const nextActive = active === -1 ? 0 : active;

        yield put(fetchChannelListSuccess(res));
        yield put(stopPullDownRefresh());
        // 自动切换频道
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
    try {
        const token = yield select(state => state.doubanAuth.accessToken);

        // 导航栏显示加载状态
        yield put(showNavigationBarLoading());

        const res = yield call(requestPlaylist, token, channelId);

        yield put(switchChannelSuccess(res.song, {
            id: channelId
        }));
    } catch (err) {
        yield put(switchChannelFailure(err));
    }

    // 导航栏结束加载状态
    yield put(hideNavigationBarLoading());
}

/**
 * 豆瓣电台相关 Watcher
 */
export default function* doubanRadioWatcher() {
    yield takeLatest(FETCH_CHANNEL_LIST, fetchChannelList);
    yield takeLatest(SWITCH_CHANNEL, switchChannelWorker);
}
