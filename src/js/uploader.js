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
        },
        copyAllToClipboard: function () {
            var urls = it.getAllUrls();
            it.copyAllToClipboard(urls.join('\n'));
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
            channel.fire(it.name, 'uploadComplete');
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
                    it.uploaded(i, url);
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
            previewList[i].addClass('uploaderr');
            taskManager.status[i] = 'rejected';
            it.uploadQueueCompleteScan();
        }
    };

    it.uploaded = function (i, url) {
        if (url && taskManager.status && taskManager.status[i] !== 'rejected') {
            global.clearTimeout(taskManager.status[i]);
            taskManager.status[i] = 'resloved';

            var previewEL = previewList[i];
            var p = new Image;
            p.onload = function () {
                previewEL.data('url', url).addClass('uploaded');
                previewEL.find('.picture').css('background-image', 'url(' + url + ')');
                var copyBtn = $('<button></button>').addClass('fa fa-copy');
                copyBtn.on('click', function () {
                    var el = $(this);
                    it.copyTextToClipboard(el.parents('.preview').data('url'));
                    el.removeClass('fa-copy').addClass('fa-check');
                    global.setTimeout(function () {
                        el.removeClass('fa-check').addClass('fa-copy');
                    }, 1500);
                });
                previewEL.append(copyBtn);
            };
            p.src = url;
            it.uploadQueueCompleteScan();

        }
    };

    it.copyTextToClipboard = function (text) {
        var el = $('<textarea></textarea>').css({
            //position: 'absolute',
            //left: '-10000px'
        }).val(text);

        nodes.body.append(el);

        el.get(0).select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        el.remove();
    };

    it.getAllUrls = function () {
        var urls = [];
        nodes.list.find('.preview button').each(function () {
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