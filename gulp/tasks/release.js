'use strict';

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('release', ['up-version', 'chrome-plugin', 'native', 'chrome-plugin-build', 'native-build']);
};