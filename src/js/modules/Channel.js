(function (global) {

    var dispatchList = global['__CHANNEL__'] != null ? global['__CHANNEL__'] : (global['__CHANNEL__'] = {});
    var bindList = global['__CHANNEL_BIND__'] != null ? global['__CHANNEL_BIND__'] : (global['__CHANNEL_BIND__'] = {});
    var fireTaskList = [];

    function runFireTaskList() {
        if (fireTaskList.length == 0) {
            return;
        }
        var curFireTask = fireTaskList.splice(0, 1)[0];
        try {
            curFireTask['func'].apply(curFireTask, [].concat(curFireTask['data']));
        }
        catch (exp) {
        }
        runFireTaskList();
    }

    function register(channelName, eventType, callBack) {
        if (!dispatchList.hasOwnProperty(channelName)) {
            dispatchList[channelName] = {};
        }
        if (!dispatchList[channelName].hasOwnProperty(eventType)) {
            dispatchList[channelName][eventType] = [];
        }
        dispatchList[channelName][eventType].push(callBack);
    }

    function fire(channelName, eventType, data) {
        if (dispatchList[channelName] && dispatchList[channelName][eventType] && dispatchList[channelName][eventType].length) {
            var fList = dispatchList[channelName][eventType];
            fList.cache = data;
            for (var i = 0, len = fList.length; i < len; i++) {
                fireTaskList.push({
                    channel: channelName,
                    evt: eventType,
                    func: fList[i],
                    data: data
                });
            }
            runFireTaskList();
        }
    }

    function remove(channelName, eventType, callBack) {
        if (dispatchList[channelName]) {
            if (dispatchList[channelName][eventType]) {
                for (var i = 0, len = dispatchList[channelName][eventType].length; i < len; i++) {
                    if (dispatchList[channelName][eventType][i] === callBack) {
                        dispatchList[channelName][eventType].splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    function list() {
        return dispatchList;
    }

    function cache(channelName, eventType) {
        if (dispatchList[channelName] && dispatchList[channelName][eventType]) {
            return dispatchList[channelName][eventType].cache;
        }
    }

    function bind(source, target, append) {
        if (!(
                source != null
                && source instanceof Array
                && source.length === 2
                && target != null
                && target instanceof Array
                && target.length === 2
            )) {
            throw new Error('Parameter error, must be Array(2), Array(2)');
        }
        function callBack() {
            fire(target[0], target[1], [].concat(Array.prototype.slice.call(arguments), append || []));
        }

        var hashKey = [].concat(source, target).join('|');
        if (!(bindList[hashKey] instanceof Array)) {
            bindList[hashKey] = [];
        }
        bindList[hashKey].push(callBack);
        register(source[0], source[1], callBack);
    }

    function unBind(listen, fire) {
        if (!(
                listen != null
                && listen instanceof Array
                && listen.length === 2
                && fire != null
                && fire instanceof Array
                && fire.length === 2
            )) {
            throw new Error('Parameter error, must be Array(2), Array(2)');
        }
        var hashKey = [].concat(listen, fire).join('|');
        if ((bindList[hashKey] instanceof Array) && bindList[hashKey].length) {
            for (var i = 0, len = bindList[hashKey].length; i < len; i++) {
                remove(listen[0], listen[1], bindList[hashKey][i]);
            }
            delete bindList[hashKey];
        }
    }

    var Channel = {};

    Channel.version = "1.0.0";
    Channel.register = register;
    Channel.fire = fire;
    Channel.remove = remove;
    Channel.list = list;
    Channel.cache = cache;
    Channel.bind = bind;
    Channel.unbind = unBind;

    if (typeof define === "function" && define.amd)
        define(function () {
            return Channel;
        });
    else if (typeof module === "object" && module.exports)
        module.exports = Channel;
    else
        global.Channel = Channel;

})(window);