(function ($, global) {

    var Z = 10000;
    var defaultTime = 1500;
    var body = $(document.body);

    var name = 'tips';
    var lsn = {};

    function tip(content, time) {
        function autoHide() {
            lsn.hide = setTimeout(function () {
                //tip.addClass('hide');
                tip.removeClass('show');
                lsn.remove = setTimeout(function () {
                    tip.remove();
                }, 500);
            }, time);
        }

        function clearTimer() {
            lsn.hide && clearTimeout(lsn.hide);
            lsn.remove && clearTimeout(lsn.remove);
        }

        if ($.trim(content)) {
            clearTimer();
            time = time || defaultTime;
            var tip = $('#tips');
            if (tip.length === 0) {
                tip = $('<div id="tips" class="tips"><p></p></div>');
                body.append(tip);
                tip.on('mouseenter', clearTimer).on('mouseleave', autoHide);
            }
            tip.find('p').html(content);
            tip.css('z-index', Z++);
            tip.addClass('show');
            autoHide()
        }
    }

    Channel.register(name, 'show', tip);
    //global['tips'] = tip;

})(Zepto, window);