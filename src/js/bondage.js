(function () {
    channel.bind(['view', 'dropedFiles'], ['uploader', 'upload']);
    channel.bind(['view', 'selectedFiles'], ['uploader', 'upload']);
    channel.bind(['view', 'copyAllToClipboard'], ['clipboard', 'copy']);

    channel.bind(['uploader', 'uploadStart'], ['view', 'closePlat']);
    channel.bind(['uploader', 'uploadStart'], ['view', 'uploadLock']);
    channel.bind(['uploader', 'uploadComplete'], ['view', 'uploadUnlock']);
    channel.bind(['uploader', 'uploadComplete'], ['view', 'updateUrlsText']);
    channel.bind(['uploader', 'copyToClipboard'], ['clipboard', 'copy']);

    channel.bind(['uploader', 'uploadTo'], ['app_weibo', 'upload']);
    channel.bind(['app_weibo', 'error'], ['tips', 'show']);

    channel.bind(['clipboard', 'copySuccessful'], ['tips', 'show']);
    channel.bind(['clipboard', 'copyUnsuccessful'], ['tips', 'show']);

})();