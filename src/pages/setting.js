import { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import { navigateTo } from '../redux/wx-ui.js';
import { getUserInfo } from '../redux/wx-auth.js';
import { openSetting, clearStorage } from '../redux/wx-api.js';

class SettingPage extends Component {
    handleGetUserInfo = () => {
        this.props.getUserInfo();
    }

    handleClearStorage = () => {
        this.props.clearStorage();
    }

    handleOpenSetting = () => {
        this.props.openSetting();
    }
}

export default connect(
    ({ doubanAuth, wechatAuth }) => ({ doubanAuth, wechatAuth }),
    (dispatch) => bindActionCreators({
        getUserInfo,
        openSetting,
        clearStorage
    }, dispatch)
)(SettingPage);
