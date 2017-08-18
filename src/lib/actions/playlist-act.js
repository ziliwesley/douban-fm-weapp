// src/lib/actions/playlist-act.js
import { createAction } from 'redux-actions';

export const PLAY_NEXT_SONG = 'PLAY_NEXT_SONG';
export const PLAY_NEXT_SONG_SUCCESS = 'PLAY_NEXT_SONG_SUCCESS';
export const PLAY_NEXT_SONG_FAILURE = 'PLAY_NEXT_SONG_FAILURE';

export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
export const UPDATE_PLAYLIST_SUCCESS = 'UPDATE_PLAYLIST_SUCCESS';
export const UPDATE_PLAYLIST_FAILURE = 'UPDATE_PLAYLIST_FAILURE';

// 播放下一首音乐
export const playNextSong = createAction(PLAY_NEXT_SONG);
export const playNextSongSuccess = createAction(PLAY_NEXT_SONG_SUCCESS);
export const playNextSongFailure = createAction(PLAY_NEXT_SONG_FAILURE);

// 更新播放列表
export const updatePlaylist = createAction(UPDATE_PLAYLIST);
export const updatePlaylistSuccess = createAction(UPDATE_PLAYLIST_SUCCESS);
export const updatePlaylistFailure = createAction(UPDATE_PLAYLIST_FAILURE);
