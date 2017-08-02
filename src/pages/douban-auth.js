import { store, connect, bindActionCreators, actions, utils } from '../bundle.js';

const {
    loginDouban
} = actions;

/**
 * Simply make sure both fields are not empty
 * @param  {string} username
 * @param  {string} password
 * @return {boolean}
 */
function validateInput(username, password) {
    return !(username.length > 0 && password.length > 0);
}

Page(connect.Page(
    store,
    state => ({
        doubanAuth: state.doubanAuth
    }),
    dispatch => bindActionCreators({
        loginDouban
    }, dispatch)
)({
    data: {
        userInput: {
            username: '',
            password: '',
            loginBtnDisabled: true
        }
    },

    handleUsernameChange(ev) {
        let username = ev.detail.value;
        let password = this.data.userInput.password;

        this.setData({
            userInput: {
                username,
                password,
                loginBtnDisabled: validateInput(username, password)
            }
        })
    },

    handlePasswordChange(ev) {
        let username = this.data.userInput.username;
        let password = ev.detail.value;

        this.setData({
            userInput: {
                username,
                password,
                loginBtnDisabled: validateInput(username, password)
            }
        });
    },

    handleRequestDoubanLogin() {        
        const { username, password } = this.data.userInput;

        if (process.env.NODE_ENV === 'development') {
            console.log(`dispatch loginDouban(), using`, { username, password });
        }

        this.loginDouban({
            username,
            password
        });
    },

    onShow() {
        const username = this.data.doubanAuth.loginName;

        if (username) {
            this.setData({
                userInput: {
                    ...this.data.userInput,
                    username,
                    password: ''
                }
            })
        }
    },

    onStateChange(nextState) {
        const differences = utils.shallowDiff(this, nextState);
        this.setData(differences);
    }
}));
