// src/pages/player.js
import { wx, store, connect, bindActionCreators, actions, utils, constants } from '../bundle.js';

const {
    playNextSong,
    addHeart,
    removeHeart,
    neverPlay
} = actions;

Page(connect.Page(
    store,
    state => ({
        playing: state.player,
        playState: state.playState
    }),
    dispatch => bindActionCreators({
        playNextSong,
        addHeart,
        removeHeart,
        neverPlay
    }, dispatch)
)({
    data: {},

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

    handleNeverPlay() {
        const { id } = this.data.playing;
        this.neverPlay({
            songId: id,
            progress: 0
        });
    },

    onStateChange(nextState) {
        const differences = utils.shallowDiff(this, nextState);
        this.setData(differences);
    }
}));
