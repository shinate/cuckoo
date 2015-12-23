Zepto.fn.parseDOM = (function ($) {
    return function () {
        var nodes = {};
        this.find('[node-type]').each(function () {
            var el = $(this);
            nodes[el.attr('node-type')] = el;
        });
        return nodes;
    }
})(Zepto);