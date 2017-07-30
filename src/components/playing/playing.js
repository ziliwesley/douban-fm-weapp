import wx, { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import { pauseMusic } from '../../redux/player.js';

export default class Playing extends Component {
    static propTypes = {
        playing: PropTypes.object.isRequired,
        onPlayNextSong: PropTypes.func.isRequired
    }

    handlePauseMusic = () => {
        return wx.pauseBackgroundAudio();
    };

    handlePlayNextSong = () => {
        return this.props.onPlayNextSong();
    };
}
