'use strict';

module.exports = function (gulp, PLUGIN, CONF) {

    var clean = PLUGIN.clean;

    gulp.task('clean', ['clean-build', 'clean-chrome-plugin', 'clean-native']);

    gulp.task('clean-native', function () {
        return gulp.src(CONF.nativePath, {read: false})
            .pipe(clean());
    });

    gulp.task('clean-build', function () {
        return gulp.src(CONF.build, {read: false})
            .pipe(clean());
    });

    gulp.task('clean-chrome-plugin', function () {
        return gulp.src(CONF.chromePlugin, {read: false})
            .pipe(clean());
    });

    gulp.task('clean-safari-plugin', function () {
        return gulp.src(CONF.safariPlugin, {read: false})
            .pipe(clean());
    });

};