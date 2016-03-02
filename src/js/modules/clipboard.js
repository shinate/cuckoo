(function (global) {

    var Channel = require('./Channel');
    var _ = require('./i18n');

    var name = 'clipboard';

    function copyTextToClipboard(text) {

        var el = document.createElement('textarea');
        el.value = text;
        el.style.cssText = 'position:absolute;left:-10000px';

        document.body.appendChild(el);

        el.select();

        try {
            var successful = document.execCommand('copy');
            Channel.fire('tips', 'show', successful ? _('Copy to clipboard successfully') : _('Copy failed, please retry manually'));
        } catch (err) {
            Channel.fire('tips', 'show', _('Copy failed, please retry manually'));
        }

        document.body.removeChild(el);
    };

    Channel.register(name, 'copy', copyTextToClipboard);

})(window);