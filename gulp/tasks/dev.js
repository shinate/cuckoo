'use strict';

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('dev', function () {
        gulp.src(['./bower_components/queue-async/queue.js'])
            .pipe(gulp.dest(CONF.src + '/js/core/'));
        gulp.src(['./bower_components/less/dist/less.min.js'])
            .pipe(gulp.dest(CONF.src + '/dev/'));
    });
};