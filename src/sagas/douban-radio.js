import { takeLatest, effects } from 'redux-saga';

import request from '../utils/douban-request.js';
import {
    FETCH_CHANNEL_LIST,
    fetchChannelListSuccess,
    fetchChannelListFailure,
} from '../redux/douban-radio.js';
import {
    stopPullDownRefresh
} from '../redux/wx-api.js';

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

export function* fetchChannelList() {
    try {
        const token = yield select(state => state.doubanAuth.accessToken);
        const res = yield call(requestChannelList);

        yield put(fetchChannelListSuccess(res));
        yield put(stopPullDownRefresh());
    } catch (err) {
        yield put(fetchChannelListFailure(err));
    }
}

/**
 * 豆瓣电台相关 Watcher
 */
export default function* doubanRadioWatcher() {
    yield takeLatest(FETCH_CHANNEL_LIST, fetchChannelList);
}
