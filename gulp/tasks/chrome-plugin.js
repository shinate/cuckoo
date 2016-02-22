'use strict';

var fs = require('fs');

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
};