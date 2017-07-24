import { Component, PropTypes } from 'labrador-immutable';
import { connect } from 'labrador-redux';
import { bindActionCreators } from 'redux';

import { loginDouban } from '../redux/douban-auth.js';

/**
 * Simply make sure both fields are not empty
 * @param  {string} username
 * @param  {string} password
 * @return {boolean}
 */
function validateInput(username, password) {
    return !(username.length > 0 && password.length > 0);
}

class DoubanAuth extends Component {
    static propTypes = {
        loginDouban: PropTypes.func
    };

    state = {
        loginBtnDisabled: true,
        username: '',
        password: ''
    }

    handleUsernameChange = (ev) => {
        let username = ev.detail.value;
        let password = this.state.password;

        this.setState({
            username,
            loginBtnDisabled: validateInput(username, password)
        });
    }

    handlePasswordChange = (ev) => {
        let username = this.state.username;
        let password = ev.detail.value;

        this.setState({
            password,
            loginBtnDisabled: validateInput(username, password)
        });
    }

    handleRequestDoubanLogin = () => {
        const { username, password }  = this.state;

        this.props.loginDouban({
            username,
            password
        });
    }
}

export default connect(
    ({ doubanAuth }) => ({ doubanAuth }),
    (dispatch) => bindActionCreators({
        loginDouban
    }, dispatch)
)(DoubanAuth);
