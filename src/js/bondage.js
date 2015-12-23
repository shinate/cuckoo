(function (global) {
    Channel.bind(['view', 'dropedFiles'], ['uploader', 'upload']);
    Channel.bind(['view', 'selectedFiles'], ['uploader', 'upload']);
    Channel.bind(['view', 'copyAllToClipboard'], ['clipboard', 'copy']);

    Channel.bind(['uploader', 'uploadStart'], ['view', 'closePlat']);
    Channel.bind(['uploader', 'uploadStart'], ['view', 'uploadLock']);
    Channel.bind(['uploader', 'uploadComplete'], ['view', 'uploadUnlock']);
    // Channel.bind(['uploader', 'uploadStart'], ['view', 'copyLock']);
    // Channel.bind(['uploader', 'uploadComplete'], ['view', 'copyUnlock']);
    // Channel.bind(['uploader', 'uploadStart'], ['view', 'urlsTextLock']);
    // Channel.bind(['uploader', 'uploadComplete'], ['view', 'urlsTextUnlock']);
    Channel.bind(['uploader', 'uploadComplete'], ['view', 'updateUrlsText']);
    Channel.bind(['uploader', 'copyToClipboard'], ['clipboard', 'copy']);
    Channel.bind(['uploader', 'saveToHistory'], ['historyManager', 'add']);

    // TODO support more apps
    var ACTIVE_APP = global['app_weibo'];
    Channel.bind(['uploader', 'uploadTo'], [ACTIVE_APP.name, 'upload']);
    document.title = ACTIVE_APP.display_name + ' 真是个好图床';

})(this || window);