var popupWindow = (function () {

    var openedID;

    return function () {
        if (openedID == null) {
            chrome.windows.create({
                url: 'main.html',
                width: 640,
                height: 400,
                focused: true,
                type: 'popup'
            }, function (win) {
                openedID = win.id;
            });
        } else {
            chrome.windows.update(openedID, {
                focused: true
            })
        }
    };
})();

chrome.browserAction.onClicked.addListener(popupWindow);