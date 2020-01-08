// 客户端facility相关信息
/**
 * @desc  判断浏览器的版本以及浏览器内核
 * @author Nick
 * @date  2018年12月25日
 */
// 获取设备信息：是否手机
// 判断是否是手机端
export function getMobile() {
  var mobile = navigator.userAgent.match(/iphone|android|phone|mobile|wap|netfront|x11|java|operamobi|operamini|ucweb|windowsce|symbian|symbianos|series|webos|sony|blackberry|dopod|nokia|samsung|palmsource|xda|pieplus|meizu|midp|cldc|motorola|foma|docomo|up.browser|up.link|blazer|helio|hosin|huawei|novarra|coolpad|webos|techfaith|palmsource|alcatel|amoi|ktouch|nexian|ericsson|philips|sagem|wellcom|bunjalloo|maui|smartphone|iemobile|spice|bird|zte-|longcos|pantech|gionee|portalmmm|jig browser|hiptop|benq|haier|^lct|320x320|240x320|176x220/i) !== null
  return mobile
}
export function getBrowser() {
  var agent = navigator.userAgent
  var ua = agent.toLowerCase()
  var version = navigator.appVersion
  var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/
  var m = ua.match(re)
  var browser = {
    trident: agent.indexOf('Trident') > -1, // IE内核
    presto: agent.indexOf('Presto') > -1, // opera内核
    webKit: agent.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: agent.indexOf('Firefox') > -1, // 火狐内核Gecko
    mobile: !!agent.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios
    android: agent.indexOf('Android') > -1 || agent.indexOf('Linux') > -1, // android
    iPhone: agent.indexOf('iPhone') > -1, // iPhone
    iPad: agent.indexOf('iPad') > -1, // iPad
    webApp: agent.indexOf('Safari') > -1, // Safari
    isIE: agent.indexOf('compatible') > -1 && agent.indexOf('MSIE') > -1, // 判断是否IE<11浏览器
    isEdge: agent.indexOf('Edge') > -1, // 判断是否IE的Edge浏览器
    isIE11: agent.indexOf('Trident') > -1 && agent.indexOf('rv:11.0') > -1,
    ie: /(msie\s|trident.*rv:)([\w.]+)/.test(agent), // 检测当前浏览器是否为IE
    quirks: (document.compatMode === 'BackCompat'), // 检测当前浏览器是否处于“怪异模式”下
    mac: (agent.indexOf('macintosh') > -1) // 检测当前浏览器是否是运行在mac平台下
  }
  var browserInfo = {
    facility: browser.mobile ? 'Mobile' : 'PC', // ipad pc mobile
    isMobile: browser.mobile,
    system: 'ios', // ios Android Linux Unix
    mobile: '',
    browserName: 'other', // IE
    version: version,
    is360: false,
    screenWidth: screen.width,
    screenHeight: screen.height
  }
  if (browser.mobile) {
    if (agent.match(/MicroMessenger/i) === 'micromessenger') {
      // 在微信中打开
      // setInterval(WeixinJSBridge.call('closeWindow'), 2000)
      browserInfo.browserName = 'winxin'
    }
    if (agent.match(/WeiBo/i) === 'weibo') {
      // 在新浪微博客户端打开
      browserInfo.browserName = 'weibo'
    }
    if (agent.match(/QQ/i) === 'qq') {
      // 在QQ空间打开
      browserInfo.browserName = 'qq'
    }
    if (browser.ios) {
      // 是否在IOS浏览器打开
      browserInfo.browserName = 'ios'
      if (browser.iPhone) browserInfo.mobile = 'iPhone'
      if (browser.iPad) browserInfo.mobile = 'iPad'
    }
    if (browser.android) {
      // 是否在安卓浏览器打开
      browserInfo.browserName = 'android'
      browserInfo.mobile = 'android'
    }
  } else {
    browser.gecko = (navigator.product === 'Gecko' && !browser.webkit && !browser.opera && !browser.ie)
    if (browser.isIE) {
      var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(agent)
      var fIEVersion = parseFloat(RegExp['$1'])
      browserInfo.browserName = 'IE'
      browserInfo.version = fIEVersion
    } else if (browser.isIE11) {
      browserInfo.browserName = 'IE'
      browserInfo.version = 11
    }

    if (agent.indexOf('WOW') < 0 && agent.indexOf('Edge') > -1 && !browser.isIE) { browserInfo.browserName = 'Edge'; browserInfo.version = m[2] }
    if (browser.gecko && agent.indexOf('Firefox') > -1) { browserInfo.browserName = 'Firefox'; browserInfo.version = m[2] }
    if (/chrome\/(\d+\.\d)/i.test(agent) && agent.indexOf('Edge') < 0) { browserInfo.browserName = 'Chrome'; browserInfo.version = m[2] }
    if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) { browserInfo.browserName = 'Safari'; browserInfo.version = m[2] }
    if (browser.opera) { browserInfo.browserName = 'Opera'; browserInfo.version = m[2] }
    // 360兼容
    if (agent.indexOf('WOW') > -1 && agent.indexOf('NET') > -1 && agent.indexOf('rv') > -1 && agent.indexOf('Touch') < 0) {
      browserInfo.is360 = true
      browserInfo.browserName = '360兼容模式'
    }
    if (agent.indexOf('WOW') > -1 && agent.indexOf('NET') < 0 && agent.indexOf('Firefox') < 0) {
      if (navigator.javaEnabled()) {
        browserInfo.is360 = true
        browserInfo.browserName = '360安全浏览器-极速模式'
      } else {
        browserInfo.is360 = true
        browserInfo.browserName = '360极速浏览器-极速模式'
      }
    }

    var isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
    var isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
    if (isMac) browserInfo.system = 'Mac'
    var isUnix = (navigator.platform === 'X11') && !isWin && !isMac
    if (isUnix) browserInfo.system = 'Unix'
    var isLinux = (String(navigator.platform).indexOf('Linux') > -1)
    var bIsAndroid = agent.toLowerCase().match(/android/i) === 'android'
    if (isLinux) {
      if (bIsAndroid) browserInfo.system = 'Android'
      else browserInfo.system = 'Linux'
    }
    if (isWin) {
      var isWin2K = agent.indexOf('Windows NT 5.0') > -1 || agent.indexOf('Windows 2000') > -1
      if (isWin2K) browserInfo.system = 'Win2000'
      var isWinXP = agent.indexOf('Windows NT 5.1') > -1 || agent.indexOf('Windows XP') > -1
      if (isWinXP) browserInfo.system = 'WinXP'
      var isWin2003 = agent.indexOf('Windows NT 5.2') > -1 || agent.indexOf('Windows 2003') > -1
      if (isWin2003) browserInfo.system = 'Win2003'
      var isWinVista = agent.indexOf('Windows NT 6.0') > -1 || agent.indexOf('Windows Vista') > -1
      if (isWinVista) browserInfo.system = 'WinVista'
      var isWin7 = agent.indexOf('Windows NT 6.1') > -1 || agent.indexOf('Windows 7') > -1
      if (isWin7) browserInfo.system = 'Win7'
      var isWin10 = agent.indexOf('Windows NT 10.0') > -1
      if (isWin10) browserInfo.system = 'Win10'
    }
  }
  return browserInfo
}

