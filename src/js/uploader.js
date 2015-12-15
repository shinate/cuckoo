/**
 * Created by shinate on 15/12/15.
 * Depends: queue, copyToClipboard
 */

(function () {

    function pid2url(pid, type) {
        function crc32(str) {
            str = String(str);
            var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
            if (typeof(crc) == "undefined") {
                crc = 0;
            }
            var x = 0;
            var y = 0;

            crc = crc ^ (-1);
            for (var i = 0, iTop = str.length; i < iTop; i++) {
                y = (crc ^ str.charCodeAt(i)) & 0xFF;
                x = "0x" + table.substr(y * 9, 8);
                crc = (crc >>> 8) ^ x;
            }
            return crc ^ (-1);
        };
        var url;
        if (typeof(type) == "undefined") type = 'bmiddle';
        if (pid[9] == 'w') {
            var zone = (crc32(pid) & 3) + 1;
            var ext = (pid[21] == 'g') ? 'gif' : 'jpg';
            url = 'http://ww' + zone + '.sinaimg.cn/' + type + '/' + pid + '.' + ext;
        } else {
            var zone = ((pid.substr(-2, 2), 16) & 0xf) + 1;
            url = 'http://ss' + zone + '.sinaimg.cn/' + type + '/' + pid + '&690';
        }
        return url;
    }

    var uploader = function () {

        var it = {};
        var nodes = {};

        var previewList = [];

        var taskManager = {};

        it.init = function () {
            it.parseDOM();
            it.bind();
            console.log(nodes);
        };

        it.parseDOM = function () {
            nodes.plat = document.querySelector('#plat');
            nodes.platBox = document.querySelector('#plat-box');
            nodes.list = document.querySelector('#list');
        };

        it.bind = function () {
            ['dragenter', 'dragend', 'dragleave', 'dragover', 'drop'].forEach(function (type) {
                nodes.plat.addEventListener(type, it.evts[type], false);
            })
            nodes.platBox.addEventListener('change', it.evts.change, false);
            document.body.addEventListener('paste', it.evts.paste, false);
        };

        it.evts = {
            dragenter: function (e) {
                e.preventDefault();
            },
            dragover: function (e) {
                e.preventDefault();
            },
            dragend: function (e) {
                e.preventDefault();
            },
            dragleave: function (e) {
                e.preventDefault();
            },
            drop: function (e) {
                e.preventDefault();
                //var text;
                //text = e.dataTransfer.getData && e.dataTransfer.getData('text/html');
                //text = text.match(/src\=\"(http.*?)\"/i);
                //text = text && text[1];
                //console.log(text);
                it.readFiles(e.dataTransfer.files);
            },
            change: function () {
                it.readFiles(nodes.platBox.files);
            },
            paste: function (e) {
                e.preventDefault();
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

        it.readFiles = function (files) {
            it.resetTaskList();
            nodes.plat.style.display = 'none';
            var images = it.getImageList(files);
            images.forEach(it.previewTask);
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
                taskManager.upload = queue(1);
            }
            taskManager.upload.defer(function (next) {
                it.uploading(i);
                var data = new FormData();
                data.append("b64_data", imageData.split(',')[1]);
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var rs = JSON.parse(xhr.responseText.substring(xhr.responseText.indexOf('{"')));
                        it.uploaded(i, pid2url(rs.data.pics.pic_1.pid, 'large'));
                        next();
                    }
                };
                xhr.open("POST", "http://picupload.service.weibo.com/interface/pic_upload.php?&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog");
                xhr.send(data);
            });
        };

        it.createPreview = function (dp) {
            var wrap = document.createElement('div');
            wrap.className = 'preview';
            var img = document.createElement('div');
            img.className = 'picture';
            img.style.backgroundImage = 'url(' + dp + ')';
            img.style.borderColor = '#A0A0A0';
            wrap.appendChild(img);
            nodes.list.appendChild(wrap);
            previewList.push(wrap);
        };

        it.uploading = function (i) {
            previewList[i].style.borderColor = '#2fa0ed';
        };

        it.uploaded = function (i, url) {
            var p = new Image();
            p.onload = function () {
                previewList[i].style.borderColor = '#00C813';
                previewList[i].firstChild.style.backgroundImage = 'url(' + url + ')';
                var copyBtn = document.createElement('button');
                copyBtn.className = 'fa fa-clipboard';
                copyBtn.setAttribute('data-url', url);
                copyBtn.onclick = function () {
                    it.copyTextToClipboard(this.getAttribute('data-url'))
                };
                previewList[i].appendChild(copyBtn);
            };
            p.src = url;
        };

        it.copyTextToClipboard = function (text) {
            var textArea = document.createElement("textarea");

            //
            // *** This styling is an extra step which is likely not required. ***
            //
            // Why is it here? To ensure:
            // 1. the element is able to have focus and selection.
            // 2. if element was to flash render it has minimal visual impact.
            // 3. less flakyness with selection and copying which **might** occur if
            //    the textarea element is not visible.
            //
            // The likelihood is the element won't even render, not even a flash,
            // so some of these are just precautions. However in IE the element
            // is visible whilst the popup box asking the user for permission for
            // the web page to copy to the clipboard.
            //
            // Place in top-left corner of screen regardless of scroll position.
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as this gives a negative w/h on some browsers.
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            // We don't need padding, reducing the size if it does flash render.
            textArea.style.padding = 0;
            // Clean up any borders.
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            // Avoid flash of white box if rendered for any reason.
            textArea.style.background = 'transparent';

            textArea.value = text;

            document.body.appendChild(textArea);

            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }

            document.body.removeChild(textArea);
        };

        it.resetTaskList = function () {
            previewList = [];
            taskManager = {};
        };

        it.init();

    }();

})
();