'use strict';

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('bower', function () {
        gulp.src([
            CONF.bower + '/queue-async/queue.js',
            CONF.bower + '/sprintf/src/sprintf.js'
        ])
            .pipe(gulp.dest(CONF.src + '/js/core/'));
        gulp.src(['./bower_components/less/dist/less.min.js'])
            .pipe(gulp.dest(CONF.src + '/dev/'));
    });
};