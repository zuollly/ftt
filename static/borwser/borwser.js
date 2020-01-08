function IEVersion() {
  var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+)')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion <= 10) {
      window.location.href = './static/borwser/index.html'
      // window.open('http://localhost:8080/static/borwser/index.html')
      return false
    }
  }
}
IEVersion()
