import { Component, PropTypes } from 'labrador-immutable';

class Channel extends Component {
    static propTypes = {
        channel: PropTypes.object.isRequired,
        isActive: PropTypes.bool.isRequired,
        onSwitchChannel: PropTypes.func.isRequired
    };

    handleSwitchChannel() {
        const { channel, isActive, onSwitchChannel } = this.props;

        if (!isActive) {
            onSwitchChannel(channel.id);
        }
    }
}

export default Channel;
