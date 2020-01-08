<template>
<div>
  <div>
    <label class="el-button el-button--default el-button--medium" for="uploadImg">编辑图片</label>
    <input type="file" id="uploadImg" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 2)">
    <!--<el-upload-->
      <!--class="avatar-uploader"-->
      <!--ref="upload"-->
      <!--:auto-upload="false"-->
      <!--:show-file-list="false"-->
      <!--:on-remove="handleRemove"-->
      <!--:on-change="changePreview">-->
      <!--<el-button size="small" >编辑图片</el-button>-->
    <!--</el-upload>-->
  </div>
  <el-dialog
    title="提示"
    :visible.sync="dialogCropper"
    :width="dialogWidth"
    :before-close="handleClose">
    <div class="lay-cropper">
      <div class="lay-cropper-body">
      <div class="lay-cropper-cube">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
          @imgLoad="imgLoad"></vueCropper>
      </div>
      <div class="lay-cube-preview">
        <div class="lay-preview">
          <div :style="previews.div" class="rounded">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
        <div class="lay-preview">
          <div :style="previewStyle1">
            <div :style="previews.div" class="rounded">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>
        <div class="lay-preview">
          <div :style="previewStyle2">
            <div :style="previews.div" class="rounded">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>
      </div>
    </div>
      <div class="lay-cropper-footer">
        <div class="lay-cropper-scope-btn">
          <label class="el-button el-button--success el-button--medium" for="uploads">更换图片</label>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
          <el-button size="small" @click="changeScale(1)">+</el-button>
          <el-button size="small" @click="changeScale(-1)">-</el-button>
          <el-button size="small" @click="rotateLeft">↺</el-button>
          <el-button size="small" @click="rotateRight">↻</el-button>
        </div>
        <div class="lay-cropper-upload-btn">
          <el-button type="primary" size="small" :loading="loading" @click="finish()">保存</el-button>
          <el-button type="primary" size="small"  @click="down('blob')">下载</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { upImgLogo } from '@/api/app'
export default {
  name: 'LayCropper',
  components: {
    VueCropper
  },
  data() {
    return {
      dialogCropper: false,
      isUpImg: false,
      loading: false,
      fileInfo: {},
      modelSrc: '',
      previews: {},
      previewStyle1: {},
      previewStyle2: {},
      option: {
        img: this.upImgPath,
        size: 1,
        full: false, // 是否输出原图比例的截图 props名full
        outputType: this.cropOutputType, // 输出图片格式
        original: false, // 上传图片是否显示原始宽高 (针对大图 可以铺满)
        high: true, // 是否根据dpr生成适合屏幕的高清图片
        infoTrue: false, // 截图信息展示是否是真实的输出宽高
        canMove: true, // 能否拖动图片
        canMoveBox: true, // 能否拖动截图框
        autoCrop: true, // 是否自动生成截图框
        autoCropWidth: this.cropWidth, // 自动生成截图框的宽高
        autoCropHeight: this.cropHeight,
        centerBox: false, // 截图框是否限制在图片里(只有在自动生成截图框时才能生效)
        fixedBox: true, // 截图框固定大小
        mode: 'contain' // contain | cover | 400px auto | auto 400px | 50% | auto 50% 类似css background属性设置  设置不符合规范不生效， 参照文档说明
      }
    }
  },
  props: {
    dialogWidth: { // 弹出框的宽度
      type: String,
      default: '70%'
    },
    upImgPath: { // 默认裁剪图片
      type: String,
      default: 'http://cdn.xyxiao.cn/Landscape_1.jpg'
    },
    cropOutputType: { // 输出图片格式
      type: String,
      default: 'png'
    },
    cropWidth: {
      type: Number,
      default: 120
    },
    cropHeight: {
      type: Number,
      default: 120
    }
  },
  methods: {
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 实时预览函数
    realTime(data) {
      var previews = data
      var h = 0.5
      var w = 0.25
      this.previewStyle1 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: h
      }
      this.previewStyle2 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: w
      }
      this.previews = data
    },
    finish(type) {
      var _this = this
      _this.loading = true
      if (type === 'blob') {
        _this.$refs.cropper.getCropBlob(data => {
          var img = window.URL.createObjectURL(data)
          _this.modelSrc = img
          upImgLogo({ file: data }).then(res => {
            _this.$emit('cropped', img)
            // _this.isUpImg = true
            _this.loading = false
          })
        })
      } else {
        _this.$refs.cropper.getCropData(data => {
          _this.model = true
          if (_this.modelSrc !== data) {
            _this.modelSrc = data
          } else {
            _this.$message({
              type: 'error',
              message: '请不要多次保存同一张图'
            })
            _this.loading = false
            return false
          }
          var result = { file: data }
          upImgLogo({ file: data }).then(res => {
            if (res.data.code === 200) {
              _this.option.img = ''
              result.result = res.data.result
              _this.$emit('cropped', result)
              _this.isUpImg = true
              // _this.dialogCropper = false
              _this.$message({
                type: 'success',
                message: '上传成功'
              })
            } else {
              _this.$message({
                type: 'error',
                message: '上传失败'
              })
            }
            _this.loading = false
          })
        })
      }
    },
    down(type) {
      // event.preventDefault()
      var aLink = document.createElement('a')
      aLink.download = 'MyLogo'
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          this.downImg = window.URL.createObjectURL(data)
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.downImg = data
          aLink.href = data
          aLink.click()
        })
      }
    },
    changePreview(file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      console.log(file)
      this.$nextTick(() => {
        this.fileInfo.name = file.name
        this.option.img = URL.createObjectURL(file.raw)
        this.dialogCropper = true
        this.isUpImg = false
      })
    },
    uploadImg(e, num) {
      // 上传图片
      // this.option.img
      console.log(e)
      var _this = this
      var file = e.target.files[0]
      _this.fileInfo.name = file.name
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          _this.option.img = data
        } else if (num === 2) {
          _this.dialogCropper = true
          _this.option.img = data
        }
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      _this.isUpImg = false
      reader.readAsArrayBuffer(file)
    },
    imgLoad(msg) {
      console.log(msg)
    },
    handleClose(done) {
      if (this.isUpImg) {
        this.$confirm('还没有上传裁剪好的图片，确认关闭？')
          .then(_ => {
            done()
            document.getElementById('uploadImg').value = ''
          })
          .catch(_ => {})
      } else {
        done()
        document.getElementById('uploadImg').value = ''
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.lay-cropper{
  .lay-cropper-body{
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
  }
  .lay-cropper-cube{
    width: 400px;
    height: 320px;
  }
  .lay-cube-preview{
    padding: 0 20px;
  }
  .lay-preview{
    overflow: hidden;
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0px;
    }
  }
  .lay-cropper-footer{
    margin-top: 15px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .lay-cropper-scope-btn{
      width: 400px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;
    }
    .lay-cropper-upload-btn{
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
    }
  }
}
</style>
