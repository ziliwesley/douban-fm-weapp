import { Component, PropTypes } from 'labrador-immutable';

class Channel extends Component {
    static propTypes = {
        channel: PropTypes.object.isRequired,
        isActive: PropTypes.bool.isRequired,
        switchChannel: PropTypes.func.isRequired
    };

    handleSwitchChannel() {
        const { channel, isActive, switchChannel } = this.props;

        if (!isActive) {
            switchChannel(channel.id);
        }
    }
}

export default Channel;
