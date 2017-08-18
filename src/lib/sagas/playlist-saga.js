// src/lib/sagas/playlist-saga.js
import { takeLatest, put, call, select, take, race, fork } from 'redux-saga/effects';

import { UPDATE_PLAYLIST, UPDATE_PLAYLIST_SUCCESS, UPDATE_PLAYLIST_FAILURE,
    updatePlaylist, updatePlaylistSuccess, updatePlaylistFailure,
    PLAY_NEXT_SONG, playNextSongSuccess, playNextSongFailure } from '../actions/playlist-act.js';
import { changeSong } from '../actions/player-act.js';
import { request, playBackgroundAudio } from '../helpers/saga-helpers.js';

/**
 * 获取当前所在频道信息
 * @private
 */
export function* getCurrentChannel() {
    const { active, channelGroups } = yield select(state => state.doubanRadio);

    for (let i = 0; i < channelGroups.length; i++) {
        let group = channelGroups[i];

        for (let j = 0; j < group.chls.length; j++) {
            let channel = group.chls[j];

            if (channel.id === active) {
                return channel;
            }
        }
    }

    return {
        name: '',
        id: active
    };
}


/**
 * 播放下一首歌曲 Saga Worker
 * @private
 * @listen {PLAY_NEXT_SONG}
 * @emits  {PLAY_NEXT_SONG_SUCCESS}
 * @emits  {PLAY_NEXT_SONG_FAILURE}
 */
export function* playNextSongWorker() {
    const { list, next } = yield select(state => state.playlist);
    let theOneAfterNext = next + 1;

    if (next >= list.length) {
        // 已经全部播放完毕
        console.error('播放列表已播放完毕');
        yield put(playNextSongFailure());

        return;
    }

    try {
        const song = list[next];
        const channel = yield call(getCurrentChannel);

        song.channelName = `${channel.name} MHz`;
        song.channelId = channel.id;

        // 更新将要播放的歌曲
        yield put(changeSong(song));
        yield fork(playBackgroundAudio, {
            dataUrl: song.url,
            title: song.title,
            coverImgUrl: song.cover
        });

        // 预载下一首歌曲资源
        if (theOneAfterNext >= list.length) {
            // 当前播放列表即将播放完毕, 加载新的播放列表
            console.log('prepare next songlist');
            yield put(updatePlaylist(channel.id));

            // 等待加载结果
            const { success, error } = yield race({
                success: take(UPDATE_PLAYLIST_SUCCESS),
                error: take(UPDATE_PLAYLIST_FAILURE)
            });

            if (success) {
                // 重新指向列表首位
                yield put(playNextSongSuccess(0));
            } else {
                console.error('无法加载新的播放列表', error);
                // 无法改变 next, 当前歌曲播放完毕后停止
                yield put(playNextSongSuccess(next));
            }
        } else {
            yield put(playNextSongSuccess(theOneAfterNext));
        }
    } catch (err) {
        console.error('播放歌曲失败', err);
        yield put(playNextSongFailure(err));
    }
}

/**
 * 刷新播放列表 Saga Worker
 * @private
 * @listen {UPDATE_PLAYLIST}
 * @emits  {UPDATE_PLAYLIST_SUCCESS}
 * @emits  {UPDATE_PLAYLIST_FAILURE}
 * @param  {number} options.payload: channelId  频道 Id
 */
export function* updatePlaylistWorker({ payload: channelId }) {
    try {
        const res = yield call(request, {
            url: `https://api.douban.com/v2/fm/playlist?apikey=02f7751a55066bcb08e65f4eff134361&max=30&channel=${channelId}&kbps=64&type=n&version=651&audio_patch_version=4&mode=offline&app_name=radio_android&user_accept_play_third_party=1&client=s%3Amobile%7Cv%3A4.6.11%7Cy%3Aandroid+5.1.1%7Cf%3A651%7Cm%3AOPPO%7Cd%3A7e91aa3bc63255a67f8907ec0e6a381c726fb34d%7Ce%3Aoneplus_one_e1001`
        });
        yield put(updatePlaylistSuccess(res.song));
    } catch (err) {
        yield put(updatePlaylistFailure(err));
    }
}

/**
 * 播放列表相关 Watcher
 */
export default function* playListWatcher() {
    yield takeLatest(PLAY_NEXT_SONG, playNextSongWorker);
    yield takeLatest(UPDATE_PLAYLIST, updatePlaylistWorker);
}
