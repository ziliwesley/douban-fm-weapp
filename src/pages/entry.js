import { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import ChannelGroup from '../components/channel-group/channel-group.js';
import { navigateTo } from '../redux/wx-ui.js';
import { getUserInfo } from '../redux/wx-auth.js';
import { fetchChannelList, switchChannel } from '../redux/douban-radio.js';
import { isNotEmtpyString } from '../utils/utils.js';

import { sleep } from '../utils/utils.js';

class EntryPage extends Component {
    static propTypes = {
        isAuthorized: PropTypes.bool
    }

    state = {
        isAuthorized: false
    }

    onPullDownRefresh() {
        this.props.fetchChannelList();
    }

    onLoad() {
        // 初次渲染完成后请求授权获取用户信息
        this.props.getUserInfo('scope.userInfo');
    }

    onUpdate(props) {
        const { wechatAuth } = props;

        // TODO check if wechat will do diff operations
        this.setState({
            isAuthorized: wechatAuth.authorized
        });
    }

    onReachBottom() {
        console.log('bottom reached');
    }

    onPageScroll(e) {
        console.log(e);
    }

    children() {
        const { channelGroups, active } = this.props.doubanRadio;
        const switchChannel = this.props.switchChannel;

        return {
            groups: channelGroups.map(group => ({
                component: ChannelGroup,
                key: group.group_id,
                props: {
                    group,
                    currentActive: active,
                    switchChannel
                }
            }))
        }
    }

    handleDoubanAuth = () => {
        this.props.navigateTo('douban-auth');
    }

    handleChangeAppSetting = () => {
        this.props.navigateTo('setting');
    }
}

export default connect(
    ({
        doubanAuth,
        wechatAuth,
        doubanRadio
    }) => ({
        doubanAuth,
        wechatAuth,
        doubanRadio
    }),
    (dispatch) => bindActionCreators({
        navigateTo,
        getUserInfo,
        fetchChannelList,
        switchChannel
    }, dispatch)
)(EntryPage);
