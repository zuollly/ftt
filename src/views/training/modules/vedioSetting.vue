<template>
  <div>
    <el-form :model="formAdd" size="small">
      <el-form-item label="直播互动人员管理" :label-width="labelwidth" required>
        <el-button @click="addVedioMemberE" type="primary" plain size="mini">邀请成员</el-button>
        <div v-if="getUserList.length">
          已邀请: <el-tag v-for="(tag, index) in getUserList" :key="index" closable size="mini" @close="handleClose(tag)">
            {{tag.ucName}}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="直播内容介绍" :label-width="labelwidth">
        <tinymce :value='formAdd.vedioDescription' v-model="formAdd.vedioDescription" :height='200'></tinymce>
      </el-form-item>
      <el-form-item label="培训日期" :label-width="labelwidth" required>
        <div style="margin-bottom: 10px" v-for="(item, idx) in timeList" :key="idx">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="item.startTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
          <span>至</span>
          <el-date-picker v-model="item.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择结束时间"></el-date-picker>
          <el-button @click="deleteTimeOne(idx)" v-if="timeList.length>1" type="danger" size="mini" icon="el-icon-minus" circle></el-button>
          <el-button @click="addTimeOne(item)" v-if="idx===timeList.length-1" type="primary" size="mini" icon="el-icon-plus" circle></el-button>
        </div>
      </el-form-item>
      <el-form-item label="培训资源分享" :label-width="labelwidth">
        <stepResource :stepTlist='stepTlist' :resourcesList='getResourcesList'></stepResource>
      </el-form-item>
      <el-form-item :label-width="labelwidth">
        <el-button type="primary" size="small" @click='launchVideo'>发布培训</el-button>
      </el-form-item>
    </el-form>
    <addVedioMember ref="addVedioMemberDialog" @memberList='memberList'></addVedioMember>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { launchActivityVideo, fetTnteractionInfo } from '@/api/train.js'
import { insertActivityStep, insertStepServer, activityStepList, updateActivityStep } from '@/api/activityCopy.js'
export default {
  components: {
    tinymce: () => import('@/components/tinymce'),
    addVedioMember: () => import('./addVedioMember'),
    stepResource: () => import('./stepResource')
  },
  data() {
    return {
      labelwidth: '140px',
      getUserList: [],
      formAdd: { vedioDescription: '' },
      timeList: [{ startTime: '', endTime: '' }]
    }
  },
  props: ['getResourcesList', 'stepTlist'],
  computed: {
    ...mapGetters(['uuid'])
  },
  mounted() {
    this.getActivityStepList()
    this.getTnteractionInfo()
  },
  methods: {
    uploadVedioResouce() { },
    getTnteractionInfo() {
      const tempInfo = this.stepTlist.filter(item => {
        return item.stepSort === 0
      })
      const params = {
        serviceId: tempInfo[0].id
      }
      fetTnteractionInfo(params).then(res => {
        console.log(res, '900')
        if (res.data.code === 200 && res.data.result) {
          const userList = res.data.result.inviteUsers.map(item => {
            return {
              ucName: item.realName,
              id: item.userId
            }
          })
          this.getUserList = [...userList]
          this.formAdd.vedioDescription = res.data.result.introduction
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    deleteTimeOne(idx) {
      this.timeList.splice(idx, 1)
    },
    getActivityStepList() { // 环节list
      return this.activityStepList({ stageId: this.stepTlist[0].stageId }).then(res => {
        const timeList = []
        if (res.data.code === 200) {
          const stepTempList = res.data.result
          stepTempList.forEach(ele => {
            if (ele.stepTypeCode === 'JSTD6') {
              timeList[timeList.length] = {
                startTime: ele.startTime,
                endTime: ele.endTime
              }
            }
          })
        }
        console.log(timeList, 'timeList')
        this.timeList = [...timeList]
      })
    },
    addTimeOne(item) {
      if (!item.startTime) {
        this.$message.warning('请选择开始时间')
        return
      }
      if (!item.endTime) {
        this.$message.warning('请选择结束时间')
        return
      }
      // if (this.getHour(item.startTime, item.endTime) > 4) {
      //   this.$message.warning('培训时长不能大于4h')
      //   return
      // }
      this.timeList.push({ startTime: '', endTime: '' })
      console.log(this.timeList)
    },
    // 添加视频直播环节和视频互动资源环节
    addVedioStep(item, idx) {
      const sort = this.stepTlist.length + idx - 2 - (this.stepTlist.length - 3) / 2// 第几次培训
      const params = {
        endTime: item.endTime,
        stageId: this.stepTlist[0].stageId,
        startTime: item.endTime,
        stepName: `培训第${sort}次直播`,
        stepSort: idx + this.stepTlist.length,
        stepTypeCode: 'JSTD6'
      }
      this.insertActivityStep(params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          console.log(res, 'stepIf')
          this.addServe1(item, res.data.result)
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    addVedioResourceStep(item, idx) {
      const sort = this.stepTlist.length + idx - 2 - (this.stepTlist.length - 3) / 2
      const params = {
        endTime: item.endTime,
        stageId: this.stepTlist[0].stageId,
        startTime: item.endTime,
        stepName: `培训第${sort}次直播视频回顾`,
        stepSort: idx + this.stepTlist.length + 1,
        stepTypeCode: 'JSTD5'
      }
      this.insertActivityStep(params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.addServe2(res.data.result)
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    // 添加对应服务的服务
    addServe1(item, id) {
      const params = {
        serviceTypeCode: 'video_interaction',
        serviceId: id,
        stepId: id
      }
      this.insertStepServer([params]).then(res => {
        if (res.data.code === 200) {
          // 添加好服务后发起视频活动
          if (res.data.result && res.data.result.length) {
            this.insertVedio(item, res.data.result[0].serviceId)
          }
        } else {
          this.$message.warning('失败')
        }
      })
    },
    addServe2(id) {
      const params = {
        serviceTypeCode: 'resourceShare',
        serviceId: id,
        stepId: id
      }
      this.insertStepServer([params]).then(res => {
        if (res.data.code === 200) {
        } else {
          this.$message.warning('失败')
        }
      })
    },
    // 添加视频人员
    addVedioMemberE() {
      this.$refs.addVedioMemberDialog.dialogTableVisible = true
    },
    memberList(array) {
      console.log(array)
      // this.getUserList = [...this.getUserList, ...array]
      this.getUserList = JSON.parse(this.uniqueArr(this.getUserList, array))
      this.$refs.addVedioMemberDialog.dialogTableVisible = false
    },
    // 根据时间段创建环节
    insertAllStep() {
      this.timeList.forEach((element, idx) => {
        console.log(idx)
        if (idx > 0) {
          this.addVedioStep(element, idx)
          this.addVedioResourceStep(element, idx)
        }
      })
    },
    // 发起活动会议
    insertVedio(item, serviceId) {
      const userIds = this.getUserList.map((user) => { return user.id })
      const params = {
        'endTime': item.endTime,
        'serviceId': serviceId,
        'startTime': item.startTime,
        'userId': this.uuid,
        'userIds': userIds
      }
      launchActivityVideo(params).then(res => {
        console.log(res, '900')
        if (res.data.code === 200 && res.data.result) {
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 编辑环节
    editStep(id) {
      const params = {
        id: id,
        endTime: this.timeList[0].endTime,
        startTime: this.timeList[0].startTime
      }
      this.updateActivityStep([params]).then(res => {
        if (res.data.code === 200) {
        } else {
          this.$message.warning('失败')
        }
      })
    },
    launchVideo() {
      // 对模板里的视频直播添加服务
      const tempInfo = this.stepTlist.filter(item => {
        return item.stepSort === 0
      })
      if (!this.getUserList.length) {
        this.$message.warning('请邀请人员')
        return
      }
      const userIds = this.getUserList.map((item) => { return item.id })
      const params = {
        'endTime': this.timeList[0].endTime,
        'serviceId': tempInfo[0].id,
        'startTime': this.timeList[0].startTime,
        'userId': this.uuid,
        'userIds': userIds,
        'introduction': this.formAdd.vedioDescription
      }
      launchActivityVideo(params).then(res => {
        console.log(res, '900')
        if (res.data.code === 200 && res.data.result) {
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 顺便把第一个环节编辑一下，加入时间
      this.editStep(tempInfo[0].id)
      // 对自己新增的时间添加视频服务
      this.insertAllStep()
    },
    handleClose(tag) {
      for (let index = 0; index < this.getUserList.length; index++) {
        const element = this.getUserList[index]
        if (element.id === tag.id) {
          this.getUserList.splice(index, 1)
          break
        }
      }
    },
    insertStepServer(params) {
      return new Promise((resolve, reject) => {
        insertStepServer(params).then(res => {
          resolve(res)
        })
      })
    },
    insertActivityStep(params) {
      return new Promise((resolve, reject) => {
        insertActivityStep(params).then(res => {
          resolve(res)
        })
      })
    },
    activityStepList(params) {
      return new Promise((resolve, reject) => {
        activityStepList(params).then(res => {
          resolve(res)
        })
      })
    },
    updateActivityStep(params) {
      return new Promise((resolve, reject) => {
        updateActivityStep(params).then(res => {
          resolve(res)
        })
      })
    },
    // 两个时间相减，获得小时数
    getHour(s1, s2) {
      s1 = new Date(s1.replace(/-/g, '/'))
      s2 = new Date(s2.replace(/-/g, '/'))
      var ms = Math.abs(s1.getTime() - s2.getTime())
      return ms / 1000 / 60 / 60
    },
    uniqueArr(jsonArr, jsonArr2) {
      let length1 = jsonArr.length
      const length2 = jsonArr2.length
      for (let i = 0; i < length1; i++) {
        for (let j = 0; j < length2; j++) {
          // 判断添加的数组是否为空了
          if (jsonArr.length > 0) {
            if (jsonArr[i]['id'] * 1 === jsonArr2[j]['id'] * 1) {
              jsonArr.splice(i, 1) // 利用splice函数删除元素，从第i个位置，截取长度为1的元素
              length1--
              console.log(jsonArr2[j])// 重复元素
            }
          }
        }
      }

      for (let n = 0; n < jsonArr2.length; n++) {
        jsonArr.push(jsonArr2[n])
      }
      console.log(jsonArr)
      return JSON.stringify(jsonArr)
    }
  }
}
</script>

<style>
</style>
