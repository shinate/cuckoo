'use strict';

module.exports = function (gulp, PLUGIN, CONF) {
    gulp.task('release', [
        'i18n',
        'up-version',
        'chrome-plugin',
        //'safari-plugin',
        'native'
    ]);
};