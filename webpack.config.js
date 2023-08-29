const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './client/index.js',
    output: {
        path: path.join(__dirname, '/bundle'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss', '.sass']
    },

    devServer: {
        static: {
            directory: path.resolve(__dirname, 'build'),
            publicPath: '/'
        },
        proxy: {
            '/api': 'http://localhost:4000/'
        }
    },

    devtool: 'eval-source-map',

    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        })
    ]
};
