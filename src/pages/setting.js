import { store, connect, bindActionCreators, actions, utils } from '../bundle.js';

const {
    getUserInfo,
    openSetting,
    clearStorage
} = actions;

Page(connect.Page(
    store,
    state => ({
        doubanAuth: state.doubanAuth,
        wechatAuth: state.wechatAuth
    }),
    dispatch => bindActionCreators({
        getUserInfo,
        openSetting,
        clearStorage
    }, dispatch)
)({
    data: {},

    handleGetUserInfo() {
        this.getUserInfo();
    },

    handleClearStorage() {
        this.clearStorage();
    },

    handleOpenSetting() {
        this.openSetting();
    },

    onLoad() {
        // 
    },

    onStateChange(nextState) {
        const differences = utils.shallowDiff(this, nextState);
        this.setData(differences);
    }
}));
