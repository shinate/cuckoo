'use strict';

module.exports = function (gulp, PLUGIN, CONF) {

    var clean = PLUGIN.clean;

    gulp.task('clean', ['clean-build', 'clean-chrome-plugin']);

    gulp.task('clean-build', function () {
        return gulp.src(CONF.build, {read: false})
            .pipe(clean());
    });

    gulp.task('clean-chrome-plugin', function () {
        return gulp.src(CONF['chrome-plugin'], {read: false})
            .pipe(clean());
    });

};