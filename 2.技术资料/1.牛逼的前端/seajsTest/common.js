/**
 * @name 基础js
 * @description 整站基础js模块
 * @date 2014-12-21
 * @version $V1.0$
 */
define(function(require, exports, module) {
    //引入依赖函数
    require('jquery');
    //--------------------------------------------------【切换栅格模式】
    $(window).bind("load resize", function() {
        if (document.documentElement.clientWidth > 1230) {
            $("body").addClass("full");
            $(".no_full").show();
        } else {
            $("body").removeClass("full");
            $(".no_full").hide();
        }
    });
    //--------------------------------------------------【返回顶部】
    require('module/roll_to');
    var iHeight=$(window).height();
    $(window).bind('scroll', function(event) {
        if ($(window).scrollTop() >= iHeight / 2) {
            $("#quickfloat .top").removeClass('js_hide');
        } else {
            $("#quickfloat .top").addClass('js_hide');
        }
    });
    $("#quickfloat .top").rollTo({
        sSpeed: 500
    });
    //--------------------------------------------------【IE6提示升级跳转】
    if ($.browser.version <= 6) {
        window.location.href = "http://localhost/ie6prompt.html";
    }
});