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
            Channel.fire('tips', 'show', 'Coming soon...');
            // TODO
            // it.retry(files);
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

    it.retry = function () {

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
            Channel.fire('tips', 'show', '没有检测到图片');
        else if (files.length === sl)
            Channel.fire('tips', 'show', '开始上传' + files.length + '个图片');
        else
            Channel.fire('tips', 'show', '开始上传' + files.length + '个图片, 忽略' + (sl - files.length) + '个无效文件');
    };

    it.createUploadQueue = function (images) {
        taskManager.status = new Array(images.length).fill('pending');
        images.forEach(it.previewTask);
    };

    it.uploadQueueCompleteScan = function () {
        var s = taskManager.status;
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
                Channel.fire('tips', 'show', '上传成功(' + reslove.length + '/' + s.length + ')');
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
            taskManager.status[i] = global.setTimeout(function () {
                it.uploaderr(i);
                next();
            }, 20000);
        });
    };

    it.createPreview = function (dp) {
        var preview = $('' +
            '<li class="preview">' +
            '<div class="picture" style="background-image:url(' + dp + ')"></div>' +
            '<button title="复制到剪切板" action-type="copy" class="copy fa fa-copy"></button>' +
            '<button title="重试" action-type="retry" class="retry fa fa-cloud-upload"></button>' +
            '</li>');
        nodes.list.append(preview);
        previewList.push(preview);
    };

    it.uploading = function (i) {
        previewList[i].addClass('uploading');
    };

    it.uploaderr = function (i) {
        if (taskManager.status && taskManager.status[i] !== 'resloved') {
            global.clearTimeout(taskManager.status[i]);
            previewList[i].addClass('uploaderr');
            taskManager.status[i] = 'rejected';
            it.uploadQueueCompleteScan();
        }
    };

    it.uploaded = function (i, url) {
        if (url && taskManager.status && taskManager.status[i] !== 'rejected') {
            global.clearTimeout(taskManager.status[i]);
            var previewEL = previewList[i];
            previewEL.data('url', url);
            var p = new Image;
            p.onload = function () {
                previewEL.addClass('uploaded');
                previewEL.find('.picture').css('background-image', 'url(' + url + ')');
                taskManager.status[i] = 'resloved';
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