// tools/webpack/index.js

const path = require('path');
const webpack = require('webpack');

const config = {
    // sourcemap 选项, 建议开发时包含sourcemap, production版本时去掉(节能减排)
    devtool: null,
};

module.exports = config;
