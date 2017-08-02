import { createAction, handleActions } from 'redux-actions';

export const PLAY_MUSIC = 'PLAY_MUSIC';
export const PAUSE_MUSIC = 'PAUSE_MUSIC';

export const STOP_MUSIC = 'STOP_MUSIC';
export const STOP_MUSIC_SUCCESS = 'STOP_MUSIC_SUCCESS';
export const STOP_MUSIC_FAILURE = 'STOP_MUSIC_FAILURE';

export const PLAY_PROGRESS_UPDATE = 'PLAY_PROGRESS_UPDATE';

export const PLAY_NEXT_SONG = 'PLAY_NEXT_SONG';
export const PLAY_NEXT_SONG_SUCCESS = 'PLAY_NEXT_SONG_SUCCESS';
export const PLAY_NEXT_SONG_FAILURE = 'PLAY_NEXT_SONG_FAILURE';

export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
export const UPDATE_PLAYLIST_SUCCESS = 'UPDATE_PLAYLIST_SUCCESS';
export const UPDATE_PLAYLIST_FAILURE = 'UPDATE_PLAYLIST_FAILURE';

// 播放音乐
export const playMusic = createAction(PLAY_MUSIC);
// 暂停音乐
export const pauseMusic = createAction(PAUSE_MUSIC);
// 停止音乐
export const stopMusic = createAction(STOP_MUSIC);

// 播放进度更新
export const playProgressUpdate = createAction(PLAY_PROGRESS_UPDATE);

// 播放下一首音乐
export const playNextSong = createAction(PLAY_NEXT_SONG);
export const playNextSongSuccess = createAction(PLAY_NEXT_SONG_SUCCESS);
export const playNextSongFailure = createAction(PLAY_NEXT_SONG_FAILURE);

// 更新播放列表
export const updatePlaylist = createAction(UPDATE_PLAYLIST);
export const updatePlaylistSuccess = createAction(UPDATE_PLAYLIST_SUCCESS);
export const updatePlaylistFailure = createAction(UPDATE_PLAYLIST_FAILURE);
