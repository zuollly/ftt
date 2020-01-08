// 根据图片的父级元素的固定高宽对显示图片进行定位处理
// 父级overflow: hidden; position: relative;
export function LoadedHandler(el, naturalHeight, naturalWidth, parentHeight, parentWidth) {
  var re_new_size = function(r) {
    // 根据比率重新计算宽度
    return { w: naturalWidth / r, h: naturalHeight / r }
  }
  var re_offset = function(n) {
    // 根据新的宽高度返回偏移量
    return { off_l: (n.w - parentWidth) * 0.5, off_t: (n.h - parentHeight) * 0.5 }
  }
  var re_position = function(o, n) {
    // 重新定位图片
    el.setAttribute('style', 'position: absolute; top:' + -o.off_t + 'px;left:' + -o.off_l + 'px; width:' + n.w + 'px;height:' + n.h + 'px;')
  }
  var execute = function(rate) { // 总执行函数
    var new_size = re_new_size(rate)
    var offset_new = re_offset(new_size)
    re_position(offset_new, new_size)
  }
  var rate_of_w = naturalWidth / parentWidth
  var rate_of_h = naturalHeight / parentHeight
  var rate = ''
  if (rate_of_w >= 1) {
    // 图片宽度大于显示区域宽度
    if (rate_of_h >= 1) {
      // 且图片高度大于显示区域高度
      rate = Math.min(rate_of_w, rate_of_h)
    } else {
      // 图片高度小于显示区域
      rate = naturalHeight / parentHeight
    }
  } else {
    // 图片宽度小于显示区域宽度
    if (rate_of_h >= 1) {
      // 且图片高度大于显示区域高度
      rate = naturalWidth / parentWidth
    } else {
      // 图片高度小于显示区域高度
      rate = Math.min(rate_of_w, rate_of_h)
    }
  }
  execute(rate)
}
