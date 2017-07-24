import { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import { navigateTo } from '../redux/wx-ui.js';
import { getUserInfo } from '../redux/wx-auth.js';
import { openSetting } from '../redux/wx-api.js';

class EntryPage extends Component {

    handleDoubanAuth = () => {
        this.props.navigateTo('douban-auth');
    }

    handleAuthorize = () => {
        this.props.getUserInfo('scope.userInfo');
    }

    handleOpenSetting = () => {
        this.props.openSetting();
    }
}

export default connect(
    () => ({}),
    (dispatch) => bindActionCreators({
        navigateTo,
        getUserInfo,
        openSetting
    }, dispatch)
)(EntryPage);
