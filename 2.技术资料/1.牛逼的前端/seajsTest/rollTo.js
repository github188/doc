/**
 * @name rollTo滚动跳转
 * @description 功能模块
 */
define(function(require, exports, module) {
    //引入依赖函数
    require('jquery');
    $.fn.extend({
        rollTo: function(value) {
            var o = {
                oFinish: "body", //要滚动到的元素
                sSpeed: "0", //滚动速度
                bMonitor: false, //是否楼层监听
                sClass: "current", //楼层监听时需要添加的样式
                fnAdditional: "" //追加方法
            }
            o = $.extend(o, value);
            var oThis = $(this),
                targetOffset = $(o.oFinish).offset().top;
            oThis.click(function() {
                $("html,body").stop(true, true).animate({
                    scrollTop: targetOffset
                }, o.sSpeed);
                o.sSpeed == 0 && $("body").stop(true, true);
                o.fnAdditional && o.fnAdditional();
            });
            if (o.bMonitor) {
                $(window).bind("scroll load", function(event) {
                    if ($(this).scrollTop() >= targetOffset) {
                        oThis.addClass(o.sClass).siblings().removeClass(o.sClass);
                    }
                });
            }
            return $(this);
        }
    });
});