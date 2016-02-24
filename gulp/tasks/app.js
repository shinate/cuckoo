'use strict';

var fs = require('fs');
var JC = require('json-config-reader');
// var exec = require('sync-exec');
var EP = require('electron-packager');
// var rcedit = require('rcedit')

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('app', ['js', 'style', 'html'], function (cb) {
        gulp.src([
            CONF.build + '/**/*',
            '!' + CONF.build + '/js/background.js',
            CONF.src + '/main.js'
        ])
            .pipe(gulp.dest(CONF['app']))
            .on('finish', function () {
                var config = JC.read('package.json');
                var nc = {};
                nc.name = config.name;
                nc.version = config.version;
                nc.main = 'main.js';

                fs.writeFileSync(CONF.app + '/package.json', new Buffer(JSON.stringify(nc)));
                cb();
            });
    });

    gulp.task('app-build', ['app'], function (cb) {

        EP({
            dir: CONF.app,
            name: 'cuckoo',
            platform: 'darwin',
            arch: 'all',
            icon: 'thumbnails/icon.icns',
            out: 'dist/app',
            overwrite: true
        }, function done(err, appPath) {
            if (err) {
                console.log(err);
            } else {
                console.log(appPath);
            }
        });

        EP({
            dir: CONF.app,
            name: 'cuckoo',
            platform: 'win32',
            arch: 'x64',
            out: 'dist/app',
            overwrite: true
        }, function done(err, appPath) {
            if (err) {
                console.log(err);
            } else {
                console.log(appPath);
            }
        });

        cb();
    });
};