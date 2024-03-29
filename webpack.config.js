import path from 'path';
import webpack from 'webpack';
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
    path: path.join(__dirname, 'public/build'),
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
              outputPath: 'assets/images', // or your preferred output directory
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
          outputPath: 'assets/audio',
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
        vendorReactDom: {
          test: /[\\/]node_modules[\\/](react-dom)[\\/]/,
          name: 'vendor-react-dom',
          chunks: 'all',
        },
        vendorReactRouterDom: {
          test: /[\\/]node_modules[\\/](react-router-dom)[\\/]/,
          name: 'vendor-react-router-dom',
          chunks: 'all',
        },
        vendorRemixRun: {
          test: /[\\/]node_modules[\\/](@remix-run)[\\/]/,
          name: 'vendor-remix-run',
          chunks: 'all',
        },
        vendorAxios: {
          test: /[\\/]node_modules[\\/](axios)[\\/]/,
          name: 'vendor-axios',
          chunks: 'all',
        },
        vendorHowler: {
          test: /[\\/]node_modules[\\/](howler)[\\/]/,
          name: 'vendor-howler',
          chunks: 'all',
        },
        vendorDateFns: {
          test: /[\\/]node_modules[\\/](date-fns)[\\/]/,
          name: 'vendor-date-fns',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true, // Enable to mangle variable names
          compress: {
            drop_console: true, // Remove console.log and console.error statements
          },
        },
      }),
    ],
  },

  performance: {
    maxAssetSize: 244 * 1024, // 244 KiB
  },

  devtool: 'eval-source-map',

  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      publicPath: '/',
    }),
    new Dotenv(),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: 9,
      },
      filename: '[path][base].gz',
    }),
    process.env.NODE_ENV === 'production' && new BundleAnalyzerPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
