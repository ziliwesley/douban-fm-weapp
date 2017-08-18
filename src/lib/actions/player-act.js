// src/lib/actions/player-act.js
import { createAction } from 'redux-actions';

export const PLAY_MUSIC = 'PLAY_MUSIC';
export const PAUSE_MUSIC = 'PAUSE_MUSIC';

export const STOP_MUSIC = 'STOP_MUSIC';
export const STOP_MUSIC_SUCCESS = 'STOP_MUSIC_SUCCESS';
export const STOP_MUSIC_FAILURE = 'STOP_MUSIC_FAILURE';

export const CHANGE_SONG = 'CHANGE_SONG';

// 播放音乐
export const playMusic = createAction(PLAY_MUSIC);
// 暂停音乐
export const pauseMusic = createAction(PAUSE_MUSIC);
// 停止音乐
export const stopMusic = createAction(STOP_MUSIC);
// 更换当前播放的歌曲
export const changeSong = createAction(CHANGE_SONG);
