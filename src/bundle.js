// src/bundle.js

// 将所有 Redux 相关及第三方模块文件打包至 dist/bundle.js

import { bindActionCreators } from 'redux';

import connect from 'redux-weapp';
import configureStore from './lib/configure-store.js';
import wx from './lib/wx.js';
import * as actions from './lib/actions/index.js';
import * as utils from './lib/utils/index.js';

import { PLAYER_STATUS } from './lib/reducer/play-state-reducer.js'

// Other constants
const constants = {
    PLAYER_STATUS
};

const store = configureStore();

export {
    store,
    connect,
    wx,
    actions,
    utils,
    bindActionCreators,
    constants
}
