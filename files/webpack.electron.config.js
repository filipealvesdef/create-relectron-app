const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const electronDistPath = path.resolve(__dirname, 'dist', 'electron');
const ElectronReloadPlugin = require('webpack-electron-reload')({
    path: electronDistPath,
    killOnClose: true,
});

module.exports = env => ({
    entry: path.join(__dirname, 'src', 'js', 'electron', 'mainProcess.js'),
    mode: env.prod ? 'production' : 'development',
    devtool: env.prod ? 'source-map' : 'eval',
    target: 'electron-main',
    optimization: {
        minimize: env.prod,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        ElectronReloadPlugin(),
    ],
    output: {
        filename: 'index.js',
        path: electronDistPath,
    }
});