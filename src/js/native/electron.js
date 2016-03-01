(function (global) {

    var name = 'native';

    if ('module' in global && 'require' in global) {
        global.native = require('electron');
    }

})(this || window);