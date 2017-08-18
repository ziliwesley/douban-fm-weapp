// src/lib/actions/index.js

// App life-cycle
export {
    reload
} from './app-act.js';

// douban-auth
export {
    loginDouban,
    logoutDouban
} from './douban-auth-act.js';

// douban-radio
export {
    fetchChannelList,
    switchChannel,
    addHeart,
    removeHeart,
    neverPlay
} from './douban-radio-act.js';

// playlist
export {
    playNextSong
} from './playlist-act.js';

// player
export {
    playMusic,
    pauseMusic,
    stopMusic
} from './player-act.js';

// 微信 API
export {
    wxGetUserInfo,
    wxOpenSetting,
    wxClearStorage
} from './wechat-act.js';

// Scheduler
export {
    startScheduler,
    stopScheduler
} from './scheduler-act.js';
