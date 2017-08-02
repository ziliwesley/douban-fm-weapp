// tools/webpack/index.js

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssEntryPlugin = require('css-entry-webpack-plugin');

const webpackUtils = require('../utils/webpack.js');

const PROJECT_ROOT = path.resolve(__dirname, '../../');

// const baseConfig = require('./base.js');

const libConfig = {
    // sourcemap 选项, 建议开发时包含sourcemap, production版本时去掉(节能减排)
    devtool: 'inline-source-map',

    context: PROJECT_ROOT,

    entry: {
        // application's main bundle
        lib: './src/bundle.js'
    },

    output: {
        path: path.join(PROJECT_ROOT, 'dist'),

        filename: 'bundle.js',

        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: path.join(PROJECT_ROOT, 'src/lib'),
                exclude: path.join(PROJECT_ROOT, 'node_modules')
            }
        ]
    },

    resolve: {
        extensions: ['.js'],
        modules: ['node_modules']
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
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
};

const pageScriptsConfig = {
    // sourcemap 选项, 建议开发时包含sourcemap, production版本时去掉(节能减排)
    devtool: 'source-map',

    context: PROJECT_ROOT,

    entry: () => webpackUtils.searchPages(PROJECT_ROOT, 'js'),

    output: {
        path: path.join(PROJECT_ROOT, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: path.join(PROJECT_ROOT, 'src'),
                exclude: path.join(PROJECT_ROOT, 'node_modules')
            }
        ]
    },

    resolve: {
        extensions: ['.js'],
        modules: ['node_modules']
    },

    externals: /\.\/bundle\.js/,

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ]
};

const pageStylesConfig = {
    // sourcemap 选项, 建议开发时包含sourcemap, production版本时去掉(节能减排)
    devtool: 'source-map',

    context: PROJECT_ROOT,

    entry: () => webpackUtils.searchPages(PROJECT_ROOT, 'less'),

    output: {
        path: path.join(PROJECT_ROOT, 'dist'),
        filename: '[name].css'
    },

    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }]
            }
        ]
    },

    resolve: {
        extensions: ['.css', '.less']
        // modules: ['node_modules']
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new CssEntryPlugin({
            output: {
                filename: '[name].wxss'
            }
        })
    ]
};

module.exports = [
    libConfig,
    pageScriptsConfig,
    pageStylesConfig
];
