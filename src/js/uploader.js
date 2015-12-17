/**
 * Created by shinate on 15/12/15.
 * Depends: queue, copyToClipboard
 */

(function ($, global) {

    var it = {};
    var nodes = {};
    var previewList = [];
    var taskManager = {};

    it.name = 'uploader';

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
                channel.register(it.name, type, it.custEvts[type]);
            }
        }
    };

    it.custEvts = {
        upload: function (files) {
            it.startUpload(files);
        }
    };

    it.getImageList = function (files) {
        var imageList = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].type.search(/^image/) > -1) {
                imageList.push(files[i]);
            }
        }
        return imageList;
    };

    it.startUpload = function (files) {
        it.resetTaskList();
        files = it.getImageList(files);
        if (files.length) {
            channel.fire(it.name, 'uploadStart');
            it.createUploadQueue(files);
        }
    };

    it.createUploadQueue = function (images) {
        taskManager.status = new Array(images.length).fill('pending');
        images.forEach(it.previewTask);
    };

    it.uploadQueueCompleteScan = function () {
        var s = taskManager.status;
        var reject = s.filter(function (i) {
            return i === 'rejected' ? true : false;
        });
        var reslove = s.filter(function (i) {
            return i === 'resloved' ? true : false;
        });
        // Accomplished!!!
        if (s.length === reject.length + reslove.length) {
            it.resetTaskList();
            channel.fire(it.name, 'uploadComplete', [it.getAllUrls()]);
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
            channel.fire(it.name, 'uploadTo', [
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
            }, 8000);
        });
    };

    it.createPreview = function (dp) {
        var wrap = $('<li></li>').addClass('preview');
        var img = $('<div></div>').addClass('picture');
        img.css('background-image', 'url(' + dp + ')');
        wrap.append(img);
        nodes.list.append(wrap);
        previewList.push(wrap);
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
                var copyBtn = $('<button></button>').addClass('fa fa-copy');
                copyBtn.on('click', function () {
                    var el = $(this);
                    it.copyToClipboard(el.parents('.preview').data('url'));
                    //el.removeClass('fa-copy').addClass('fa-check');
                    //global.setTimeout(function () {
                    //    el.removeClass('fa-check').addClass('fa-copy');
                    //}, 1500);
                });
                previewEL.append(copyBtn);
                taskManager.status[i] = 'resloved';
                it.uploadQueueCompleteScan();
            };
            p.src = url;
        }
    };

    it.copyToClipboard = function (text) {
        channel.fire(it.name, 'copyToClipboard', text);
    };

    it.getAllUrls = function () {
        var urls = [];
        nodes.list.find('.preview').each(function () {
            urls.push($(this).data('url'));
        });
        return urls;
    };

    it.resetTaskList = function () {
        previewList = [];
        taskManager = {};
    };

    it.init();

})(Zepto, this || window);