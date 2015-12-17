(function ($) {

    var name = 'clipboard';

    function copyTextToClipboard(text) {
        var el = $('<textarea></textarea>').css({
            position: 'absolute',
            left: '-10000px'
        }).val(text);

        $(document.body).append(el);

        el.get(0).select();

        try {
            var successful = document.execCommand('copy');
            channel.fire('tips', 'show', successful ? '成功复制到剪切板' : '复制失败, 请手动进行');
        } catch (err) {
            channel.fire('tips', 'show', '无法复制, 请手动进行');
        }

        el.remove();
    };

    channel.register(name, 'copy', copyTextToClipboard);
})(Zepto);