chrome.browserAction.onClicked.addListener(function () {
    chrome.windows.create({
        url: 'main.html',
        width: 640,
        height: 400,
        focused: true,
        type: 'popup'
    });
});

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    console.debug('headers', details);
    var header = details.requestHeaders;
    var isExt = header.filter(function (item) {
            return item.name === 'Origin' ? true : false;
        })[0].value.search(/^chrome\-extension:\/\//) > -1;
    if (isExt) {
        header.forEach()
        for (var i = 0; i < header.length; i++) {
            switch (header[i]) {
                case 'Origin':
                    header[i].value = 'http://tieba.baidu.com'
                    break;
            }
        }
    }
    return {
        requestHeaders: header
    };
}, {
    urls: ['http://upload.tieba.baidu.com/upload/pic*']
}, [
    "blocking",
    "requestHeaders"
]);