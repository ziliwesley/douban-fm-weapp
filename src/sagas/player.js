import wx from 'labrador-immutable';
import { takeLatest, effects } from 'redux-saga';

import request from '../utils/douban-request.js';
import {
    playNextSongSuccess,
    playNextSongFailure,
    updatePlaylist,
    updatePlaylistSuccess,
    updatePlaylistFailure,
    PLAY_NEXT_SONG,
    UPDATE_PLAYLIST,
    UPDATE_PLAYLIST_SUCCESS,
    UPDATE_PLAYLIST_FAILURE
} from '../redux/player.js';
import {
    fetchNextPlaylist
} from './douban-radio.js';

const { put, call, select, take, race } = effects;

function fetchPlaylist(token, channelId) {
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

/**
 * 刷新播放列表
 * @param {number} options.payload: channelId  频道 Id
 */
export function* updatePlaylistWorker({ payload: channelId }) {
    try {
        const token = yield select(state => state.doubanAuth.accessToken);
        const res = yield call(fetchPlaylist, token, channelId);
        yield put(updatePlaylistSuccess(res.song));
    } catch (err) {
        yield put(updatePlaylistFailure(err));
    }
}

export function* playNextSongWorker() {
    const { current, playlist, next } = yield select(state => state.player);
    let theOneAfterNext = next + 1;

    if (next >= playlist.length) {
        // 已经全部播放完毕
        console.error('播放列表播放完毕');
        yield put(playNextSongFailure());

        return;
    }

    try {
        const song = playlist[next];

        yield call(wx.playBackgroundAudio, {
            dataUrl: song.url,
            title: song.title,
            coverImgUrl: song.cover
        });

        // 预载下一首歌曲资源
        if (theOneAfterNext >= playlist.length) {
            // 当前播放列表即将播放完毕, 加载新的播放列表
            console.log('prepare next songlist');
            const channelId = yield select(state => state.doubanRadio.active);

            yield put(updatePlaylist(channelId));

            // 等待加载结果
            const { success, error } = yield race({
                success: take(UPDATE_PLAYLIST_SUCCESS),
                error: take(UPDATE_PLAYLIST_FAILURE)
            });

            if (success) {
                yield put(playNextSongSuccess({
                    // 重新指向列表首位
                    next: 0,
                    current: next,
                    playing: song
                }));
            } else {
                console.error('无法加载新播放列表');
                console.error(error);

                yield put(playNextSongSuccess({
                    // 无法改变 next, 当前歌曲播放完毕后停止
                    next,
                    current: next,
                    playing: song
                }));
            }
        } else {
            yield put(playNextSongSuccess({
                next: theOneAfterNext,
                current: next,
                playing: song
            }));
        }
    } catch (err) {
        console.error('播放歌曲失败');
        console.error(err);
        yield put(playNextSongFailure(err));
    }
}

export function* playMusicWorker({ url, cover, title }) {
    try {
        yield call(wx.playBackgroundAudio, {
            dataUrl: url,
            title,
            coverImgUrl: cover
        });

        console.log('success');
    } catch (err) {
        console.log(err);
    }
}

/**
 * 播放器相关 Watcher
 */
export default function* doubanRadioWatcher() {
    yield takeLatest(PLAY_NEXT_SONG, playNextSongWorker);
    yield takeLatest(UPDATE_PLAYLIST, updatePlaylistWorker)
}
