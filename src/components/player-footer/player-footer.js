import wx, { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import { PLAYER_STATUS } from '../../redux/player.js';

export default class Playing extends Component {
    static propTypes = {
        player: PropTypes.object.isRequired,
        onPlayNextSong: PropTypes.func.isRequired
    };

    state = {
        leftRotate: -135,
        rightRotate: -135,
        isPlaying: false
    }

    handleClickCover = () => {
        const { playing, playState } = this.props.player;

        switch (playState.status) {
            case PLAYER_STATUS.IDLE:
                return this.props.onPlayNextSong();
            case PLAYER_STATUS.PLAYING:
                return wx.pauseBackgroundAudio();
            case PLAYER_STATUS.PAUSED:
                return wx.playBackgroundAudio({
                    dataUrl: playing.url,
                    title: playing.title,
                    coverImgUrl: playing.cover
                });
        }
    }

    handlePauseMusic = () => {
        return wx.pauseBackgroundAudio();
    }

    handlePlayNextSong = () => {
        return this.props.onPlayNextSong();
    }

    onUpdate(props) {
        const { playState } = props.player;
        const percentage = playState.current / playState.duration;
        const playStatus = playState.status;
        const isPlaying = playStatus === PLAYER_STATUS.PLAYING;
        const degree = percentage * 360;
        const rightRotate = degree > 180 ?
            45 : degree - 135;
        const leftRotate = degree > 180 ?
            degree - 180 - 135 : -135;

        // TODO check if wechat will do diff operations
        this.setState({
            leftRotate,
            rightRotate,
            isPlaying
        });
    }
}
