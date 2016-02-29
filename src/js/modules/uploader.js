/**
 * Created by shinate on 15/12/15.
 * Depends: queue, copyToClipboard
 */

(function ($, global) {

    var name = 'uploader';
    var it = {};
    var nodes = {};
    var previewList = [];
    var taskManager = {};
    var config = global.__CONFIG__;
    var _ = global.i18n;
    var sprintf = global.sprintf;

    var ALLOWED_TYPE = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];

    it.init = function () {
        it.parseDOM();
        it.bind();
    };

    it.parseDOM = function () {
        nodes.body = $(document.body);
        nodes.list = $('#list');
    };

    it.bind = function () {
        for (var type in it.custEvts) {
            if (it.custEvts.hasOwnProperty(type)) {
                Channel.register(name, type, it.custEvts[type]);
            }
        }

        for (var type in it.evts) {
            if (it.evts.hasOwnProperty(type)) {
                nodes.list.on('click', '[action-type="' + type + '"]', it.evts[type]);
            }
        }
    };

    it.evts = {
        copy: function (e) {
            e.preventDefault();
            it.copyToClipboard($(this).parents('.preview').data('url'));
            return false;
        },
        retry: function (e) {
            e.preventDefault();
            // Channel.fire('tips', 'show', 'Coming soon...');
            // TODO
            it.retry($(this).parent());
            return false;
        }
    };

    it.custEvts = {
        upload: function (files) {
            it.startUpload(files);
        },
        reset: function () {
            it.reset();
        }
    };

    it.getImageList = function (files) {
        var imageList = [];
        for (var i = 0; i < files.length; i++) {
            if (ALLOWED_TYPE.indexOf(files[i].type) > -1) {
                imageList.push(files[i]);
            }
        }
        return imageList;
    };

    it.retry = function (el) {
        if (!taskManager.hasOwnProperty('uploadStatus')) {
            taskManager.uploadStatus = [];
        }
        el.removeClass('uploaderr');
        taskManager.uploadStatus.push('pending');
        previewList.push(el);
        it.uploadTask(el.find('.picture').data('image'), previewList.length - 1);
    };

    it.startUpload = function (files) {
        it.resetTaskList();
        var sl = files.length;
        files = it.getImageList(files);
        if (files.length) {
            Channel.fire(name, 'uploadStart');
            it.createUploadQueue(files);
        }

        if (files.length === 0)
            Channel.fire('tips', 'show', _('No picture detected'));
        else if (files.length === sl)
            Channel.fire('tips', 'show', sprintf(_('Start uploading %d pictures'), files.length));
        else
            Channel.fire('tips', 'show', sprintf(_('Start uploading %d pictures, Ignore %d invalid file'), files.length, sl - files.length));
    };

    it.createUploadQueue = function (images) {
        taskManager.uploadStatus = new Array(images.length).fill('pending');
        images.forEach(it.previewTask);
    };

    it.uploadQueueCompleteScan = function () {
        var s = taskManager.uploadStatus;
        var reject = s.filter(function (v) {
            return v === 'rejected' ? true : false;
        });
        var newPics = [];
        var reslove = s.filter(function (v, i) {
            if (v === 'resloved') {
                newPics.push(previewList[i].data('url'));
                return true;
            } else {
                return false;
            }
        });

        // Queue accomplished!!!
        if (s.length === reject.length + reslove.length) {
            var allUrls = it.getAllUrls();

            Channel.fire(name, 'uploadComplete', [allUrls]);

            if (reject.length === 0) {
                Channel.fire('tips', 'show', sprintf(_('Upload successful(%d/%d)'), reslove.length, s.length));
                Channel.fire(name, 'uploadAllSuccess', [allUrls]);
            } else {
                // Channel.fire('tips', 'show', '上传成功(' + reslove.length + '/' + s.length + '), ' + '失败(' + reject.length + ')');
            }

            if (newPics.length) {
                Channel.fire(name, 'saveToHistory', [
                    newPics.map(function (item) {
                        return {
                            src: item,
                            time: +new Date
                        };
                    })
                ]);
            }
            it.resetTaskList();
        }
    };

    it.previewTask = function (file, i) {
        if (taskManager.preview == null) {
            taskManager.preview = queue(1);
        }
        taskManager.preview.defer(function (next) {
            var reader = new FileReader();
            reader.onload = function (e) {
                // console.log(i, file, e.target.result);
                it.createPreview(e.target.result);
                it.uploadTask(e.target.result, i);
                next();
            };
            reader.readAsDataURL(file);
        });
    };

    it.uploadTask = function (imageData, i) {
        if (taskManager.upload == null) {
            taskManager.upload = queue(3);
        }
        taskManager.upload.defer(function (next) {
            it.uploading(i);
            Channel.fire(name, 'uploadTo', [
                imageData, function (url) {
                    if (url != null) {
                        it.uploaded(i, url);
                    } else {
                        it.uploaderr(i);
                    }
                    next();
                }
            ]);
            taskManager.uploadStatus[i] = global.setTimeout(function () {
                it.uploaderr(i);
                config.upload_timeout *= 1.5;
                next();
            }, config.upload_timeout);
        });
    };

    it.createPreview = function (dp) {
        var preview = $('' +
            '<li class="preview">' +
            '<div data-image="' + dp + '" class="picture" style="background-image:url(' + dp + ')"></div>' +
                //'<button title="' + _('Retry') + '" action-type="b64" class="b64"></button>' +
            '<button title="' + _('Copy to clipboard') + '" action-type="copy" class="copy fa fa-copy"></button>' +
            '<button title="' + _('Retry') + '" action-type="retry" class="retry fa fa-cloud-upload"></button>' +
            '</li>');
        nodes.list.append(preview);
        previewList.push(preview);
    };

    it.uploading = function (i) {
        previewList[i].addClass('uploading');
    };

    it.uploaderr = function (i) {
        if (taskManager.uploadStatus && taskManager.uploadStatus[i] !== 'resloved') {
            global.clearTimeout(taskManager.uploadStatus[i]);
            previewList[i].addClass('uploaderr');
            taskManager.uploadStatus[i] = 'rejected';
            it.uploadQueueCompleteScan();
        }
    };

    it.uploaded = function (i, url) {
        if (url && taskManager.uploadStatus && taskManager.uploadStatus[i] !== 'rejected') {
            global.clearTimeout(taskManager.uploadStatus[i]);
            var previewEL = previewList[i];
            previewEL.data('url', url);
            var p = new Image;
            p.onload = function () {
                previewEL.addClass('uploaded');
                previewEL.find('.picture').css('background-image', 'url(' + url + ')');
                taskManager.uploadStatus[i] = 'resloved';
                it.uploadQueueCompleteScan();
            };
            p.src = url;
        }
    };

    it.copyToClipboard = function (text) {
        Channel.fire(name, 'copyToClipboard', text);
    };

    it.getAllUrls = function () {
        var urls = [];
        nodes.list.find('.preview.uploaded').each(function () {
            urls.push($(this).data('url'));
        });
        return urls;
    };

    it.resetTaskList = function () {
        previewList = [];
        taskManager = {};
    };

    it.reset = function () {
        it.resetTaskList();
        nodes.list.empty();
    };

    it.init();

})(Zepto, this || window);