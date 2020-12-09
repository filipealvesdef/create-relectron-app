const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => ({
    entry: path.join(__dirname, 'src', 'js', 'react', 'root.js'),
    mode: env.prod ? 'production' : 'development',
    devtool: env.prod ? 'source-map' : 'eval',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist', 'react'),
    },
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
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist', 'react'),
    }
});