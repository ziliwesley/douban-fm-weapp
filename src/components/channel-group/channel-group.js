import { Component, PropTypes } from 'labrador-immutable';

import Channel from '../channel/channel.js';

class ChannelGroup extends Component {
    static propTypes = {
        group: PropTypes.object.isRequired,
        currentActive: PropTypes.number,
        switchChannel: PropTypes.func.isRequired
    };

    children() {
        const { group, currentActive, switchChannel } = this.props;

        return {
            channels: group.chls.map(channel => ({
                component: Channel,
                key: channel.id,
                props: {
                    channel,
                    isActive: channel.id === currentActive,
                    switchChannel
                }
            }))
        };
    }
}

export default ChannelGroup;
