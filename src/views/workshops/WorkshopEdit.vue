<template>
  <div class="editWorkshop">
    <!-- 封面 -->
    <div class="top">
      <!-- 没有图片时的遮罩 -->
      <!-- <div class="cover" v-if="!hasCover"></div> -->
      <p class="cvoerBgi">
        <img :src="coverUrl" alt="">
      </p>
      <!-- 上传的loading -->
      <span class="uploadLoading" v-if="coverLoading"><i class="el-icon-loading"></i></span>
      <!-- <img :src="coverUrl" alt="pic" v-if="coverUrl" > -->
      <el-upload
        class="uploadPic"
        action="http://yx.nercel.cn/msapi/zuul/tool/file/upload"
        name="multipartFile"
        :show-file-list='false'
        :headers='headers'
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
        :on-error='errFunction'
        :on-remove="handleRemove">
        <el-button class="uploadBtn" icon="el-icon-upload" circle v-hover="'上传'" type="success"></el-button>
      </el-upload>
    </div>
    <!-- 表单 -->
    <div class="form">
      <!-- picture -->
      <div class="picture">
        <el-upload
          class="avatar-uploader"
          action="http://yx.nercel.cn/msapi/zuul/tool/file/upload"
          name="multipartFile"
          :show-file-list="false"
          :on-error='errorFunction'
          :headers='headers'
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <span class="uploadLoading" v-if="logoLoading"><i class="el-icon-loading"></i></span>
          <p class="cvoerLogo" :style="{ backgroundImage: `url(${imageUrl})` }"></p>
          <p class="mt-2"><el-button size="small" style="width: 100%">修改Logo</el-button></p>
        </el-upload>
      </div>
      <el-form ref="form" :model="form" label-width="240px">
        <el-form-item label="工作室名称" required>
          <el-col :span="12">
            <el-input v-model="form.shopName" class="input"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="关联学段学科" required>
          <el-col :span="12">
            <faculty @faculty='subject' :selected='facultyParam'></faculty>
          </el-col>
        </el-form-item>
        <el-form-item label="工作坊介绍">
          <el-col :span="18">
            <tinymce :value='form.groupIntroduction' v-model="form.groupIntroduction" :height="200"></tinymce>
          </el-col>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="updateWorkshop" round>确定</el-button>
           <el-button @click="cancelUpdate" round>取消</el-button>
         </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/storage/cookies'
import store from '@/store'
import { updatedWorkshop } from '@/api/workshop.js'
import appConfig from '../../../static/appConfig.js'
export default {
  name: 'WorkshopEdit',
  components: {
    faculty: () => import('./modules/studyphase.vue'),
    tinymce: () => import('@/components/tinymce')
  },
  data() {
    return {
      appConfig: appConfig,
      imageUrl: '',
      form: {
        shopName: '',
        groupIntroduction: '',
        shoperInfo: {}
      },
      faculty: {},
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      facultyParam: {}, // 编辑的已有的学段学科
      headers: {
        enctype: 'multipart/form-data',
        'Authorization': `Bearer ${getToken()}`
      },
      coverUrl: '',
      coverLoading: false,
      logoLoading: false
    }
  },
  computed: {
    ...mapGetters(['uuid', '', 'workshopInfo'])
  },
  mounted() {
    this.getWorkshopInfo()
  },
  watch: {
    workshopInfo: {
      handler() {
        if (this.workshopInfo) {
          this.getWorkshopInfo()
        }
      }
    }
  },
  methods: {
    getWorkshopInfo() {
      // 获取工作坊的详情
      const result = this.workshopInfo
      this.form = {
        shopName: result.groupName || '',
        groupIntroduction: result.groupIntroduction || '',
        shoperInfo: { id: result.adminUserId, name: result.adminUserName }
      }
      this.dynamicTags = result.label ? result.label.split(',') : []
      this.facultyParam = {
        phaseId: result.groupSegSubs ? result.groupSegSubs[0].segmentCode : '',
        subjectId: result.groupSegSubs ? result.groupSegSubs[0].subjectCode : ''
      }
      this.faculty = {
        phaseId: result.groupSegSubs ? result.groupSegSubs[0].segmentCode : '',
        subjectId: result.groupSegSubs ? result.groupSegSubs[0].subjectCode : ''
      }

      this.coverUrl = result.groupImg || this.appConfig.cfg_workshop_banner
      this.imageUrl = result.groupLogo || this.appConfig.cfg_workshop_Logo
    },
    subject(data) {
      // 学段学科
      this.faculty = data
    },
    /* 工作坊头像 */
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.code === 200) {
        this.imageUrl = res.result.fileUrl
      } else {
        this.$message.warning(res.msg)
      }
      this.logoLoading = false
    },
    errorFunction() {
      this.$message.error('上传失败!')
      this.logoLoading = false
    },
    beforeAvatarUpload(file) {
      this.logoLoading = true
      return this.fileType(file, 'image', 10)
    },
    /* 封面图片 */
    uploadSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      if (response.code === 200) {
        this.coverUrl = response.result.fileUrl
      } else {
        this.$message.error(response.msg)
      }
      this.coverLoading = false
    },
    beforeUpload(file) {
      this.coverLoading = true
      return this.fileType(file, 'image', 10)
    },
    errFunction(err, file, fileList) {
      console.dir(err)
      this.$message.error('上传失败!')
      this.coverLoading = false
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    updateWorkshop() {
      // 编辑
      if (!this.filter()) return
      const div = document.createElement('div')
      div.innerHTML = this.form.groupIntroduction
      const params = {
        id: this.$route.params.id,
        adminUserId: this.form.shoperInfo.id,
        groupImg: this.coverUrl,
        groupLogo: this.imageUrl,
        groupIntroduction: this.form.groupIntroduction,
        groupDescription: div.innerText.substr(0, 100),
        segSubs: [{ segmentCode: this.faculty.phaseId, subjectCode: this.faculty.subjectId }],
        groupName: this.form.shopName
      }
      this.updateGroup(params)
        .then(data => {
          console.log(data)
          if (data.data.code === 200) {
            this.$message.success('修改成功')
            store.dispatch('GetWorkshopDetails', {
              id: this.$route.params.id
            }).then(() => {
              this.$router.push({
                path: `/workshops/${this.$route.params.id}`
              })
            })
          } else {
            this.$message.warning(data.data.msg)
          }
          this.coverLoading = false
        })
        .catch(() => {
          this.coverLoading = false
        })
    },
    cancelUpdate() {
      this.$router.push({ path: `/workshops/${this.$route.params.id}` })
    },
    /* utils */
    filter() {
      // 验证
      if (!this.form.shopName) {
        this.$message({ message: '请输入工作室名称', type: 'warning' })
        return false
      }
      if (!this.faculty.phaseId) {
        this.$message({ message: '请选择学段', type: 'warning' })
        return false
      }
      if (!this.faculty.subjectId) {
        this.$message({ message: '请选择学科', type: 'warning' })
        return false
      }
      return true
    },
    fileType(file, type, size) {
      const isJPG = file.type.indexOf(type) > -1
      const isLt2M = file.size / 1024 / 1024 < size

      if (!isJPG) {
        this.$message.error('只能上传图片!')
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 ${size}MB!`)
      }
      return isJPG && isLt2M
    },
    /* axios----- */
    updateGroup(params) {
      // 更新工作坊
      return new Promise((resolve, reject) => {
        updatedWorkshop(params).then(res => {
          resolve(res)
        })
      })
    }
  },
  directives: {
    hover: {
      // 指令的定义
      inserted: function(el, binding) {
        el.onmouseenter = function(e) {
          el.innerHTML = '上传封面'
        }
        el.onmouseout = function(e) {
          el.innerHTML = '<i class="el-icon-upload">'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
$h100: 100px;
$h140: 140px;
.editWorkshop {
  border-radius: 5px;
  overflow: hidden;
  margin: 0 auto;
  padding-bottom: 30px;
  background-color: #fff;

  .top {
    height: 300px;
    margin: 0 auto;
    position: relative;
    .cvoerBgi {
      height: 300px;
      background-size: cover;
      background-position: center center;
      filter: brightness(0.8);
      img{
        width: 100%;
        height: 100%;
      }
    }
    .uploadBtn {
      position: absolute;
      right: 15px;
      width: 40px;
      height: 40px;
      z-index: 99;
      top: 8px;
      transition: width 0.3s;
      border-radius: 20px;
      &:hover {
        width: 120px;
      }
    }
    .cover {
      height: 100%;
      background-color: #eee;
    }
    .uploadLoading {
      position: absolute;
      font-size: 40px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #999;
    }
  }
  .form {
    position: relative;
    margin: 0 auto;
    margin-top: 45px;
    padding-left: 180px;
    .uploadLoading {
      position: absolute;
      font-size: 40px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #999;
    }
    .cvoerLogo {
      width: $h140;
      height: $h140;
      background-size: cover;
      background-position: center center;
    }
    .input {
      max-width: 437px;
    }
    // .admin {
    //   transform: translateX(-27px);
    // }
    .shoperBox {
      position: relative;
      max-width: 437px;
      .admin {
        transform: translateY(-50%);
        position: absolute;
        right: 27px;
        top: 20px;
      }
    }
    .shoper {
      max-width: 437px;
      /deep/ .el-input__inner {
        cursor: pointer;
      }
    }
    .picture {
      position: absolute;
      top: -70px;
      left: 20px;
      width: $h140;
      height: $h140;
      background-color: #fafafa;
      border-radius: 5px;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
      .avatar-uploader {
        .el-icon-picture-outline {
          font-size: 50px;
          text-align: center;
          width: $h140;
          margin-top: 50px;
          color: #fff;
        }
        .tip {
          color: #fff;
          transform: translateY(-20px);
        }
        /deep/ .el-upload:hover {
          border-color: #409eff;
        }
        /deep/ .el-upload {
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
      }
      .avatar {
        width: $h140;
        height: $h140;
        display: block;
      }
    }
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 160px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .tag {
    margin-left: 10px;
  }
  .footBtn {
    text-align: center;
    margin-top: 40px;
  }
}
</style>
