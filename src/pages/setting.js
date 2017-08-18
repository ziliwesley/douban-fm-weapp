// src/pages/setting.js
import { store, connect, bindActionCreators, actions, utils } from '../bundle.js';

const {
    wxGetUserinfo,
    wxOpenSetting,
    wxClearStorage
} = actions;

Page(connect.Page(
    store,
    state => ({
        doubanAuth: state.doubanAuth,
        wechatAuth: state.wechatAuth
    }),
    dispatch => bindActionCreators({
        wxGetUserinfo,
        wxOpenSetting,
        wxClearStorage
    }, dispatch)
)({
    data: {},

    handleGetUserInfo() {
        this.wxGetUserinfo();
    },

    handleClearStorage() {
        this.wxClearStorage();
    },

    handleOpenSetting() {
        this.wxOpenSetting();
    },

    onStateChange(nextState) {
        const differences = utils.shallowDiff(this, nextState);
        this.setData(differences);
    }
}));
