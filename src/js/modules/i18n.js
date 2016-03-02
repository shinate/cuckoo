(function (global) {

    var config = require('./config');

    var lang = config.get('language');

    function i18n(word) {
        if (global.hasOwnProperty('__LANG__') && lang in global.__LANG__ && global.__LANG__[lang][word] != null) {
            return global.__LANG__[lang][word];
        }
        return word;
    }

    if (typeof define === "function" && define.amd)
        define(function () {
            return i18n;
        });
    else if (typeof module === "object" && module.exports)
        module.exports = i18n;
    else
        global.i18n = i18n;

})(window);