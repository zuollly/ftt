/*
  * @description 根据文件名后缀区分 文件类型
  * author zuoly
  * @param: fileName - 文件名称
  * @param: 数据返回 1) 无后缀匹配 - false
  * @param: 数据返回 2) 匹配图片 - image
  * @param: 数据返回 3) 匹配 txt - txt
  * @param: 数据返回 4) 匹配 excel - excel
  * @param: 数据返回 5) 匹配 word - word
  * @param: 数据返回 6) 匹配 pdf - pdf
  * @param: 数据返回 7) 匹配 ppt - ppt
  * @param: 数据返回 8) 匹配 视频 - video
  * @param: 数据返回 9) 匹配 音频 - radio
  * @param: 数据返回 10) 其他匹配项 - other
  */
export function matchFileType(fileName) {
  // 后缀获取
  let suffix = ''
  // 获取类型结果
  let result = ''
  try {
    const flieArr = fileName.split('.')
    suffix = flieArr[flieArr.length - 1]
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false
    return result
  }
  // 图片格式
  const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
  // 进行图片匹配
  result = imglist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'image'
    return result
  };
  // 匹配txt
  const txtlist = ['txt']
  result = txtlist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'txt'
    return result
  };
  // 匹配 excel
  const excelist = ['xls', 'xlsx']
  result = excelist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'excel'
    return result
  };
  // 匹配 word
  const wordlist = ['doc', 'docx', 'DOC', 'DOCX']
  result = wordlist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'word'
    return result
  };
  // 匹配 pdf
  const pdflist = ['pdf']
  result = pdflist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'pdf'
    return result
  }
  // 匹配 ppt
  const pptlist = ['ppt', 'pptx', 'PPT', 'PPTX']
  result = pptlist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'ppt'
    return result
  }
  // 匹配 视频
  const videolist = ['mp4', 'm2v', 'mkv']
  result = videolist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'video'
    return result
  };
  // 匹配 音频
  const radiolist = ['mp3', 'wav', 'wmv']
  result = radiolist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'radio'
    return result
  }
  // 匹配 压缩文件
  const rarlist = ['rar', 'zip', 'RAR', 'ZIP']
  result = rarlist.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'rar'
    return result
  }
  // 其他 文件类型
  result = 'other'
  return result
}
