// tools/webpack/index.js

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssEntryPlugin = require('css-entry-webpack-plugin');

const baseConfigs = require('./base.js');

const PROJECT_ROOT = baseConfigs.PROJECT_ROOT;

const libConfig = Object.assign({}, baseConfigs.libConfig, {
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),

        new webpack.optimize.UglifyJsPlugin(),

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
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});

const pageStylesConfig = Object.assign({}, baseConfigs.pageStylesConfig, {
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
