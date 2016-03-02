(function (global, $) {

    var Channel = require('./Channel');

    var name = 'config';
    var config = $.extend({}, global.__CONFIG__ || {}, JSON.parse(global.localStorage.getItem(name)));

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

    function update(c) {
        config = $.extend({}, c);
        global.localStorage.setItem(name, JSON.stringify(config));
    }

    Channel.register(name, 'set', set);
    Channel.register(name, 'get', get);
    Channel.register(name, 'clear', clear);
    Channel.register(name, 'update', update);

    global.__CONFIG__ = config;

    module.exports = {
        get: get,
        set: set,
        clear: clear,
        update: update
    }

})(window, Zepto);