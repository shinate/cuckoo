// TODO Tieba
//(function ($, global) {
//
//    var tpsURL = 'http://tieba.baidu.com/dc/common/imgtbs';
//
//    var uploadURL = 'http://upload.tieba.baidu.com/upload/pic';
//
//    var activeURL;
//
//    var name = 'app_tieba';
//
//    function upload(imageData, cb) {
//        $.getJSON(tpsURL, function (ret) {
//            if (0 === Number(ret.no) && ret.data.is_login !== 0) {
//                activeURL = uploadURL + '?&tbs=' + ret.data.tbs + '&fid=&save_yun_album=0'
//
//                $.ajax({
//                    url: activeURL,
//                    type: 'OPTIONS'
//                });
//
//                var data = new FormData();
//                //data.append('b64_data', imageData);
//                var blob = new Blob([imageData]);
//                data.append('file', 'a.png');
//                data.append('type', 'image/png');
//                data.append('content', blob);
//                $.ajax({
//                    url: activeURL,
//                    data: data,
//                    type: 'POST'
//                });
//            } else {
//                // fail
//            }
//
//            console.log(activeURL)
//        });
//    }
//
//    global[name] = {
//        upload: upload
//    };
//
//})(Zepto, this || window);