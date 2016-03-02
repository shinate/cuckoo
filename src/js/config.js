(function (global) {

    var _ = function () {
    };

    _('upload_timeout');
    _('defaultAPP');
    _('language');

    _('en');
    _('zh_CN');
    _('zh_TW');

    global.__CONFIG__ = {
        upload_timeout: 30000,
        defaultAPP: 'weibo',
        language: 'en'
    };

})(window)