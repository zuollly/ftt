function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}
// 格式时间，变成具体的格式
// 使用 parseTime({y}-{m}-{d})
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    // date = new Date(parseInt(time))
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
// 第二个为时间样式，2天以内用 刚刚，分钟前，小时前来表示，如果超出了这些时间那么就返回具体的时间
export function formatTime(time, option) {
  time = +time * 1000 // 时间戳 以秒算
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}
// 将 HTML 转换为 Markdown 格式文本
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}
// 千位数加
export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

// 图片的 domain
// 如果图片为空是 url = 默认图片地址，如果不为空就检测一下图片是否绝对路径，如果是就直接使用图片
// defaultImg 默认图片
export function domain(photo, url, defaultImg) {
  if (photo === '' || photo === null) {
    return defaultImg
  } else {
    return photo.indexOf('http://') > -1 ? photo : url + photo
  }
}

// 设置字符长度
export function toWordsLFilter(value, length) {
  if (!value) return ''
  if (value.length > length) {
    return value.slice(0, length) + '...'
  }
  return value
}

export function formatFixed(val, length) {
  if (!length || length < 0) length = 2
  if (!val || isNaN(val)) {
    return '0.00'
  }
  const _val = Number(val).toFixed(length) + ''
  return _val.substring(0, _val.indexOf('.') + length + 1)
}

// 富文本图片超出处理
export function transRichImg(val) {
  if (!val) return ''
  return val.replace(/\<img/gi, '<img class="rich-image" ')
}
