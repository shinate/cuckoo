'use strict';

var fs = require('fs');
var JC = require('json-config-reader');

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('up-version', function (cb) {
        var version = JC.read('package.json').version;

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