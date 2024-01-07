import path from 'path';
import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import Dotenv from 'dotenv-webpack';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const getProxyConfig = () => {
  // Define proxy targets based on environment
  const proxyTargets = {
    development: 'http://localhost:4000',
    staging: 'https://quil-staging-97e232bad7d0.herokuapp.com',
    production: 'https://quil-prod-b3e044c49835.herokuapp.com',
  };

  // Get the current environment
  const environment = process.env.NODE_ENV;

  // Set up the proxy configuration based on the environment
  return {
    '/api': {
      target: proxyTargets[environment],
      secure: false,
      pathRewrite: { '^/api': '' },
    },

    '/assets': {
      target: proxyTargets[environment],
      secure: false,
    },
  };
};

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'build'),
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
    proxy: getProxyConfig(),
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

  devtool: 'source-map',

  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './public/index.html',
      publicPath: '/',
    }),
    process.env.NODE_ENV === 'development' && new Dotenv(),
    process.env.NODE_ENV === 'production' &&
      new CompressionPlugin({
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          level: 9,
          algorithm: 'gzip',
        },
        filename: '[path][base].gz',
      }),
    // process.env.NODE_ENV === 'production' && new BundleAnalyzerPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
