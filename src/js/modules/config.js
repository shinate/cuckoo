(function (global) {

    var name = 'config';
    var config;
    var defaults = {
        upload_timeout: 30000,
        defaultAPP: 'weibo'
    };

    function set(key, value) {
        config[key] = value;
        global.localStorage.setItem('config', JSON.stringify(config));
    }

    function get() {
        var config = global.localStorage.getItem('config');
        return config ? JSON.parse(config) : defaults;
    }

    function clear() {
        return global.localStorage.removeItem('config');
    }

    Channel.register(name, 'set', set);
    Channel.register(name, 'get', get);
    Channel.register(name, 'clear', clear);

    config = get();
    global.__CONFIG__ = config;

})(this || window);