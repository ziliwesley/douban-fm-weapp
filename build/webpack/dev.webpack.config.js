// tools/webpack/index.js

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssEntryPlugin = require('css-entry-webpack-plugin');

const baseConfigs = require('./base.js');

const PROJECT_ROOT = baseConfigs.PROJECT_ROOT;

const libConfig = Object.assign({}, baseConfigs.libConfig, {
    devtool: 'inline-source-map',

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),

        // https://github.com/kevlened/copy-webpack-plugin
        new CopyWebpackPlugin([{
            from: path.join(PROJECT_ROOT, 'src'),
            to: path.join(PROJECT_ROOT, 'dist')
        }], {
            ignore: [
                '*.js',
                '*.less'
            ]
        })
    ]
});

const pageScriptsConfig = Object.assign({}, baseConfigs.pageScriptsConfig, {
    devtool: 'source-map',

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
});

const pageStylesConfig = Object.assign({}, baseConfigs.pageStylesConfig, {
    devtool: 'source-map',

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new CssEntryPlugin({
            output: {
                filename: '[name].wxss'
            }
        })
    ]
});

module.exports = [
    libConfig,
    pageScriptsConfig,
    pageStylesConfig
];
