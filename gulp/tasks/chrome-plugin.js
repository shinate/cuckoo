'use strict';

var fs = require('fs');
var exec = require('sync-exec');
var queue = require('queue-async');

module.exports = function (gulp, PLUGIN, CONF) {

    var rename = PLUGIN.rename;
    var htmlReplace = PLUGIN.htmlReplace;

    gulp.task('chrome-plugin', ['chrome-plugin-build']);

    gulp.task('chrome-plugin-build', ['chrome-plugin-source'], function (cb) {
        var manifest = JSON.parse(fs.readFileSync(CONF.src + '/manifest.json').toString());
        manifest.background.scripts = ['js/background.js'];
        fs.writeFileSync(CONF.chromePlugin + '/manifest.json', new Buffer(JSON.stringify(manifest)));

        if (fs.existsSync(CONF.chromePluginPath + '/' + CONF.name + '.pem')) {
            exec(CONF.chromeApp + ' --pack-extension=' + CONF.chromePlugin + ' --pack-extension-key=' + CONF.chromePluginPath + '/' + CONF.name + '.pem');
            exec('rm -rf ' + CONF.chromePlugin);
        } else {
            console.log('Key file does not exist, can not release.');
        }
        cb();
    });

    gulp.task('chrome-plugin-source', ['js', 'style', 'chrome-plugin-html'], function (cb) {
        queue()
            // js core
            .defer(function (next) {
                gulp.src([
                    CONF.build + '/js/*.js'
                ])
                    .pipe(gulp.dest(CONF.chromePlugin + '/js'))
                    .on('end', function () {
                        next();
                    });
            })
            // js background
            .defer(function (next) {
                gulp.src([
                    CONF.build + '/js/background/chrome.js'
                ])
                    .pipe(rename('background.js'))
                    .pipe(gulp.dest(CONF.chromePlugin + '/js'))
                    .on('end', function () {
                        next();
                    });
            })
            // js background
            .defer(function (next) {
                gulp.src([
                    CONF.build + '/style/**/*'
                ])
                    .pipe(gulp.dest(CONF.chromePlugin + '/style'))
                    .on('end', function () {
                        next();
                    });
            })
            .awaitAll(function () {
                cb();
            });
    });

    gulp.task('chrome-plugin-html', function (cb) {
        return gulp.src([CONF.src + '/*.html'])
            .pipe(htmlReplace({
                js: ['js/config.js', 'js/language.js', 'js/bundle.js'],
                css: 'style/css/style.css'
            }))
            .pipe(gulp.dest(CONF.chromePlugin));
    });

};