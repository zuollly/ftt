<template>
  <div>
    <el-upload
      class="upload-demo"
      action="/api/sourceHandle/upload"
      name="multipartFile"
      :headers="headers"
      :on-remove="handleRemove"
      :on-success='handSuccess'
      :before-remove="beforeRemove"
      :file-list="fileList">
      <el-button size="small" type="success">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/storage/cookies'
export default {
  data() {
    return {
      headers: {
        'enctype': 'multipart/form-data',
        'token': getToken()
      }
    }
  },
  props: ['fileList'],
  methods: {
    handSuccess(response, file, fileList) {
      this.$emit('getFileList', fileList)
    },
    handleRemove(file, fileList) {
      this.$emit('getFileList', fileList)
    },
    beforeRemove(file, fileList) {
      this.$emit('getFileList', fileList)
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
