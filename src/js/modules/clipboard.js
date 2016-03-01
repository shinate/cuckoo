(function (global) {

    var name = 'clipboard';

    var _ = global.i18n;

    function copyTextToClipboard(text) {

        var el = document.createElement('textarea');
        el.value = text;
        el.style.cssText = 'position:absolute;left:-10000px';

        document.body.appendChild(el);

        el.select();

        try {
            var successful = document.execCommand('copy');
            Channel.fire('tips', 'show', successful ? _('Copy to clipboard success') : _('Copy failed, please manually'));
        } catch (err) {
            Channel.fire('tips', 'show', _('Copy failed, please manually'));
        }

        document.body.removeChild(el);
    };

    Channel.register(name, 'copy', copyTextToClipboard);

})(this || window);