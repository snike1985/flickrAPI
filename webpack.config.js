'use strict';

let webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    fs = require('fs'),
    isDevelopment = process.argv[3] === 'development';

const PATHS = {
    sourceFolder: 'app',
    buildFolder: 'dist',
    source: path.resolve(__dirname, 'app'),
    build: path.resolve(__dirname, 'dist'),
};

let config = {
    mode: process.argv[3],
    target: 'web',
    stats: isDevelopment ? 'normal' : 'minimal',
    entry: {
        index: [PATHS.source + '/js/index', PATHS.source + '/scss/index.scss']
    },
    output: {
        path: PATHS.build,
        chunkFilename: 'js/vendors/[name].js',
        filename: 'js/[name].js',
        publicPath: '',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                include: [PATHS.source],
                use: [
                    {
                        loader: "underscore-template-loader",
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: PATHS.source + '/js',
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(sass|scss)$/,
                include: PATHS.source + '/scss',
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                minimize: true,
                                importLoaders: true,
                                url: false
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                                ident: 'postcss',
                                plugins: (loader) => [
                                    require('postcss-import')({root: loader.resourcePath}),
                                    require('postcss-cssnext')(),
                                    require('postcss-url-mapper')(function (url) {
                                        var expr = /http/;

                                        if (expr.test(url)) {
                                            return url;
                                        }

                                        var arrayUrl = url.split('/');
                                        return '../' + arrayUrl[arrayUrl.length - 2] + '/' + arrayUrl[arrayUrl.length - 1];
                                    })
                                ]
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                    ]
                })
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    context: PATHS.sourceFolder,
                    name: '[path][name].[ext]',
                    useRelativePath: true,
                    publicPath: url => url
                }
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/,
                loader: 'file-loader',
                options: {
                    context: PATHS.sourceFolder,
                    name: '[path][name].[ext]',
                    useRelativePath: true,
                    publicPath: url => url
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.argv[3]),
            _: "underscore"
        }),
        new webpack.ProvidePlugin({
            _: "underscore"
        }),
        new CleanWebpackPlugin(PATHS.build),
        new CopyWebpackPlugin([
            {
                from: 'app/img',
                to: 'img'
            },
        ]),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true,
        }),
        new HtmlWebpackPlugin({
            title: 'Home',
            template: PATHS.source + '/index.html',
            filename: './index.html',
            chunks: '',
            inject: true
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [
            'node_modules',
            PATHS.source,
            PATHS.source + '/css',
            PATHS.source + '/js'
        ],
    },
    devServer: {
        contentBase: PATHS.build,
        compress: true,
        hot: true,
        inline: true,
        publicPath: '/',
        port: 9000,
    },
    watch: false,
    devtool: 'source-maps',
};

module.exports = config;