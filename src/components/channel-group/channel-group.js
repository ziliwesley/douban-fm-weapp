import { Component, PropTypes } from 'labrador-immutable';

import Channel from '../channel/channel.js';

class ChannelGroup extends Component {
    static propTypes = {
        group: PropTypes.object.isRequired,
        currentActive: PropTypes.number,
        onSwitchChannel: PropTypes.func.isRequired
    };

    children() {
        const { group, currentActive, onSwitchChannel } = this.props;

        return {
            channels: group.chls.map(channel => ({
                component: Channel,
                key: channel.id,
                props: {
                    channel,
                    isActive: channel.id === currentActive,
                    onSwitchChannel
                }
            }))
        };
    }
}

export default ChannelGroup;
