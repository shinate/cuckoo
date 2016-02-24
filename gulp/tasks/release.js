'use strict';

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('release', ['up-version', 'chrome-plugin', 'app', 'chrome-plugin-build', 'app-build']);
};