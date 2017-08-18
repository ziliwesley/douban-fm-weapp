// tools/webpack/index.js

const path = require('path');

const webpackUtils = require('../utils/webpack.js');
const PROJECT_ROOT = path.resolve(__dirname, '../../');

/**
 * Application's main bundle
 * Consists:
 * - React, Redux
 * - Redux store, actions, saga
 * - Utilities
 * - Wrapper for wx's API
 * - Constants
 * @type {Object}
 */
const libConfig = {
    context: PROJECT_ROOT,

    entry: {
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
                // Will not transpile any codes inside `node_modules` directory
                exclude: path.join(PROJECT_ROOT, 'node_modules')
            }
        ]
    },

    resolve: {
        extensions: ['.js'],
        modules: ['node_modules']
    }
};

const pageScriptsConfig = {
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
                // Will not transpile any codes inside `node_modules` directory
                exclude: path.join(PROJECT_ROOT, 'node_modules')
            }
        ]
    },

    resolve: {
        extensions: ['.js'],
        modules: ['node_modules']
    },

    // ```js
    // require('../bundle.js')
    // ```
    // Code like this will be ignored when trying to resolve dependencies
    externals: /\.\/bundle\.js/
};

const pageStylesConfig = {
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
    }
};

module.exports = {
    libConfig,
    pageScriptsConfig,
    pageStylesConfig,
    PROJECT_ROOT
};
