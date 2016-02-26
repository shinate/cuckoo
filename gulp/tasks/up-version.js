'use strict';

var fs = require('fs');

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('up-version', function (cb) {
        var version = CONF.version;

        [
            CONF.src + '/manifest.json',
            CONF.src + '/package.json'
        ]
            .forEach(function (file) {
                fs.writeFileSync(file, new Buffer(fs.readFileSync(file).toString().replace(/\"version\": \"[^\"]+\"/, function () {
                    return '"version": "' + version + '"';
                })));
            });

        cb();
    });
};