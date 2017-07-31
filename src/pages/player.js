import wx, { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import { playNextSong, PLAYER_STATUS } from '../redux/player.js';

import { addHeart, removeHeart, neverPlay } from '../redux/douban-radio.js';

class Player extends Component {
    static propTypes = {
        player: PropTypes.object.isRequired,
        playNextSong: PropTypes.func.isRequired
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
                return this.props.playNextSong();
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

    handlePlayNextSong = () => {
        return this.props.playNextSong();
    }

    handleToggleHeart = () => {
        const { like, id } = this.props.player.playing;
        const { current, duration } = this.props.player.playState;

        if (like) {
            this.props.removeHeart({
                songId: id,
                progress: current / duration * 100
            });
        } else {
            this.props.addHeart({
                songId: id,
                progress: current / duration * 100
            });
        }
    }

    handleNeverPlay = () => {
        const { id } = this.props.player.playing;
        this.props.neverPlay({
            songId: id,
            progress: 0
        });
        this.props.playNextSong();
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

        wx.setNavigationBarTitle({
            title: `${props.player.playing.title} - ${props.player.playing.artist}`
        });

        // TODO check if wechat will do diff operations
        this.setState({
            leftRotate,
            rightRotate,
            isPlaying
        });
    }
}

export default connect(
    ({ player }) => ({ player }),
    dispatch => bindActionCreators({
        playNextSong,
        addHeart,
        removeHeart,
        neverPlay
    }, dispatch)
)(Player);
