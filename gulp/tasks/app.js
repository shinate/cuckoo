'use strict';

var fs = require('fs');
var JC = require('json-config-reader');

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
};