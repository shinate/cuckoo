(function (global) {

    var lang = global.__CONFIG__.language;

    global.i18n = function (word) {
        if (global.hasOwnProperty('__LANG__') && lang in global.__LANG__ && global.__LANG__[lang][word] != null) {
            return global.__LANG__[lang][word];
        }
        return word;
    }

})(this || window);