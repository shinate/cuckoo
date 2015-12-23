(function (global) {

    var name = 'clipboard';

    function copyTextToClipboard(text) {

        var el = document.createElement('textarea');
        el.value = text;
        el.style.cssText = 'position:absolute;left:-10000px';

        document.body.appendChild(el);

        el.select();

        try {
            var successful = document.execCommand('copy');
            Channel.fire('tips', 'show', successful ? '成功复制到剪切板' : '复制失败, 请手动进行');
        } catch (err) {
            Channel.fire('tips', 'show', '无法复制, 请手动进行');
        }

        document.body.removeChild(el);
    };

    Channel.register(name, 'copy', copyTextToClipboard);

    global[name] = {
        name: name,
        copy: copyTextToClipboard
    };

})(this || window);