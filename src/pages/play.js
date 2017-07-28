import { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import { navigateTo } from '../redux/wx-ui.js';
import { getUserInfo } from '../redux/wx-auth.js';

class EntryPage extends Component {
    static propTypes = {
        isAuthorized: PropTypes.bool
    }

    state = {
        isAuthorized: false
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
}

export default connect(
    ({ doubanAuth, wechatAuth }) => ({ doubanAuth, wechatAuth }),
    (dispatch) => bindActionCreators({
        navigateTo,
        getUserInfo
    }, dispatch)
)(EntryPage);
