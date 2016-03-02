'use strict';

module.exports = function (gulp, PLUGIN, CONF) {

    var uglify = PLUGIN.uglify;

    gulp.task('js', [
        'i18n',
        'js-bundle',
        'js-append',
        'js-other',
        'js-background'
    ]);

    gulp.task('js-append', ['js-bundle'], function () {
        return gulp.src([
            CONF.src + '/dev/bundle.js'
        ])
            .pipe(uglify())
            .pipe(gulp.dest(CONF.build + '/js'));
    });

    gulp.task('js-background', function () {
        return gulp.src([
            CONF.src + '/js/background/*.js'
        ])
            .pipe(uglify())
            .pipe(gulp.dest(CONF.build + '/js/background/'));
    });

    gulp.task('js-other', ['i18n'], function () {
        return gulp.src([
            CONF.src + '/js/config.js',
            CONF.src + '/js/language.js'
        ])
            .pipe(uglify())
            .pipe(gulp.dest(CONF.build + '/js'));
    });
};