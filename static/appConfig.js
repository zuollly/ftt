module.exports = {
  cfg_basehost: 'http://yx.nercel.cn/ms/', // 站点根网址
  cfg_fileBasehost: 'http://yx.nercel.cn/msapi/file/icon/', // 文件站点根网址
  cfg_upfile_path: 'http://yx.nercel.cn/msapi/zuul/tool/file/upload', // 文件上传服务器地址
  cfg_indexurl: '/', // 网页主页链接
  cfg_indexname: '主页', // 主页链接名
  cfg_webname: '兵团名师工作室', // 网站名称
  cfg_weblogo: './static/images/logo.svg', // 网站名称
  cfg_webslogan: '专业挖坑小队提供最优挖坑服务，坑是种能力，你值得拥有',
  cfg_powerby: 'Copyright &copy; 2018-2020 HDGS. 华大国数 版权所有', // 网站版权信息
  cfg_keywords: '', // 站点默认关键字
  cfg_description: '', // 站点描述
  cfg_beian: '', // 网站备案号
  cfg_titleLength: 50, // 标题类字符长度
  cfg_disc: 5000, // 描述类字符长度
  cfg_forget_path: 'http://ps.test.nercel.cn/userOperation/getRetrievePassword', // K12找加密码入口
  cfg_register_path: 'http://ps.test.nercel.cn/user_register.jsp', // K12注册入口
  cfg_distanceimg_path: '', // 远程图片地址 http://ps.test.nercel.cn
  cfg_up_path: 'http://gzf.test.nercel.cn/workshop/api/sourceHandle/getPicSource/',
  cfg_img_loading: './static/images/loading.svg', // 图片懒加载等待
  cfg_ddimg_width: '', // 缩略图默认宽度
  cfg_ddimg_height: '', // 缩略图默认高度
  cfg_imgtype: '', // 图片上传文件类型
  cfg_softtype: '', // 允许上传的软件类型
  cfg_mediatype: '', // 允许的多媒体文件类型
  cfg_max_face: '', // 会员上传头像大小限制(单位：KB)
  cfg_workshop_Logo: './static/images/workshopLogo.png', // 工作坊默认LOGO
  cfg_workshop_banner: './static/images/topBanner.jpg', // 工作坊默认LOGO
  cfg_user_face_not: './static/images/photoUserNot.svg', // 暂无或加载出错用户头像
  cfg_thumbnail_not: './static/images/photoNot.svg', // 暂无或加载出错缩略图
  cfg_data_not: './static/images/dataNot.svg', // 暂无数据图片
  cfg_data_not_disc: '暂时没有找到您需要的数据，十分抱歉！您可以先看看别的' // 暂无数据的描述信息 $store.getters.appConfig.cfg_data_not_disc
}
