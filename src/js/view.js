(function ($) {

    var it = {};
    var nodes = {};
    var lock = {};
    var cache = {};

    it.name = 'view';

    it.init = function () {
        it.parseDOM();
        it.bind();
    };

    it.parseDOM = function () {
        nodes = $('#bar,#platform').parseDOM();
        nodes.body = $(document.body);
        nodes.bar = $('#bar');
        nodes.platform = $('#platform');

        nodes.body.addClass('right');
        nodes.upload.addClass('show');
        it.custEvts.copyLock();
        it.custEvts.urlsTextLock();
    };

    it.bind = function () {
        var evts, type;

        evts = it.evts.bar;
        for (var type in evts) {
            if (evts.hasOwnProperty(type)) {
                nodes.bar.on('click', '[action-type="' + type + '"]', evts[type]);
            }
        }

        evts = it.evts.upload;
        for (var type in evts) {
            if (evts.hasOwnProperty(type)) {
                nodes.uploadDrop.on(type, evts[type]);
            }
        }

        evts = it.evts.uploadBox;
        for (var type in evts) {
            if (evts.hasOwnProperty(type)) {
                nodes.uploadBox.on(type, evts[type]);
            }
        }

        evts = it.custEvts;
        for (var type in evts) {
            if (evts.hasOwnProperty(type)) {
                channel.register(it.name, type, evts[type]);
            }
        }
    };

    it.evts = {
        bar: {
            copyBtn: function (e) {
                e.preventDefault();
                if (!lock.copyBtn) {
                    if (cache.urls && cache.urls.length) {
                        channel.fire(it.name, 'copyAllToClipboard', cache.urls.join('\n'));
                    }
                }
                return false;
            },
            uploadBtn: function (e) {
                e.preventDefault();
                if (!lock.uploadBtn) {
                    it.showPlat('upload');
                }
                return false;
            },
            urlsTextBtn: function (e) {
                e.preventDefault();
                if (!lock.urlsTextBtn) {
                    if (cache.urls && cache.urls.length) {
                        it.showPlat('urlsText');
                    }
                }
                return false;
            },
            historyBtn: function (e) {
                e.preventDefault();
                it.renderHistory();
                return false;
            }
        },
        upload: {
            dragenter: function (e) {
                e.preventDefault();
                return false;
            },
            dragover: function (e) {
                e.preventDefault();
                return false;
            },
            dragleave: function (e) {
                e.preventDefault();
                return false;
            },
            drop: function (e) {
                e.preventDefault();
                channel.fire(it.name, 'dropedFiles', e.dataTransfer.files);
                return false;
            }
        },
        uploadBox: {
            change: function () {
                channel.fire(it.name, 'selectedFiles', nodes.uploadBox.get(0).files);
            }
        }
    };

    it.custEvts = {
        closePlat: function () {
            var els = nodes.platform.find('li')
            els.addClass('hide');
            window.setTimeout(function () {
                els.removeClass('hide').removeClass('show');
            }, 500);
        },
        updateUrlsText: function (urls) {
            cache.urls = urls;
            nodes.urlsTextBox.val(urls.join('\n'));
        },
        uploadLock: function () {
            lock.uploadBtn = true;
            nodes.uploadBtn.addClass('disable');
        },
        uploadUnlock: function () {
            lock.uploadBtn = false;
            nodes.uploadBtn.removeClass('disable');
        },
        copyLock: function () {
            lock.copyBtn = true;
            nodes.copyBtn.addClass('disable');
        },
        copyUnlock: function () {
            lock.copyBtn = false;
            nodes.copyBtn.removeClass('disable');
        },
        urlsTextLock: function () {
            lock.urlsTextBtn = true;
            nodes.urlsTextBtn.addClass('disable');
        },
        urlsTextUnlock: function () {
            lock.urlsTextBtn = false;
            nodes.urlsTextBtn.removeClass('disable');
        }
    };

    it.showPlat = function (name) {
        var els = nodes.platform.find('li:not([node-type="' + name + '"])');
        els.each(function () {
            var el = $(this);
            if (el.hasClass('show')) {
                el.addClass('hide');
                window.setTimeout(function () {
                    el.removeClass('hide').removeClass('show');
                }, 500);
            }
        });
        nodes.platform.find('[node-type="' + name + '"]').addClass('show');
    };

    it.renderHistory = function () {
        var history = historyManager.load();
        if (history.length) {
            nodes.historyBox.html(history.reverse().map(function (item) {
                return '<li>' +
                    '<div style="background-image:url(' + item.src + ')"></div>' +
                    '</li>';
            }).join('\n'));
            it.showPlat('history');
        } else {
            channel.fire('tips', 'show', '没有上传记录');
        }
    };

    it.init();

})(Zepto);