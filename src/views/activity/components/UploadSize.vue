<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="appConfig.app_upfile_path"
      name="multipartFile"
      :headers="headers"
      :on-remove="handleRemove"
      :on-success='handSuccess'
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList">
      <el-button size="small" type="success">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/storage/cookies'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      headers: {
        'enctype': 'multipart/form-data',
        'Authorization': `Bearer${getToken()}`
      }
    }
  },
  computed: {
    ...mapGetters([
      'appConfig',
      'environment'
    ])
  },
  props: ['fileList'],
  methods: {
    beforeAvatarUpload(file) {
      // const isLt2M = file.size / 1024 / 1024 < 10
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 10MB!')
      // }
      // return isLt2M
    },
    handSuccess(response, file, fileList) {
      const temp = this.getList(fileList)
      this.$emit('getFileList', temp)
    },
    handleRemove(file, fileList) {
      const temp = this.getList(fileList)
      this.$emit('getFileList', temp)
    },
    beforeRemove(file, fileList) {
      const temp = this.getList(fileList)
      this.$emit('getFileList', temp)
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    getList(fileList) {
      console.log(fileList, 'fileList====fileList')
      const temp = fileList.map(item => {
        if (item.response) {
          return {
            fileId: item.response.result.id,
            fileName: item.response.result.fileName,
            fileType: item.response.result.fileType,
            fileUrl: item.response.result.fileUrl,
            fileSize: item.response.result.fileSize,
            name: item.response.result.fileName
          }
        } else {
          return {
            fileId: item.fileId,
            fileName: item.fileName,
            fileType: item.fileType,
            fileUrl: item.fileUrl,
            fileSize: item.fileSize,
            name: item.fileName
          }
        }
      })
      return temp
    }
  }
}
</script>
