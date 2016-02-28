(function (global) {

    var name = 'config';
    var config;

    function set(key, value) {
        config[key] = value;
        global.localStorage.setItem(name, JSON.stringify(config));
    }

    function get(key) {
        return key != null ? config[key] : config;
    }

    function clear() {
        return global.localStorage.removeItem(name);
    }

    Channel.register(name, 'set', set);
    Channel.register(name, 'get', get);
    Channel.register(name, 'clear', clear);

    var config = $.extend({}, global.__CONFIG__, JSON.parse(global.localStorage.getItem(name)));
    global.__CONFIG__ = config;

})(this || window);