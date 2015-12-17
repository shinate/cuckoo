(function () {
    channel.bind(['view', 'dropedFiles'], ['uploader', 'upload']);
    channel.bind(['view', 'selectedFiles'], ['uploader', 'upload']);
    channel.bind(['view', 'copyAllToClipboard'], ['clipboard', 'copy']);

    channel.bind(['uploader', 'uploadStart'], ['view', 'closePlat']);
    channel.bind(['uploader', 'uploadStart'], ['view', 'uploadLock']);
    channel.bind(['uploader', 'uploadComplete'], ['view', 'uploadUnlock']);
    channel.bind(['uploader', 'uploadStart'], ['view', 'copyLock']);
    channel.bind(['uploader', 'uploadComplete'], ['view', 'copyUnlock']);
    channel.bind(['uploader', 'uploadStart'], ['view', 'urlsTextLock']);
    channel.bind(['uploader', 'uploadComplete'], ['view', 'urlsTextUnlock']);
    channel.bind(['uploader', 'uploadComplete'], ['view', 'updateUrlsText']);
    channel.bind(['uploader', 'copyToClipboard'], ['clipboard', 'copy']);
    channel.bind(['uploader', 'saveToHistory'], ['historyManager', 'add']);

    channel.bind(['uploader', 'uploadTo'], ['app_weibo', 'upload']);

})();