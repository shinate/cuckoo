'use strict';

module.exports = function (gulp, PLUGIN, CONF) {

    var less = PLUGIN.less;
    var dc = PLUGIN.dropComments;
    var minifycss = PLUGIN.minifyCss;

    gulp.task('style', ['style-css', 'style-image', 'style-font']);

    gulp.task('style-css', function () {
        return gulp.src([
            CONF.src + '/style/less/style.less'
        ])
            .pipe(less())
            .pipe(dc())
            .pipe(minifycss())
            .pipe(gulp.dest(CONF.build + '/style/css'));
    });

    gulp.task('style-image', function () {
        return gulp.src([
            CONF.src + '/style/images/**/*'
        ])
            .pipe(gulp.dest(CONF.build + '/style/images'));
    });

    gulp.task('style-font', function () {
        return gulp.src([
            CONF.src + '/style/fonts/**/*'
        ])
            .pipe(gulp.dest(CONF.build + '/style/fonts'));
    });
};