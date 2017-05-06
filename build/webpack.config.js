const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssnano = require('cssnano');
const config = require('../config');
const debug = require('debug')('app:webpack:config');

const paths = config.utils_paths;
const { DEV, PROD, TEST } = config.globals;

debug('Creating configuration.');
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: config.compiler_devtool,
  watch: config.env === 'development',
  resolve: {
    // 注意一下, extensions webpack2第一个不是空字符串! 对应不需要后缀的情况.
    extensions: ['.js', '.json', '.sass', '.scss', '.less', 'jsx'],
    modules: [
      paths.client(),
      'node_modules'
    ]

  },
  module: {}
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = paths.client('main.js');

webpackConfig.entry = {
  app: DEV
    ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
    : [APP_ENTRY],
  vendor: config.compiler_vendors
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].[${config.compiler_hash_type}].js`,
  chunkFilename: '[chunkhash].js',
  path: paths.dist(),
  publicPath: config.compiler_public_path
};

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new ExtractTextPlugin('styles.css'),
  new webpack.DefinePlugin(config.globals),
  new HtmlWebpackPlugin({
    template: paths.client('index.html'),
    hash: false,
    favicon: paths.client('static/favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true
    }
  }),
  new webpack.LoaderOptionsPlugin({
    test: /\.scss|css$/,
    debug: true,
    options: {
      postcss: () => [
        cssnano({
          autoprefixer: {
            add: true,
            remove: true,
            browsers: ['last 5 versions']
          },
          discardComments: {
            removeAll: true
          },
          discardUnused: false,
          mergeIdents: false,
          reduceIdents: false,
          safe: true,
          sourcemap: true
        })
      ]
    }
  })
];

if (DEV) {
  debug('Enable plugins for live development (HMR, NoErrors).');
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
} else if (PROD) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).');
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  );
}

// Don't split bundles during testing, since we only want import one bundle
if (!TEST) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    })
  );
}

// ------------------------------------
// rules
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules = [
  {
    test: /\.html$/, // 获取html里面的图片
    use: 'html-loader'
  },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: 'babel-loader'
  }, {
    // 当我们需要读取json格式文件时，我们不再需要安装任何loader，webpack2中将会内置 json-loader，自动支持json格式的读取（喜大普奔啊）。
    test: /\.json$/, // 获取json数据的loader
    use: 'json-loader'
  }
];

// ------------------------------------
// Style rules
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.

webpackConfig.module.rules.push({
  test: /\.scss$/,
  // loaders的处理顺序是从右到左的，这里就是先运行css-loader然后是style-loader
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        minimize: true
      }
    },
    'postcss-loader',
    'resolve-url-loader',
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        includePaths: [paths.client('styles')]
      }
    }
  ],
  // loaders的处理顺序是从右到左的，这里就是先运行css-loader然后是style-loader
  // include: path.resolve(ROOT_PATH, 'src/styles')
});
webpackConfig.module.rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    },
    'postcss-loader',
    'resolve-url-loader'
  ]
});

// File loaders
/* eslint-disable */
webpackConfig.module.rules.push(
  {
    test: /\.(jpe?g|png|gif)$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[hash:base64:20].[ext]',
        limit: 8192
      }
    }
    ]
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000,
        mimetype: 'application/font-woff'
      }
    }
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: 'file-loader'
  }
);
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!DEV) {
  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename: '[contenthash].css',
      allChunks: true
    })
  );
}

module.exports = webpackConfig;
