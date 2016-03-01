'use strict';

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('release', [
        'i18n',
        'up-version',
        'chrome-plugin-build',
        //'safari-plugin-build',
        'native-build'
    ]);
};