<template>
  <div>
    <el-form :model="formAdd" size="small">
      <el-form-item label="直播互动人员管理" :label-width="labelwidth" required>
        <div v-if="getUserList.length">
          已选择: <el-tag v-for="(tag, index) in getUserList" :key="index" closable size="mini" @close="handleClose(tag)">
            {{tag.ucName}}
          </el-tag>
        </div>
        <el-button v-else @click="addVedioMemberE" type="primary" plain size="mini">邀请成员</el-button>
      </el-form-item>
      <!-- <el-form-item label="直播内容介绍" :label-width="labelwidth">
        <tinymce :value='formAdd.vedioDescription' v-model="formAdd.vedioDescription" :height='200'></tinymce>
      </el-form-item> -->
      <el-form-item label="培训日期" :label-width="labelwidth" required>
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formAdd.startTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
        <span>至</span>
        <el-date-picker v-model="formAdd.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择结束时间"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="培训资源分享" :label-width="labelwidth">
        <el-button @click="uploadVedioResouce" type="primary" plain size="mini">上传资源</el-button>
      </el-form-item>
      <el-form-item :label-width="labelwidth">
        <el-table>
          <el-table-column show-overflow-tooltip resizable>
          </el-table-column>
        </el-table>
      </el-form-item> -->
      <el-form-item label="培训资源分享" :label-width="labelwidth">
        <stepResource :resourcesList='getResourcesList'></stepResource>
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
import { launchActivityVideo } from '@/api/train.js'
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
      formAdd: { vedioDescription: '', startTime: '', endTime: '' }
    }
  },
  props: ['getResourcesList', 'stepTlist'],
  computed: {
    ...mapGetters(['uuid'])
  },
  methods: {
    uploadVedioResouce() { },
    // 添加视频人员
    addVedioMemberE() {
      this.$refs.addVedioMemberDialog.dialogTableVisible = true
    },
    memberList(array) {
      console.log(array)
      this.getUserList = array
      this.$refs.addVedioMemberDialog.dialogTableVisible = false
    },
    launchVideo() {
      const tempInfo = this.stepTlist.filter(item => {
        return item.stepSort === 0
      })
      if (!this.getUserList.length) {
        this.$message.warning('请邀请人员')
        return
      }
      if (!this.formAdd.startTime) {
        this.$message.warning('请选择直播开始时间')
        return false
      }
      if (!this.formAdd.endTime) {
        this.$message.warning('请选择直播结束时间')
        return false
      }
      const userIds = this.getUserList.map((item) => { return item.id })
      const params = {
        'endTime': this.formAdd.endTime,
        'serviceId': tempInfo[0].id,
        'startTime': this.formAdd.startTime,
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
    handleClose(tag) {
      for (let index = 0; index < this.getUserList.length; index++) {
        const element = this.getUserList[index]
        if (element.id === tag.id) {
          this.getUserList.splice(index, 1)
          break
        }
      }
    }
  }
}
</script>

<style>
</style>
