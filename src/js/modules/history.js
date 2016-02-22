(function (global) {

    var name = 'historyManager';

    function add(list) {
        if (list == null || typeof list === 'string' || (list instanceof Array) && list.length === 0) {
            return 0;
        }

        if (Object.prototype.toString.call(list) === '[object Object]') {
            list = [list];
        }
        global.localStorage.setItem('history', JSON.stringify([].concat(load(), list)));
    }

    function load() {
        var list = global.localStorage.getItem('history')
        return list ? JSON.parse(list) : [];
    }

    function clear() {
        return global.localStorage.removeItem('history');
    }

    Channel.register(name, 'add', add);
    Channel.register(name, 'clear', clear);

    Channel.register(name, 'load', function (cb) {
        cb(load());
    });

})(this || window);