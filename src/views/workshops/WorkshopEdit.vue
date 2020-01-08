<template>
  <div class="editWorkshop">
    <!-- 封面 -->
    <div class="top">
      <!-- 没有图片时的遮罩 -->
      <!-- <div class="cover" v-if="!hasCover"></div> -->
      <p class="cvoerBgi" :style="{ backgroundImage: `url(${ coverUrl })` }"></p>
      <!-- 上传的loading -->
      <span class="uploadLoading" v-if="coverLoading"><i class="el-icon-loading"></i></span>
      <!-- <img :src="coverUrl" alt="pic" v-if="coverUrl" > -->
      <el-upload
        class="uploadPic"
        action="/api/sourceHandle/upload"
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
          action="/api/sourceHandle/upload"
          name="multipartFile"
          :show-file-list="false"
          :on-error='errorFunction'
          :headers='headers'
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
          <span class="uploadLoading" v-if="logoLoading"><i class="el-icon-loading"></i></span>
          <p class="cvoerLogo" :style="{ backgroundImage: `url(${imageUrl})` }"></p>
          <!-- <p v-else>
            <i class="el-icon-picture-outline"></i>
            <span class="tip">修改工作坊Logo</span>
          </p> -->
          <p class="mt-2"><el-button size="small" style="width: 100%">修改Logo</el-button></p>
        </el-upload>
      </div>
      <el-form ref="form" :model="form" label-width="240px">
        <el-form-item label="工作坊名称" required>
          <el-col :span="12">
            <el-input v-model="form.shopName" v-if="isAdmin" class="input"></el-input>
            <p v-else-if="isShoper">{{form.shopName}}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="关联学段学科" required>
          <el-col :span="12">
            <faculty @faculty='subject' :selected='facultyParam' v-if="isAdmin"></faculty>
            <p v-else-if="isShoper">{{faculty.facultyName}} -- {{faculty.subjectName}}</p>
          </el-col>
        </el-form-item>
         <el-form-item label="设置坊主" required v-if="isAdmin">
           <el-col :span="12" class="shoperBox">
          <el-input v-model="form.shoperInfo.name"  @click.native="openChoose" readonly placeholder='请选择工作坊坊主' class='shoper'></el-input>
          <svg-icon :iconClass='"admin"' class="admin"></svg-icon>
           </el-col>
        </el-form-item>
        <el-form-item label="工作坊介绍">
          <el-col :span="18">
            <tinymce :value='form.introduction' v-model="form.introduction" :height="200"></tinymce>
          </el-col>
        </el-form-item>
        <el-form-item label="工作坊关键字">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            class="tag"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            maxlength="10"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-tooltip v-else class="item" effect="dark" content="每个关键字最多输入十个字" placement="top-start">
            <el-button  class="button-new-tag" size="small" type="success" @click="showInput">添加关键字</el-button>
          </el-tooltip>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="updateWorkshop" round>确定</el-button>
           <el-button @click="cancelUpdate" round>取消</el-button>
         </el-form-item>
      </el-form>
      <choosePerson :choosePersonTitle="choosePersonTitle" v-if="chooseVisible" @closeChoose='closeChoose' :isSingle="'single'" :checkedPersonId='checkedPersonId'></choosePerson>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/storage/cookies'
// import { editWorkshop } from '@/api/workshop'
import store from '@/store'
import { getPicture } from '@/api/app'
import appConfig from '../../../static/appConfig.js'
export default {
  name: 'WorkshopEdit',
  components: {
    choosePerson: () => import('@/modules/choosePerson'),
    // faculty: () => import('@/modules/studyphase'),
    tinymce: () => import('@/components/tinymce')
  },
  data() {
    return {
      appConfig: appConfig,
      imageUrl: '',
      form: {
        shopName: '',
        introduction: '',
        shoperInfo: {}
      },
      faculty: {},
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      facultyParam: {}, // 编辑的已有的学段学科
      headers: {
        enctype: 'multipart/form-data',
        token: getToken()
      },
      coverUrl: '',
      logoFileKey: '',
      coverFileKey: '',
      coverLoading: false,
      logoLoading: false,
      chooseVisible: false,
      choosePersonTitle: '设置坊主'
    }
  },
  computed: {
    ...mapGetters(['uuid', 'workshopUserRoles', 'workshopInfo']),
    isAdmin() {
      // 管理员
      console.log(this.workshopInfo)
      console.log(this.uuid)
      return this.workshopInfo.createUserId === this.uuid
    },
    isShoper() {
      // 坊主
      return (
        this.workshopUserRoles.indexOf(0) > -1 || this.workshopUserRoles.indexOf(1) > -1
      )
    },
    checkedPersonId() {
      return [this.form.shoperInfo.id]
    }
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
        introduction: result.introduction || '',
        shoperInfo: { id: result.adminUserId, name: result.adminUserName }
      }
      this.dynamicTags = result.label ? result.label.split(',') : []
      this.facultyParam = {
        facultyId: result.faculty,
        subjectId: result.subject
      }
      this.faculty = {
        facultyId: result.faculty,
        subjectId: result.subject,
        facultyName: result.facultyName,
        subjectName: result.subjectName
      }
      if (result.coverPic) {
        this.getSource(result.coverPic).then(data => {
          this.coverUrl = URL.createObjectURL(data.data) // 返回的类型要是blob才可以这样
        })
      } else {
        this.coverUrl = this.appConfig.cfg_workshop_banner
      }
      if (result.logo) {
        this.getSource(result.logo).then(data => {
          this.imageUrl = URL.createObjectURL(data.data)
        })
      } else {
        this.imageUrl = this.appConfig.cfg_workshop_Logo
      }
    },
    subject(data) {
      // 学段学科
      this.faculty = data
    },
    openChoose() {
      this.chooseVisible = true
    },
    closeChoose(data) {
      this.chooseVisible = false
      if (data) {
        this.form.shoperInfo = data[0] || {}
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue && this.dynamicTags.indexOf(inputValue) < 0) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /* 工作坊头像 */
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.code === 200) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.logoFileKey = res.result.fileKey
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
        this.coverUrl = URL.createObjectURL(file.raw)
        this.coverFileKey = response.result.fileKey
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
      div.innerHTML = this.form.introduction
      const params = {
        id: this.$route.params.id,
        adminUserId: this.form.shoperInfo.id,
        coverPic: this.coverFileKey,
        logo: this.logoFileKey,
        introduction: this.form.introduction,
        description: div.innerText.substr(0, 100),
        label: this.dynamicTags.join(','),
        subject: this.faculty.subjectId,
        faculty: this.faculty.facultyId,
        groupName: this.form.shopName,
        facultyName: this.faculty.facultyName,
        subjectName: this.faculty.subjectName
      }
      this.updateGroup(params)
        .then(data => {
          console.log(data)
          if (data.data.code === 200) {
            this.$message.success('修改成功')
            store.dispatch('GetWorkshopDetails', {
              groupId: this.$route.params.id
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
        this.$message({ message: '请输入工作坊名称', type: 'warning' })
        return false
      }
      if (!this.faculty.facultyId) {
        this.$message({ message: '请选择学段', type: 'warning' })
        return false
      }
      if (!this.faculty.subjectId) {
        this.$message({ message: '请选择学科', type: 'warning' })
        return false
      }
      if (!this.form.shoperInfo.id) {
        this.$message({ message: '请设置坊主', type: 'warning' })
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
        // editWorkshop(params).then(res => {
        //   resolve(res)
        // })
      })
    },
    getSource(fileKey) {
      // 获取工作坊的背景图和头像
      return new Promise((resolve, reject) => {
        getPicture(fileKey).then(res => {
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
    height: $h100;
    margin: 0 auto;
    position: relative;
    .cvoerBgi {
      height: $h100;
      background-size: cover;
      background-position: center center;
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
    margin-top: 30px;
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
