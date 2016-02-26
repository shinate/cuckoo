(function (global) {

    Channel.bind(['view', 'dropedFiles'], ['uploader', 'upload']);
    Channel.bind(['view', 'selectedFiles'], ['uploader', 'upload']);
    Channel.bind(['view', 'copyAllToClipboard'], ['clipboard', 'copy']);
    Channel.bind(['view', 'reset'], ['uploader', 'reset']);
    Channel.bind(['view', 'loadHistory'], ['historyManager', 'load']);

    Channel.bind(['uploader', 'uploadStart'], ['view', 'closePlat']);
    Channel.bind(['uploader', 'uploadStart'], ['view', 'uploadLock']);
    Channel.bind(['uploader', 'uploadComplete'], ['view', 'uploadUnlock']);
    Channel.bind(['uploader', 'uploadAllSuccess'], ['view', 'showUrlsText']);
    Channel.bind(['uploader', 'uploadComplete'], ['view', 'updateUrlsText']);
    Channel.bind(['uploader', 'copyToClipboard'], ['clipboard', 'copy']);
    Channel.bind(['uploader', 'saveToHistory'], ['historyManager', 'add']);

    // TODO support more apps
    Channel.bind(['uploader', 'uploadTo'], [global.__CONFIG__[global.__CONFIG__.defaultAPP].name, 'upload']);
    // document.title = ACTIVE_APP.display_name + ' 真是个好图床';

})(this || window);