<template>
  <textarea :id="tinymceId" :value="value"></textarea>
</template>
<script>
import { uploadFile } from '@/api/file'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/paste' // 这个到最下面那个为需要使用的工具栏模块
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/image'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/media'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
// import pluginsSet from './plugins'
// import toolbarSet from './toolbar'
export default {
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      // editor: null,
      required: true
    },
    setting: {},
    url: { // 接口
      default: '/api/sourceHandle/upload',
      type: String
    },
    accept: { // 文件类型
      default: 'image/jpeg, image/png',
      type: String
    },
    maxSize: { // 大小
      default: 2097152,
      type: Number
    },
    withCredentials: {
      default: false,
      type: Boolean
    },
    height: {
      type: Number,
      required: false,
      default: 360
    },
    imgPath: {
      default: 'http://gzf.test.nercel.cn/workshop/api/sourceHandle/getPicSource/',
      type: String
    },
    pluginsNum: {
      default: 0,
      type: Number
    },
    toolbarNum: {
      default: 0,
      type: Number
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
      // if (this.hasInit) {
        this.$nextTick(() => tinymce.get(this.tinymceId).setContent(val))
      }
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date()
    }
  },
  methods: {
    initTinymce() {
      const _this = this
      console.log(_this.baseUrl)
      const setting = {
        selector: `#${_this.tinymceId}`, // 定义编辑器ID
        skin: 'oxide', // 皮肤
        // theme: 'silver', // 主题
        language: 'zh_CN', // 语言设置中文
        height: _this.height,
        menubar: true, // 去除文件栏
        branding: false, // 去除右下角的'由tinymce驱动'
        elementpath: false, // 左下角的当前标签路径
        resize: false, // 调整窗口大小
        statusbar: false, // 是否应显示编辑器底部的状态栏
        // content_css: ['css文件路径'], // 对编辑器内部需要的一些样式
        // language_url: '../../../../static/tinymce/langs/zh_CN.js', // 导入中文语言文件
        // skin_url: '../../../../static/tinymce/skins/lightgray', // 在node_modules中tinymce文件夹中
        language_url: './static/tinymce/langs/zh_CN.js', // 导入中文语言文件
        skin_url: './static/tinymce/skins/ui/oxide', // 在node_modules中tinymce文件夹中
        toolbar: `styleselect | fontselect | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough | insertfile link image | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | preview removeformat  hr | paste code | undo redo | fullscreen `, // 需要的工具栏
        plugins: `paste importcss image code table advlist fullscreen link lists textcolor colorpicker hr preview`,
        // plugins: pluginsSet[this.pluginsNum], // 对应上方import引入的文件，下面toolbar需要使用到
        // toolbar: toolbarSet[this.toolbarNum], // 定义工具栏
        // toolbar1: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect ',
        // toolbar2: 'forecolor backcolor | bullist numlist | outdent indent | removeformat | link unlink uploadimage | preview fullscreen '
        imageupload_url: _this.url, // 图片上传地址
        setup: function(editor) { // 设置自定义功能的按钮
          editor.ui.registry.addButton('uploadimg', { // 单个按钮，此处的uploading是该按钮的名称
            icon: 'image', // 显示的图像
            tooltip: '上传图片', // 鼠标放上去后现在是内容
            onclick: function() {}
          })
          editor.ui.registry.addButton('geshi', { // 按钮列表，此处的geshi是该按钮的名称
            text: '格式', // 显示的文字
            type: 'menubutton',
            menu: [{
              text: '标签',
              onclick: function() {}
            }]
          })
        },
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        // 上传文件
        file_browser_callback_types: 'file',
        file_picker_callback: function(callback, value, meta) {
          // 为链接对话框提供文件和文本
          // if (meta.filetype == 'file') {
          //   callback('mypage.html', {text: 'My text'});
          // }
          // 为图像对话框提供图像和alt文本
          // if (meta.filetype == 'image') {
          //   callback('myimage.jpg', {alt: 'My alt text'});
          // }
          // 为媒体对话框提供替代源并发布
          // if (meta.filetype == 'media') {
          //   callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
          // }

          // 要先模拟出一个input用于上传本地文件
          var input = document.createElement('input')
          input.setAttribute('type', 'file')
          // 你可以给input加accept属性来限制上传的文件类型
          // 例如：input.setAttribute('accept', '.jpg,.png');
          input.click()
          input.onchange = function() {
            console.log(this.files[0])
            var file = this.files[0]
            // var xhr, formData
            var formData = new FormData()
            formData.append('multipartFile', file, file.name)
            uploadFile(formData).then(res => {
              const str = res.data.result.fileUrl
              const text = res.data.result.fileName
              callback(str, { text: text })
            })
          }
        },
        // 图片上传三个参数，图片数据，成功时的回调函数，失败时的回调函数
        images_upload_handler: function(blobInfo, success, failure) {
          if (blobInfo.blob().size > _this.maxSize) {
            failure('文件体积过大')
          }
          if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
            UploadPic()
          } else {
            failure('图片格式错误')
          }
          function UploadPic() {
            var formData = new FormData()
            // 服务端接收文件的参数名，文件数据，文件名
            formData.append('multipartFile', blobInfo.blob(), blobInfo.filename())
            uploadFile(formData).then(res => {
              // 这里返回的是你图片的地址
              console.log(res)
              const str = res.data.result.filePreseeUrl
              success(str)
            }).catch(() => {
              failure('上传失败')
            })
          }
        }
      }

      Object.assign(setting, _this.setting)
      tinymce.init(setting)
    },
    destroyTinymce() {
      if (tinymce.get(this.tinymceId)) {
        tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      tinymce.get(this.tinymceId).getContent()
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  }
}
</script>
