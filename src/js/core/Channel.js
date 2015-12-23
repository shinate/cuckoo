(function (global, factory) {
    if (true) {
        global['Channel'] = global['Channel'] || factory(global);
    }
})(this || window, function (global) {

    var Channel;

    Channel = (function () {
    
        var module = {exports: {}}, exports = module.exports;
    
        var dispatchList = window['__CHANNEL__'] != null ? window['__CHANNEL__'] : (window['__CHANNEL__'] = {});
        
        var bindList = window['__CHANNEL_BIND__'] != null ? window['__CHANNEL_BIND__'] : (window['__CHANNEL_BIND__'] = {});
        
        var fireTaskList = [];
        
        var runFireTaskList = function () {
        
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
        
        };
        
        var it = {
        
            'register': function (channelName, eventType, callBack) {
        
                if (!dispatchList.hasOwnProperty(channelName)) {
        
                    dispatchList[channelName] = {};
        
                }
        
                if (!dispatchList[channelName].hasOwnProperty(eventType)) {
        
                    dispatchList[channelName][eventType] = [];
        
                }
        
                dispatchList[channelName][eventType].push(callBack);
        
            },
        
            'fire': function (channelName, eventType, data) {
        
                if (dispatchList[channelName] && dispatchList[channelName][eventType] && dispatchList[channelName][eventType].length) {
        
                    var fList = dispatchList[channelName][eventType];
        
                    fList.cache = data;
        
                    for (var i = 0, len = fList.length; i < len; i++) {
        
                        fireTaskList.push({
        
                            'channel': channelName,
        
                            'evt': eventType,
        
                            'func': fList[i],
        
                            'data': data
        
                        });
        
                    }
        
                    runFireTaskList();
        
                }
        
            },
        
            'remove': function (channelName, eventType, callBack) {
        
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
        
            },
        
            'list': function () {
        
                return dispatchList;
        
            },
        
            'cache': function (channelName, eventType) {
        
                if (dispatchList[channelName] && dispatchList[channelName][eventType]) {
        
                    return dispatchList[channelName][eventType].cache;
        
                }
        
            },
        
            'bind': function (listen, fire, append) {
        
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
        
                var callBack = function () {
        
                    it.fire(fire[0], fire[1], [].concat(Array.prototype.slice.call(arguments), append || []));
        
                };
        
                var hashKey = [].concat(listen, fire).join('|');
        
                if (!(bindList[hashKey] instanceof Array)) {
        
                    bindList[hashKey] = [];
        
                }
        
                bindList[hashKey].push(callBack);
        
                it.register(listen[0], listen[1], callBack);
        
            },
        
            unBind: function (listen, fire) {
        
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
        
                        it.remove(listen[0], listen[1], bindList[hashKey][i]);
        
                    }
        
                    delete bindList[hashKey];
        
                }
        
            }
        
        };
        
        module.exports = it;
    
        return module.exports;
    
    })();

    return Channel;

});