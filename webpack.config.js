import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'public/buiild'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(?:node_modules|__tests__|\.test\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'images', // or your preferred output directory
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
            },
          },
        ],
      },

      {
        test: /\.(mp3|ogg|wav)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'audio',
        },
      },
    ],
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
      publicPath: '/',
    },
    port: 8080,
    proxy: {
      '/api': 'http://localhost:4000/',
      '/assets': 'http://localhost:4000/',
    },
    historyApiFallback: true,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      minChunks: 1,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  devtool: 'eval-source-map',

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      publicPath: '/',
    }),
    new Dotenv(),
    new CompressionPlugin(),
    new BundleAnalyzerPlugin(),
  ],
};
