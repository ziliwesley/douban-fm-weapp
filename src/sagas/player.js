import wx from 'labrador-immutable';
import { takeLatest, takeEvery, effects, eventChannel, END } from 'redux-saga';

import request from '../utils/douban-request.js';
import {
    PLAYER_STATUS,
    PLAY_MUSIC,
    STOP_MUSIC,
    PAUSE_MUSIC,
    playMusic,
    pauseMusic,
    stopMusic,
    PLAY_PROGRESS_UPDATE,
    PLAY_PROGRESS_COMPLETE,
    playProgressUpdate,
    playProgressComplete,
    PLAY_NEXT_SONG,
    playNextSong,
    playNextSongSuccess,
    playNextSongFailure,
    updatePlaylist,
    updatePlaylistSuccess,
    updatePlaylistFailure,
    UPDATE_PLAYLIST,
    UPDATE_PLAYLIST_SUCCESS,
    UPDATE_PLAYLIST_FAILURE
} from '../redux/player.js';

const { put, call, select, take, race, cancel, fork } = effects;

const PLAY_STATE_CHECK_INTERVAL = 1000;

/**
 * 加载播放列表
 * @param  {string} token      豆瓣 accessToken
 * @param  {string} channelId  频道 Id
 * @return {Promise}
 */
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
 * 获取当前所在频道信息
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
 * 监听播放进度状态
 * e.g. 播放到第几秒, 是否下载完成
 * @return {EventChannel}
 */
function startListenPlayProgressChange() {
    return eventChannel(emitter => {
        const task = setInterval(() => {
            wx.getBackgroundAudioPlayerState()
                .then(res => {
                    const {
                        currentPosition: current,
                        duration,
                        status
                    } = res;
                    let actionCreator;

                    // 切换频道期间没有正在播放的歌曲
                    if (status === PLAYER_STATUS.IDLE) {
                        return;
                    }

                    if (duration === current) {
                        actionCreator = playProgressComplete;
                        clearInterval(task);
                    } else {
                        actionCreator = playProgressUpdate;
                    }

                    emitter(actionCreator({
                        current,
                        duration,
                        status
                    }));
                });
        }, PLAY_STATE_CHECK_INTERVAL);

        return () => {
            clearInterval(task);
            console.log('startListenPlayProgressChange() cancelled');
        }
    });
}

/**
 * 监听微信播放器播放状态
 * e.g. 播放/暂停/停止
 * @return {EventChannel}
 */
export function* startListenPlayerState() {
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
            console.log('startListenPlayerState() unregistered');
        }
    });
}

/**
 * 刷新播放列表 Saga Worker
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

/**
 * 播放下一首歌曲 Saga Worker
 */
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
        const channel = yield call(getCurrentChannel);

        song.channelName = `${channel.name} MHz`;
        song.channelId = channel.id;

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

/**
 * 自动播放 Saga Worker
 */
export function* autoPlayWorker() {
    try {
        const playState = yield call(wx.getBackgroundAudioPlayerState);
        if (playState.duration === playState.currentPosition &&
            playState.duration !== undefined) {
            console.log('autoplay');
            yield put(playNextSong());
        }
    } catch (err) {
        console.error(err);
    }
}

/**
 * 播放状态相关 Watcher
 */
export function* playStateWatcher() {

    // 通过 saga 重新分发事件
    function* redispatch(action) {
        yield put(action);
    }

    const playerStateEventChannel = yield call(startListenPlayerState);
    yield takeLatest(playerStateEventChannel, redispatch);

    while (true) {
        // Wait until music is playing
        yield take(PLAY_MUSIC);

        let activePlayStateEventChannel = yield call(startListenPlayProgressChange);
        let activeWatcherTask = yield takeEvery(activePlayStateEventChannel, redispatch);

        // Wait untill music is paused
        yield take([PAUSE_MUSIC, STOP_MUSIC]);

        activePlayStateEventChannel.close();
        yield cancel(activeWatcherTask);

        // These should be optional
        // activeWatcherTask = null;
        // activePlayStateEventChannel = null;
    }
}

/**
 * 播放器相关 Watcher
 */
export default function* doubanRadioWatcher() {
    yield takeLatest(PLAY_NEXT_SONG, playNextSongWorker);
    yield takeLatest(UPDATE_PLAYLIST, updatePlaylistWorker);
    yield takeLatest(STOP_MUSIC, autoPlayWorker);
    yield fork(playStateWatcher);
}
