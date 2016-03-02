(function (global, $) {

    var Channel = require('./Channel');

    var Z = 10000;
    var defaultTime = 2000;
    var body = $(document.body);

    var name = 'tips';
    var lsn;

    var tipEl = $('<div id="tips" class="tips"><p></p></div>');
    body.append(tipEl);
    tipEl.on('mouseenter', clearTimer).on('mouseleave', autoHide);

    function autoHide(time) {
        lsn = global.setTimeout(function () {
            //tip.addClass('hide');
            tipEl.removeClass('show');
        }, time || defaultTime);
    }

    function clearTimer() {
        lsn && clearTimeout(lsn);
    }

    function tip(content, time) {
        if ($.trim(content)) {
            clearTimer();
            tipEl.find('p').html(content);
            tipEl.css('z-index', Z++);
            tipEl.addClass('show');
            autoHide(time || defaultTime);
        }
    }

    Channel.register(name, 'show', tip);

})(window, Zepto);