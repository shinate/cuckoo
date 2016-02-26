chrome.browserAction.onClicked.addListener(function () {
    chrome.windows.create({
        url: 'main.html',
        width: 640,
        height: 400,
        focused: true,
        type: 'popup'
    });
});