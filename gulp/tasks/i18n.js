'use strict';

var through = require('through-gulp');
var File = require('vinyl');
var path = require('path');

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('i18n', function () {
        return gulp.src([
            CONF.src + '/lang/*.po'
        ])
            .pipe((function () {

                var cmb = {};
                var allowedLanguage = [];

                return through(function (file, env, cb) {
                    var content = file.contents.toString();
                    var lang = path.basename(file.path, '.po');
                    cmb[lang] = {};
                    allowedLanguage.push(lang);
                    content.replace(/msgid "([^\n]+)"\n(?:msgstr "([^\n]+)")\n/ig, function (match, msgid, msgstr) {
                        cmb[lang][msgid] = msgstr;
                    });
                    cb();
                }, function (cb) {

                    var content = [
                        '(function(global){',
                        'global.__ALLOWED_LANGUAGE__ = ' + JSON.stringify(allowedLanguage) + ';',
                        'global.__LANG__ = ' + JSON.stringify(cmb) + ';',
                        '})(this || window)'
                    ].join('\n');

                    this.push(new File({
                        base: CONF.src + '/js',
                        path: CONF.src + '/js/lang.js',
                        contents: new Buffer(content)
                    }));
                    cb();
                })
            })())
            .pipe(gulp.dest(CONF.src + '/js'));
    });
};