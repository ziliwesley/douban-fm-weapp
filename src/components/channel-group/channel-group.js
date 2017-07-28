import { Component, PropTypes } from 'labrador-immutable';

import Channel from '../channel/channel.js';

class ChannelGroup extends Component {
    static propTypes = {
        group: PropTypes.object.isRequired,
        showTitle: PropTypes.object.bool
    };

    children() {
        const channelGroup = this.props.group;

        return {
            channels: channelGroup.chls.map(channel => ({
                component: Channel,
                key: channel.id,
                props: {
                    channel
                }
            }))
        };
    }
}

export default ChannelGroup;
