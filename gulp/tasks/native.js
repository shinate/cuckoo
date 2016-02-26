'use strict';

var fs = require('fs');
var JC = require('json-config-reader');
var exec = require('sync-exec');
var EP = require('electron-packager');
// var rcedit = require('rcedit')

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('native', ['js', 'style', 'html'], function (cb) {
        gulp.src([
            CONF.build + '/**/*',
            CONF.src + '/main.js'
        ])
            .pipe(gulp.dest(CONF.native))
            .on('finish', function () {

                exec('rm -rf ' + CONF.native + '/js/background');

                var config = JC.read('package.json');
                var nc = {};
                nc.name = config.name;
                nc.version = config.version;
                nc.main = 'main.js';

                fs.writeFileSync(CONF.native + '/package.json', new Buffer(JSON.stringify(nc)));
                cb();
            });
    });

    gulp.task('native-build', ['native'], function (cb) {

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
            }
        });

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
            }
        });

        cb();
    });
};