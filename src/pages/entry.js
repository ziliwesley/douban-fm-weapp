import { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import ChannelGroup from '../components/channel-group/channel-group.js';
import PlayerFooter from '../components/player-footer/player-footer.js';

import { navigateTo } from '../redux/wx-ui.js';
import { getUserInfo } from '../redux/wx-auth.js';
import { fetchChannelList, switchChannel } from '../redux/douban-radio.js';
import { playNextSong } from '../redux/player.js';

import { sleep } from '../utils/utils.js';

class EntryPage extends Component {
    onPullDownRefresh() {
        this.props.fetchChannelList();
    }

    onLoad() {
        // 初次渲染完成后请求授权获取用户信息
        this.props.getUserInfo('scope.userInfo');
    }

    onReachBottom() {
        console.log('bottom reached');
    }

    onPageScroll(e) {
        console.log(e);
    }

    handleSwitchChannel = (id) => {
        return this.props.switchChannel(id);
    };

    handlePlayNextSong = () => {
        return this.props.playNextSong();
    };

    children() {
        const { channelGroups, active } = this.props.doubanRadio;
        const player = this.props.player;

        return {
            groups: channelGroups.map(group => ({
                component: ChannelGroup,
                key: group.group_id,
                props: {
                    group,
                    currentActive: active,
                    onSwitchChannel: this.handleSwitchChannel
                }
            })),
            footer: {
                component: PlayerFooter,
                props: {
                    player,
                    onPlayNextSong: this.handlePlayNextSong
                }
            }
        }
    }
}

export default connect(
    ({
        doubanAuth,
        wechatAuth,
        doubanRadio,
        player
    }) => ({
        doubanAuth,
        wechatAuth,
        doubanRadio,
        player
    }),
    (dispatch) => bindActionCreators({
        getUserInfo,
        fetchChannelList,
        switchChannel,
        playNextSong
    }, dispatch)
)(EntryPage);
