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

/**
 * 获取豆瓣频道列表(分组)
 * @param  {string} token 授权 Token
 * @return {Promise}
 */
function fetchChannelList(token) {
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

export function* fetchChannelListWorker() {
    try {
        const token = yield select(state => state.doubanAuth.accessToken);
        const active = yield select(state => state.doubanRadio.active);

        // 导航栏显示加载状态
        yield put(showNavigationBarLoading());

        const res = yield call(fetchChannelList, token);
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
 * 豆瓣电台相关 Watcher
 */
export default function* doubanRadioWatcher() {
    yield takeLatest(FETCH_CHANNEL_LIST, fetchChannelListWorker);
    yield takeLatest(SWITCH_CHANNEL, switchChannelWorker);
}
