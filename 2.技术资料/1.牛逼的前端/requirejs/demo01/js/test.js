define(function () {
    function imgLazyLoad(container) {
        var imgLazyLoadTimer = null;
        var resetImglazy = null;
        container = container || $(window); //需要时jquery对象
        var imgArr = {};
        initImg();
        lazyLoad();
        container.scroll(function () {
            lazyLoad();
        });
        $(window).resize(function () {
            initImg();
        });
        function initImg() {
            $('img').each(function () {
                var el = $(this);
                if (el.attr('lazy-src') && el.attr('lazy-src') != '') {
                    var offset = el.offset();
                    if (!imgArr[offset.top]) {
                        imgArr[offset.top] = [];
                    }
                    imgArr[offset.top].push(el);
                }
            });
        }
        function lazyLoad() {
            var height = container.height();
            var srollHeight = container.scrollTop();
            for (var k in imgArr) {
                if (parseInt(k) < srollHeight + height) {
                    var _imgs = imgArr[k];
                    for (var i = 0, len = _imgs.length; i < len; i++) {
                        var tmpImg = _imgs[i];
                        if (tmpImg.attr('lazy-src') && tmpImg.attr('lazy-src') != '') {
                            tmpImg.attr('src', tmpImg.attr('lazy-src'));
                            tmpImg.removeAttr('lazy-src');
                        }
                    }
                    delete imgArr[k];
                }
            }
        } //lazyLoad
    } //imgLazyLoad
    return imgLazyLoad;
});