'use strict';

var webpack = require('webpack');

module.exports = function (gulp, PLUGIN, CONF) {

    var packConfig = function (dev) {
        return {
            context: CONF.src + '/js',
            entry: [
                './core/Date.js',
                './core/sprintf.js',
                './core/zepto.js',
                './core/zepto.parseDOM.js',
                './page/index.js'
            ],
            output: {
                path: CONF.dev,
                filename: 'bundle' + (dev != null ? '.dev' : '') + '.js'
            }
        };
    }

    gulp.task('js-bundle', function (cb) {
        webpack(packConfig()).run(function (err, stats) {
            cb();
        });
    });

    gulp.task('dev-js-bundle', ['i18n'], function (cb) {
        webpack(packConfig(1)).run(function (err, stats) {
            cb();
        });
    });

    gulp.task('dev-js-watch', function (cb) {
        webpack(packConfig(1)).watch({
            aggregateTimeout: 500, // wait so long for more changes
            poll: true // use polling instead of native watchersfunction (err, stats) {
        }, function (err, stats) {
        });
    });

};