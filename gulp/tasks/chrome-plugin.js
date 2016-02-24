'use strict';

var fs = require('fs');
var exec = require('sync-exec');

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('chrome-plugin', ['js', 'style', 'html'], function (cb) {
        gulp.src([CONF.build + '/**/*'])
            .pipe(gulp.dest(CONF['chrome-plugin']))
            .on('finish', function () {
                // manifest
                var manifest = JSON.parse(fs.readFileSync(CONF.src + '/manifest.json').toString());
                manifest.background.scripts = ['js/background.js'];
                fs.writeFileSync(CONF['chrome-plugin'] + '/manifest.json', new Buffer(JSON.stringify(manifest)));
                cb();
            });
    });

    gulp.task('chrome-plugin-build', ['chrome-plugin'], function (cb) {
        exec('/Applications/Google\\\ Chrome.app/Contents/MacOS/Google\\\ Chrome --pack-extension=./' + CONF['chrome-plugin'] + ' --pack-extension-key=./dist/chrome-plugin/key.pem');
        cb();
    });
};