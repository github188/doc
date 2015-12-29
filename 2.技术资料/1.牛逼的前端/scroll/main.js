
window.onload = function() {
 /*测试数据*/
 var insert = '';
 for (var i = 0; i < 80; i++) {
  insert += '<div style = "width:100%; text-align:center;">滑动测试 ' + i + '</div>';
 }
 document.getElementById("moveArea").innerHTML = insert;
 /*测试数据   */
 var at = new appTouch({
  tContain : 'appArea', //必选：滑动区域id
  tMove : 'moveArea', //必选：移动区域id
  tScroller : 'scroller', //必选：自定义滚动条
  tScrollerArea : 'scrollerArea'//必选：滚动条区域
 }, onmoveend);
 //到顶/底回调
 function onmoveend(m) {
  //console.log(m);
 }  
 }
/*=====================
 * 名称: appTouch
 * 功能: web app滑动模拟组件
 * 参数: 相关配置
 ======================*/
var appTouch = function(config, callback) {
 this.touchContain = config.tContain;
 this.touchMove = config.tMove;
 this.touchScroller = config.tScroller;
 this.touchScrollerArea = config.tScrollerArea;
 this.callbackfn = callback;
 this.move();
} 
 appTouch.prototype = {
 move : function(e) {
  var monitor = document.getElementById(this.touchContain), //监听容器
  target = document.getElementById(this.touchMove), //移动目标
  scroller = document.getElementById(this.touchScroller), //自定义滚动条
  scrollerArea = document.getElementById(this.touchScrollerArea), //滚动条区域
  sheight = monitor.offsetHeight / target.offsetHeight * monitor.offsetHeight, //自定义滚动条的长度
  st = (target.offsetHeight - monitor.offsetHeight) / (monitor.offsetHeight - sheight), //移动块对应滚轮单位长度
  tslow = 4, //到顶/底减基数
  tMove = 0, //滑块到顶top值
  tMoveL = tMove + 140, //到顶允许下拉范围
  bMove = monitor.offsetHeight - target.offsetHeight, //滑块到底top值
  bMoveL = bMove - 140, //到底允许上滑范围
  callbackfn = this.callbackfn, //回调函数
  flg = false, //标记是否滑动
  startY, //标记起始位置
  startTop, //标记滑动起始时的高度值
  move = 0;
  //移动距离
  //鼠标事件注册
  addEvent(monitor, 'mousedown', moveStart);
  addEvent(monitor, 'mousemove', moveIn);
  addEvent(monitor, 'mouseup', moveEnd);
  addEvent(window, 'mousemove', moveIn);
  addEvent(window, 'mouseup', moveEnd);
  //移动设备触摸事件注册
  addEvent(monitor, 'touchstart', moveStart);
  addEvent(monitor, 'touchmove', moveIn);
  addEvent(monitor, 'touchend', moveEnd);
  /**
   *外观/门面模式包装
   */
  /*事件监听 */
  function addEvent(el, type, fn) {
   if (el.addEventListener) {
    el.addEventListener(type, fn, false);
   } else if (el.attachEvent) {
    el.attachEvent('on' + type, fn);
   } else {
    el['on' + type] = fn;
   }
  } 
   //取消浏览器默认行为
  function stop(e) {
   //Opera/Chrome/FF
   if (e.preventDefault)
    e.preventDefault();
   //IE
   e.returnValue = false;
  } 
   //包装结束
  /**
   *操作函数
   */
  //惯性缓动参数
  var lastMoveTime = 0;
  var lastMoveStart = 0;
  var stopInertiaMove = false;
  /*移动触发*/
  function moveStart(e) {
   stop(e);
   flg = true;
   if (e.touches)
    e = e.touches[0];
   startY = e.clientY;
   startTop = target.style.top || 0;
   //惯性缓动
   lastMoveStart = startY;
   lastMoveTime = new Date().getTime();
   stopInertiaMove = true;
   scrollerArea.style.visibility = 'visible'; 
   } 
   /*移动过程中*/
  function moveIn(e) {
   if (flg) {
    stop(e);
    if (e.touches)
     e = e.touches[0];
    move = e.clientY - startY + parseInt(startTop);
    if (move > tMove) {
     (move - tMove) / tslow + tMove > tMoveL ? move = tMoveL : move = (move - tMove) / tslow + tMove 
     } else if (move < bMove)
     (move - bMove) / tslow + bMove < bMoveL ? move = bMoveL : move = (move - bMove) / tslow + bMove;
    target.style.top = move + 'px';
    scroller.style.top = -move / st + 'px';
    //惯性缓动
    var nowTime = new Date().getTime();
    stopInertiaMove = true;
    if (nowTime - lastMoveTime > 300) {
     lastMoveTime = nowTime;
     lastMoveStart = e.clientY;
    }
   }
  } 
   /*移动结束*/
  function moveEnd(e) {
   stop(e);
   if (e.touches)
    e = e.touches[0];
   //惯性缓动
   var contentTop = target.style.top.replace('px', '');
   var contentY = (parseInt(contentTop) + e.clientY - lastMoveStart);
   var nowTime = new Date().getTime();
   var v = (e.clientY - lastMoveStart) / (nowTime - lastMoveTime);
   //最后一段时间手指划动速度
   stopInertiaMove = false;
   (function(v, startTime, contentY) {
    var dir = v > 0 ? -1 : 1;
    //加速度方向
    var deceleration = dir * 0.005;
    function inertiaMove() {
     if (stopInertiaMove)
      return;
     var nowTime = new Date().getTime();
     var t = nowTime - startTime;
     var nowV = v + t * deceleration;
     var moveY = (v + nowV) / 2 * t;
     // 速度方向变化表示速度达到0了
     if (dir * nowV > 0) {
      if (move > tMove) {
       callbackfn('到顶了');
       target.style.top = tMove + 'px';
       scroller.style.top = tMove + 'px';
      } else if (move < bMove) {
       callbackfn('到底了');
       target.style.top = bMove + 'px';
       scroller.style.top = -bMove / st + 'px';
      }
      setTimeout(function() {
       if (!stopInertiaMove)
        scrollerArea.style.visibility = 'hidden';
      }, 4000);
      return;
     }
     move = contentY + moveY;
     if (move > tMove) {
      t /= 20;
      move = (move - tMove) / 10 + tMove;
     } else if (move < bMove) {
      t /= 20;
      move = (move - bMove) / 10 + bMove;
     }
     target.style.top = move + "px";
     scroller.style.top = -move / st + 'px';
     setTimeout(inertiaMove, 10);
    } 
     inertiaMove();
   })(v, nowTime, contentY);
   move = 0;
   flg = false;
  } 
   //操作结束
  /**
   *相关初始化
   */
  //滚动条长度初始化
  scroller.style.height = sheight + 'px';
  //初始化结束 
  },
 otherInteract : function() {
  //其他功能扩充
 }
}
 