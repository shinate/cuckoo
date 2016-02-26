'use strict';

module.exports = function (gulp, PLUGIN, CONF) {

    var concat = PLUGIN.concat;
    var uglify = PLUGIN.uglify;

    gulp.task('js', ['js-core', 'js-main', 'js-background']);

    gulp.task('js-core', function () {
        return gulp.src([
            CONF.src + '/js/core/*.js'
        ])
            .pipe(concat('core.js'))
            .pipe(uglify())
            .pipe(gulp.dest(CONF.build + '/js'));
    });

    gulp.task('js-main', function () {
        return gulp.src([
            CONF.src + '/js/modules/*.js',
            CONF.src + '/js/app/*.js',
            CONF.src + '/js/bondage.js'
        ])
            .pipe(concat('main.js'))
            .pipe(uglify())
            .pipe(gulp.dest(CONF.build + '/js'));
    });

    gulp.task('js-background', function () {
        return gulp.src([CONF.src + '/js/background/*.js'])
            .pipe(uglify())
            .pipe(gulp.dest(CONF.build + '/js/background/'));
    });
};