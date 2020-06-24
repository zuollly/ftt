<template>
  <div>
    <el-dialog title="环节服务" :visible.sync="dialogTableVisible">
      <el-select v-model="value" placeholder="请选择" @change="handleServerChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-table v-if="(!isComment) && (value!=='video_interaction')&&(value !== 'homeWork') && (value!=='channel')" :data="gridData" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(item, index) in tableProp" :prop="item.prop" :key="index" :label="item.name" min-width="150"></el-table-column>
      </el-table>
      <div v-if="(!isComment) && (value!=='video_interaction')&&(value !== 'homeWork')&& (value!=='channel')" style="text-align: right;margin-top:15px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageParams.pageCurrent" :page-sizes="[10, 20, 30, 40]" :page-size="pageParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
      <div v-if="value === 'homeWork'" class="homeWorkWrapper">
        <el-form ref="formAdd" :model="formAdd" label-width="80px">
          <el-form-item label="作业标题">
            <el-input class="wid50" v-model="formAdd.title"></el-input>
          </el-form-item>
          <el-form-item label="作业内容">
            <tinymce v-model="formAdd.content" :value="formAdd.conetnt" :height="300" :width="300"></tinymce>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="value === 'channel'" class="homeWorkWrapper">
        <el-form ref="formAdd" :model="formAdd" label-width="80px">
          <el-form-item label="标题">
            <el-input class="wid50" v-model="formAdd.contentTitle"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <tinymce v-model="formAdd.txt" :value="formAdd.txt" :height="300" :width="300"></tinymce>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="value === 'video_interaction'" class="homeWorkWrapper">
        <el-form ref="formAdd" :rules="rules" :model="formAdd" label-width="120px">
          <el-form-item label="开始时间" prop="starTime">
            <el-date-picker v-model="formAdd.starTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="formAdd.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="addServer()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchCourseInfoPage,
  fetchHomeWorkPage,
  fetchContentPage,
  fetchActivityHolder
} from '@/api/activityCopy'
import { insertContentRelevance } from '@/api/contentCopy.js'
import { insertHomeWork } from '@/api/task.js'
import { applyConference } from '@/api/tool.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    tinymce: () => import('@/components/tinymce')
  },
  computed: {
    ...mapGetters(['uuid'])
  },
  watch: {
    stepId(val) {
      console.log(val, 'stepId')
    }
  },
  mounted() {
    console.log(this.stepId, 'stepId')
    fetchActivityHolder({
      roleCode: 'ACT_HOST',
      activityId: this.activityId
    }).then(res => {
      if (
        res.data.code === 200 &&
        res.data.result &&
        res.data.result.userInfo
      ) {
        this.holder = res.data.result.userInfo
        console.log(res.data, 100)
      }
    })
  },
  data() {
    return {
      gridData: [],
      tableProp: [{ prop: 'moduleName', name: '名称' }],
      options: [
        { value: 'homeWork', label: '作业' },
        { value: 'course', label: '课程' },
        { value: 'channel', label: '内容' },
        { value: 'comment', label: '讨论' },
        { value: 'resourceShow', label: '资源展示' },
        { value: 'resourceShare', label: '资源分享' },
        { value: 'video_interaction', label: '互动教研' }
      ],
      value: '',
      dialogTableVisible: false,
      pageParams: {
        pageCurrent: 1,
        pageSize: 10
      },
      selected: [],
      total: 0,
      isComment: false,
      formAdd: {
        title: '',
        content: '',
        contentTitle: '',
        txt: '',
        starTime: '',
        endTime: ''
      },
      rules: {
        starTime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请输入结束时间', trigger: 'change' }
        ]
      },
      holder: {}
    }
  },
  props: {
    stepId: {
      type: String
    },
    select: {
      type: Array
    },
    hasServerCode: {
      type: Array,
      default() {
        return []
      }
    },
    activityId: {
      type: String
    }
  },
  methods: {
    getData(params) {
      if (this.value === 'course') {
        this.gridData = []
        this.fetchCourseInfoPage(this.pageParams).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.gridData = res.data.result.list || res.data.result.records
            this.total = res.data.result.total
            this.tableProp = [{ prop: 'courseName', name: '课程名称' }]
          } else {
            this.$message.warning('获取课程失败')
          }
        })
      }
      if (this.value === 'homeWork') {
        this.gridData = []
        this.fetchHomeWorkPage(this.pageParams).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.gridData = res.data.result.list || res.data.result.records
            this.total = res.data.result.total
            this.tableProp = [{ prop: 'title', name: '作业标题' }]
          } else {
            this.$message.warning('获取作业失败')
          }
        })
      }
      if (this.value === 'channel') {
        this.gridData = []
        this.fetchContentPage(this.pageParams).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.gridData = res.data.result.list || res.data.result.records
            this.total = res.data.result.total
            this.tableProp = [{ prop: 'title', name: '内容标题' }]
          } else {
            this.$message.warning('获取内容失败')
          }
        })
      }
      if (this.value === 'comment') {
        this.isComment = true
      }
    },
    handleServerChange(value) {
      console.log(value)
      if (value === 'course') {
        this.gridData = []
        this.fetchCourseInfoPage(this.pageParams).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.gridData = res.data.result.list || res.data.result.records
            this.total = res.data.result.total
            this.tableProp = [{ prop: 'courseName', name: '课程名称' }]
          } else {
            this.$message.warning('获取课程失败')
          }
        })
      }
      // if (value === 'homeWork') {
      //   this.gridData = []
      //   this.fetchHomeWorkPage(this.pageParams).then(res => {
      //     console.log(res)
      //     if (res.data.code === 200) {
      //       this.gridData = res.data.result.list || res.data.result.records
      //       this.total = res.data.result.total
      //       this.tableProp = [{ prop: 'title', name: '作业标题' }]
      //     } else {
      //       this.$message.warning('获取作业失败')
      //     }
      //   })
      // }
      if (value === 'channel') {
        this.gridData = []
        this.fetchContentPage(this.pageParams).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.gridData = res.data.result.list || res.data.result.records
            this.total = res.data.result.total
            this.tableProp = [{ prop: 'title', name: '内容标题' }]
          } else {
            this.$message.warning('获取内容失败')
          }
        })
      }
      this.isComment = false
      if (
        this.value === 'comment' ||
        this.value === 'resourceShow' ||
        this.value === 'resourceShare'
      ) {
        this.isComment = true
      }
    },
    handleSelectionChange(value) {
      if (this.select.indexOf(this.value) > -1) {
        this.$message.warning('您已经选择过此类环节服务')
        this.$refs.multipleTable.clearSelection()
        return
      }
      if (value.length > 1) {
        this.$message.warning('只能选择一个')
        this.$refs.multipleTable.toggleRowSelection(value[value.length - 1])
        value = value[0]
      }
      this.selected = value // 这只是这一页选择的
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val
      this.getData(this.pageParams)
    },
    handleCurrentChange(val) {
      this.pageParams.pageCurrent = val
      this.getData(this.pageParams)
    },
    async addServer() {
      let select = ''
      if (this.value === 'course') {
        if (this.hasServerCode.indexOf('course') > -1) {
          this.$message.warning('该环节已有一个课程项目')
          return
        }
        select = this.selected[0].courseId
        this.dialogTableVisible = false
      }
      if (this.value === 'homeWork') {
        if (this.hasServerCode.indexOf('homeWork') > -1) {
          this.$message.warning('该环节已有一个作业项目')
          return
        }
        await this.getHomeWorkId().then(result => {
          console.log(result, 'result')
          if (result.data.code === 200) {
            select = result.data.result
            this.dialogTableVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
        })
      }
      if (this.value === 'channel') {
        if (this.hasServerCode.indexOf('channel') > -1) {
          this.$message.warning('该环节已有一个内容项目')
          return
        }
        await this.getChannelId().then(result => {
          console.log(result, 'result')
          if (result.data.code === 200) {
            select = result.data.result
            this.dialogTableVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
        })
      }
      if (this.value === 'comment') {
        if (this.hasServerCode.indexOf('comment') > -1) {
          this.$message.warning('该环节已有一个讨论项目')
          return
        }
        select = 'isComment'
        this.dialogTableVisible = false
      }
      if (this.value === 'resourceShow') {
        if (this.hasServerCode.indexOf('resourceShow') > -1) {
          this.$message.warning('该环节已有一个资源展示项目')
          return
        }
        select = 'isResourcesShow'
        this.dialogTableVisible = false
      }
      if (this.value === 'resourceShare') {
        if (this.hasServerCode.indexOf('resourceShare') > -1) {
          this.$message.warning('该环节已有一个资源分享项目')
          return
        }
        select = 'isResourcesShare'
        this.dialogTableVisible = false
      }
      if (this.value === 'video_interaction') {
        if (!this.formAdd.starTime) {
          this.$message.error('请输入开始时间')
          return
        }
        if (!this.formAdd.endTime) {
          this.$message.error('请输入结束时间')
          return
        }
        if (this.hasServerCode.indexOf('video_interaction') > -1) {
          this.$message.warning('该环节已有一个视频教研项目')
          return
        }
        await this.getVideoInteractionId().then(res => {
          console.log(res)
        })
        select = 'video_interaction'
        this.dialogTableVisible = false
      }
      console.log(this.value, select, 99)
      this.$emit('stepServer', { code: this.value, id: select })
    },
    /* axios---- */
    fetchCourseInfoPage(params) {
      return new Promise((resolve, reject) => {
        fetchCourseInfoPage(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchHomeWorkPage(params) {
      return new Promise((resolve, reject) => {
        fetchHomeWorkPage(params).then(res => {
          resolve(res)
        })
      })
    },
    fetchContentPage(params) {
      return new Promise((resolve, reject) => {
        fetchContentPage(params).then(res => {
          resolve(res)
        })
      })
    },
    getHomeWorkId() {
      if (!this.formAdd.title) {
        this.$message.warning('请填写作业标题')
        return
      }
      if (!this.formAdd.content) {
        this.$message.warning('请填写作业内容')
        return
      }
      const data = {
        category: 'activity',
        categoryId: this.stepId,
        content: this.formAdd.content,
        title: this.formAdd.title,
        userId: this.uuid
      }
      return new Promise((resolve, reject) => {
        insertHomeWork(data).then(res => {
          console.log(res)
          resolve(res)
        })
      })
    },
    getChannelId() {
      if (!this.formAdd.contentTitle) {
        this.$message.warning('请填写标题')
        return
      }
      if (!this.formAdd.txt) {
        this.$message.warning('请填写内容')
        return
      }
      const data = {
        // category: 'activity',
        moduleId: this.stepId,
        txt: this.formAdd.txt,
        title: this.formAdd.contentTitle,
        modelCode: 'article',
        userId: this.uuid
      }
      return new Promise((resolve, reject) => {
        insertContentRelevance(data).then(res => {
          resolve(res)
        })
      })
    },
    getVideoInteractionId() {
      if (!this.formAdd.starTime) {
        this.$message.warning('请填写开始时间')
        return
      }
      if (!this.formAdd.endTime) {
        this.$message.warning('请填写结束时间')
        return
      }
      const data = {
        userId: this.holder.userId || this.uuid,
        serviceId: this.stepId,
        startTime: this.formAdd.starTime,
        endTime: this.formAdd.endTime
      }
      return new Promise((resolve, reject) => {
        applyConference(data).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.homeWorkWrapper {
  margin-top: 20px;
}
</style>
