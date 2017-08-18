// src/pages/entry.js
import { wx, store, connect, bindActionCreators, actions, utils, constants } from '../bundle.js';

const {
    wxGetUserInfo,
    switchChannel,
    playNextSong,
    addHeart,
    removeHeart,
    reload
} = actions;

Page(connect.Page(
    store,
    state => ({
        app: state.app,
        doubanAuth: state.doubanAuth,
        wechatAuth: state.wechatAuth,
        doubanRadio: state.doubanRadio,
        playing: state.player,
        playState: state.playState
    }),
    dispatch => bindActionCreators({
        wxGetUserInfo,
        switchChannel,
        playNextSong,
        addHeart,
        removeHeart,
        reload
    }, dispatch)
)({
    data: {},

    handleSwitchChannel(ev) {
        const currentTarget = ev.currentTarget;
        const channelId = currentTarget.dataset.channelId;

        if (process.env.NODE_ENV === 'development') {
            console.log(`dispatch switchChannel(${channelId}), originated from`, currentTarget);
        }

        return this.switchChannel(channelId);
    },

    handleClickCover() {
        const { playing, playState } = this.data;

        switch (playState.status) {
            case constants.PLAYER_STATUS.IDLE:
                return this.playNextSong();
            case constants.PLAYER_STATUS.PLAYING:
                return wx.pauseBackgroundAudio();
            case constants.PLAYER_STATUS.PAUSED:
                return wx.playBackgroundAudio({
                    dataUrl: playing.url,
                    title: playing.title,
                    coverImgUrl: playing.cover
                });
        }
    },

    handlePlayNextSong(ev) {
        if (process.env.NODE_ENV === 'development') {
            const currentTarget = ev.currentTarget;
            console.log(`dispatch playNextSong(), originated from`, currentTarget);
        }

        return this.playNextSong();
    },

    handleToggleHeart() {
        const { like, id } = this.data.playing;
        const { current, duration } = this.data.playState;

        if (like) {
            this.removeHeart({
                songId: id,
                progress: current / duration * 100
            });
        } else {
            this.addHeart({
                songId: id,
                progress: current / duration * 100
            });
        }
    },

    onLoad() {
        this.wxGetUserInfo();
    },

    onPullDownRefresh() {
        if (!this.data.app.reloading) {
            this.reload();
        }
    },

    onStateChange(nextState) {
        const differences = utils.shallowDiff(this, nextState);
        this.setData(differences);
    }
}));
