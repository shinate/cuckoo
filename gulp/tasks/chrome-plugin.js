'use strict';

var fs = require('fs');
var exec = require('sync-exec');

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('chrome-plugin', ['js', 'style', 'html'], function (cb) {
        gulp.src([
            CONF.build + '/**/*'
        ])
            .pipe(gulp.dest(CONF.chromePlugin))
            .on('finish', function () {
                // manifest
                var manifest = JSON.parse(fs.readFileSync(CONF.src + '/manifest.json').toString());
                manifest.background.scripts = ['js/background.js'];
                fs.writeFileSync(CONF.chromePlugin + '/manifest.json', new Buffer(JSON.stringify(manifest)));
                exec('mv ' + CONF.chromePlugin + '/js/background/chrome.js ' + CONF.chromePlugin + '/js/background.js && rm -rf ' + CONF.chromePlugin + '/js/background');
                cb();
            });
    });

    gulp.task('chrome-plugin-build', ['chrome-plugin'], function (cb) {
        if (fs.existsSync(CONF.chromePluginPath + '/key.pem')) {
            exec('/Applications/Google\\\ Chrome.app/Contents/MacOS/Google\\\ Chrome --pack-extension=' + CONF.chromePlugin + ' --pack-extension-key=' + CONF.chromePluginPath + '/key.pem');
            exec('rm -rf ' + CONF.chromePlugin);
        } else {
            console.log('key file does not exist, can not release');
        }
        cb();
    });
};