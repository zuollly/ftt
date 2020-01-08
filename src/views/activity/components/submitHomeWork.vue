<template>
  <el-dialog
    title="提交作业"
    :visible.sync="submitHomeWorkVisible"
    width="50%"
    :before-close="cancel">
    <el-form ref="formAdd" :model="formAdd" label-width="80px">
      <!-- <el-form-item label="作业标题">
        <el-input class="wid50" v-model="formAdd.title"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="作业描述">
        <el-input class="wid50" v-model="formAdd.description"></el-input>
      </el-form-item> -->
      <el-form-item label="作业内容">
        <tinymce v-model="formAdd.content" :value='formAdd.content' :height="400" :width='500'></tinymce>
      </el-form-item>
      <!-- <el-form-item>
        <UploadSize @getFileList='getFileList' :fileList='fileList'></UploadSize>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { submitHomeWork } from '@/api/task.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      formAdd: {
        title: '',
        description: '',
        content: ''
      },
      fileListTemp: []
    }
  },
  computed: {
    ...mapGetters([
      'uuid'
    ])
  },
  props: ['submitHomeWorkVisible', 'itemContent', 'fileList', 'opeType', 'homeWorkList'],
  watch: {
    'opeType': function(val) {
      if (val === 'add') {
        this.formAdd.title = ''
        this.formAdd.content = ''
        this.formAdd.description = ''
      }
    },
    homeWorkList: function(val) {
      console.log(val, 'homeWorkList')
    }
  },
  components: {
    UploadSize: () => import('./UploadSize.vue'),
    tinymce: () => import('@/components/tinymce')
  },
  methods: {
    cancel() {
      this.$emit('closeHomeWorkVisible')
    },
    sure() {
      this.addHomeWork()
    },
    getFileList(fileList) {
      this.fileListTemp = JSON.parse(JSON.stringify(fileList))
    },
    addHomeWork() {
      const data = {
        content: this.formAdd.content,
        // description: this.formAdd.description,
        title: this.formAdd.title,
        userId: this.uuid,
        homeworkId: this.homeWorkList[0].serviceId,
        projectId: this.$route.params.kingdomId
        // activityId: this.$route.params.activityId
      }
      submitHomeWork(data).then(res => {
        if (res.data.code === 200) {
          this.$emit('sure')
        } else {
          this.$message({ type: 'error', message: res.data.msg })
        }
      })
    }
  },
  mounted() {
    console.log(this.homeWorkList, 'homeWorkList')

    this.formAdd.title = ''
    this.formAdd.content = ''
    this.formAdd.description = ''
  }
}
</script>

<style scoped lang='scss'>
.wid50{
  width: 50%;
}
</style>
