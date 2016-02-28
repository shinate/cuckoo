'use strict';

module.exports = function (gulp, PLUGIN, CONF) {

    var htmlReplace = PLUGIN.htmlReplace;

    gulp.task('html', function () {
        return gulp.src([CONF.src + '/*.html'])
            .pipe(htmlReplace({
                js: ['js/config.js', 'js/core.js', 'js/lang.js', 'js/main.js'],
                css: 'style/css/style.css'
            }))
            .pipe(gulp.dest(CONF.build));
    });
};