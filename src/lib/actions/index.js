// douban-auth
export {
    loginDouban,
    logoutDouban,
    loginDoubanSuccess,
    loginDoubanFailure
} from './douban-auth.js';

// douban-radio
export {
    fetchChannelList,
    fetchChannelListSuccess,
    fetchChannelListFailure,
    switchChannel,
    switchChannelSuccess,
    switchChannelFailure,
    addHeart,
    addHeartSuccess,
    addHeartFailure,
    removeHeart,
    removeHeartSuccess,
    removeHeartFailure,
    neverPlay,
    neverPlaySuccess,
    neverPlayFailure
} from './douban-radio.js';

// player
export {
    playMusic,
    pauseMusic,
    stopMusic,
    playProgressUpdate,
    playNextSong,
    playNextSongSuccess,
    playNextSongFailure,
    updatePlaylist,
    updatePlaylistSuccess,
    updatePlaylistFailure
} from './player.js';

// wx-api
export {
    authorize,
    authorizeSuccess,
    authorizeFailure,
    openSetting,
    openSettingSuccess,
    openSettingFailure,
    clearStorage,
    stopPullDownRefresh
} from './wx-api.js';

// wx-auth
export {
    getUserInfo,
    getUserInfoSuccess,
    getUserInfoFailure
} from './wx-auth.js';

// wx-ui
export {
    navigateTo,
    navigateBack,
    showToast,
    hideToast,
    showNavigationBarLoading,
    hideNavigationBarLoading
} from './wx-ui.js';


