'use strict';

var fs = require('fs');
var JC = require('json-config-reader');
var exec = require('sync-exec');
var EP = require('electron-packager');
var queue = require('queue-async');

module.exports = function (gulp, PLUGIN, CONF) {

    var htmlReplace = PLUGIN.htmlReplace;

    gulp.task('native', ['native-build']);

    gulp.task('native-build', ['native-source'], function (cb) {

        queue()
            .defer(function (next) {
                EP({
                    dir: CONF.native,
                    name: CONF.name,
                    platform: 'darwin',
                    arch: 'all',
                    icon: 'thumbnails/icon.icns',
                    out: CONF.nativePath,
                    overwrite: true
                }, function done(err, appPath) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(appPath);
                        next();
                    }
                });
            })
            .defer(function (next) {
                EP({
                    dir: CONF.native,
                    name: CONF.name,
                    platform: 'win32',
                    arch: 'x64',
                    out: CONF.nativePath,
                    overwrite: true
                }, function done(err, appPath) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(appPath);
                        next();
                    }
                });
            })
            .awaitAll(function () {
                cb();
            });
    });

    gulp.task('native-source', ['js', 'style', 'native-html'], function (cb) {
        queue()
            .defer(function (next) {
                gulp.src([
                    CONF.build + '/js/*.js'
                ])
                    .pipe(gulp.dest(CONF.native + '/js'))
                    .on('end', function () {
                        next();
                    });
            })
            .defer(function (next) {
                gulp.src([
                    CONF.src + '/main.js'
                ])
                    .pipe(gulp.dest(CONF.native))
                    .on('end', function () {
                        next();
                    });
            })
            .defer(function (next) {
                gulp.src([
                    CONF.build + '/style/**/*'
                ])
                    .pipe(gulp.dest(CONF.native + '/style'))
                    .on('end', function () {
                        next();
                    });
            })
            .defer(function (next) {
                var config = JC.read('package.json');
                var nc = {};
                nc.name = config.name;
                nc.version = config.version;
                nc.main = 'main.js';

                fs.writeFileSync(CONF.native + '/package.json', new Buffer(JSON.stringify(nc)));
                next();
            })
            .awaitAll(function () {
                cb();
            });

    });

    gulp.task('native-html', function () {
        return gulp.src([CONF.src + '/*.html'])
            .pipe(htmlReplace({
                js: ['js/config.js', 'js/language.js', 'js/bundle.js'],
                css: 'style/css/style.css'
            }))
            .pipe(gulp.dest(CONF.native));
    });
};