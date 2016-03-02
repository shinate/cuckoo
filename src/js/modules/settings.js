(function (global) {

    var Channel = require('./Channel');
    var _ = require('./i18n');
    var config = require('./config');

    var name = 'settings';

    function load(cb) {
        cb(config.get());
    }

    function get() {

    }

    function save() {

    }

    Channel.register(name, 'load', load);

})(window);