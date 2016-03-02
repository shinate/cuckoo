var Channel = require('./modules/Channel');
var config = require('./modules/config');

Channel.bind(['view', 'dropedFiles'], ['uploader', 'upload']);
Channel.bind(['view', 'selectedFiles'], ['uploader', 'upload']);
Channel.bind(['view', 'copyAllToClipboard'], ['clipboard', 'copy']);
Channel.bind(['view', 'reset'], ['uploader', 'reset']);
Channel.bind(['view', 'loadHistory'], ['historyManager', 'load']);
Channel.bind(['view', 'loadSettings'], ['config', 'get']);
Channel.bind(['view', 'updateSettings'], ['config', 'update']);

Channel.bind(['uploader', 'uploadStart'], ['view', 'closePlat']);
Channel.bind(['uploader', 'uploadStart'], ['view', 'uploadLock']);
Channel.bind(['uploader', 'uploadComplete'], ['view', 'uploadUnlock']);
Channel.bind(['uploader', 'uploadAllSuccess'], ['view', 'showUrlsText']);
Channel.bind(['uploader', 'uploadComplete'], ['view', 'updateUrlsText']);
Channel.bind(['uploader', 'copyToClipboard'], ['clipboard', 'copy']);
Channel.bind(['uploader', 'saveToHistory'], ['historyManager', 'add']);

// TODO support more apps
var APPS = {
    weibo: require('./app/weibo')
};
Channel.bind(['uploader', 'uploadTo'], [APPS[config.get('default_storage')].name, 'upload']);