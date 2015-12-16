channel.bind(['view', 'dropedFiles'], ['uploader', 'upload']);
channel.bind(['view', 'selectedFiles'], ['uploader', 'upload']);
channel.bind(['view', 'copyAllToClipboard'], ['uploader', 'copyAllToClipboard']);

channel.bind(['uploader', 'uploadStart'], ['view', 'closePlat']);
channel.bind(['uploader', 'uploadStart'], ['view', 'uploadLock']);
channel.bind(['uploader', 'uploadComplete'], ['view', 'uploadUnlock']);

channel.bind(['uploader', 'uploadTo'], ['app_weibo', 'upload']);