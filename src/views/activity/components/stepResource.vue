<template>
  <div class="stepResourceWrapper">
    <div style="position: relative">
      <el-upload
        class="upload-demo"
        :action="appConfig.app_basehost+'/tool/file/batchUpload'"
        multiple
        :show-file-list="false"
        name="multipartFiles "
        :headers='headers'
        :on-success="handleUploadSuccess">
        <el-button type="primary" v-if="uploadAuthority" size="small">上传资源</el-button>
      </el-upload>
      <el-tooltip class="item" effect="dark" content="归档资源到工作坊" v-if="pushAuthority" placement="top">
        <el-button class="guidang" type="primary" @click="pige" size="small">一键归档</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="推送资源到兵团" v-if="pushAuthority&&environment" placement="top">
        <el-button class="tuisong" type="primary" @click="publish" size="small">一键推送</el-button>
      </el-tooltip>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="fileName"
        label="资源名称"
        show-overflow-tooltip
        resizable
        min-width="220">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="上传人"
        show-overflow-tooltip
        resizable
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        min-width="180"
        show-overflow-tooltip
        resizable
        label="上传时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
       <el-table-column
        fixed="right"
        label="操作"
        width="170">
        <template slot-scope="scope">
          <el-button @click="look(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="download(scope.row)">下载</el-button>
          <el-button type="text" size="small" v-if="scope.row.createId === uuid" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        small
        layout="prev, pager, next"
        v-if="tableData.length>0"
        @current-change="handleAllPageChange"
        :current-page="params.pageCurrent"
        :page-size="params.pageSize"
        :total="total"
      ></el-pagination>
    </div>
    <a style="display:none" id="downFA"></a>
  </div>
</template>

<script>
import { fetchResourcePage, insertResource, fetchActivityInfo, deleteResourceBatch, filePublish, filePige } from '@/api/activityCopy.js'
import { getPreviewURL, downloadFile } from '@/api/app.js'
import { getToken } from '@/utils/storage/cookies'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/mixin'
export default {
  data() {
    return {
      creatorId: '',
      tableData: [],
      params: {
        pageCurrent: 1,
        pageSize: 10
      },
      total: 0,
      fileList: [],
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      activityInfo: {}
    }
  },
  props: {
    resourcesList: {
      type: Array
    },
    holderInfo: {
      type: Object
    }
  },
  filters: {
    parseTime
  },
  computed: {
    ...mapGetters([
      'uuid', 'appConfig', 'environment', 'kingdomId', 'workshopId', 'workshopUserRoles'
    ]),
    uploadAuthority() {
      let flag = false
      this.resourcesList.forEach(el => {
        if (el.serviceTypeCode === 'resourcesShare') {
          flag = true
        }
        if (el.serviceTypeCode === 'resourcesShow' && ((this.creatorId === this.uuid || this.holderInfo.userId === this.uuid) ||
          (this.workshopUserRoles.indexOf('GROUP_LEADER') > -1 || this.workshopUserRoles.indexOf('GROUP_DEPUTY_LEADER') > -1))) {
          flag = true
        }
      })
      return flag
    },
    pushAuthority() {
      let flag = false
      this.resourcesList.forEach(el => {
        if (el.serviceTypeCode === 'resourcesShow' && ((this.creatorId === this.uuid || this.holderInfo.userId === this.uuid) ||
        (this.workshopUserRoles.indexOf('GROUP_LEADER') > -1 || this.workshopUserRoles.indexOf('GROUP_DEPUTY_LEADER') > -1))) {
          flag = true
        }
      })
      return flag
    }
  },
  created() {
    // this.use(Popover)
    this.resourcesList.forEach(el => {
      if (el.serviceTypeCode === 'resourcesShow' || el.serviceTypeCode === 'resourcesShare') {
        this.params.categoryId = el.serviceId
      }
    })
    fetchResourcePage(this.params).then(res => {
      if (res.data.code === 200) {
        this.tableData = res.data.result.records || []
        this.total = res.data.result.total
      }
    })
    this.getActivityInfo()
  },
  methods: {
    getActivityInfo() {
      const activityId = this.$route.params.activityId
      fetchActivityInfo({ id: activityId }).then(res => {
        const currentActivityInfo = res.data.result
        this.activityInfo = currentActivityInfo
        console.log('ddddddasda', this.activityInfo)
        if (res.data.code === 200) {
          this.creatorId = currentActivityInfo.creatorId
        }
      })
    },
    handleUploadSuccess(res, file) {
      console.log(res)
      if (res.code === 200) {
        this.fileList = res.result.map(el => {
          return {
            categoryId: this.resourcesList[0].serviceId,
            createId: this.uuid,
            createTime: el.createTime,
            fileCategory: el.fileCategory,
            fileId: el.id,
            fileName: el.fileName,
            fileSize: el.fileSize,
            fileType: el.fileType
          }
        })
        this.insertResource(this.fileList)
      }
    },
    insertResource(params) {
      insertResource(params).then(res => {
        if (res.data.code === 200) {
          this.$message.success('上传成功')
          this.params.pageCurrent = 1
          fetchResourcePage(this.params).then(res => {
            if (res.data.code === 200) {
              this.tableData = res.data.result.records || []
              this.total = res.data.result.total
            }
          })
        } else {
          this.$message.error('上传失败')
        }
      })
    },
    handleAllPageChange(index) {
      this.params.pageCurrent = index
      this.queryResourcePage()
    },
    queryResourcePage() {
      console.log(this.params)
      fetchResourcePage(this.params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.result.records || []
          this.total = res.data.result.total
        }
      })
    },
    look(row) {
      getPreviewURL({ id: row.fileId }).then(res => {
        if (res.status === 200) {
          window.open(res.data)
        }
      })
    },
    download(row) {
      downloadFile({ id: row.fileId }).then(res => {
        if (res.data && res.data.result) {
          window.open(res.data.result)
          return
        }
        // window.open(URL.createObjectURL(res.data))
        const blob = new Blob([res.data], { type: row.fileType })
        // var a = document.createElement('a')兼容火狐
        const a = document.getElementById('downFA')
        a.href = URL.createObjectURL(blob)
        a.download = row.fileName
        a.click()
        // URL.revokeObjectUrl(a.href)
      })
    },
    del(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResourceBatch([row.id]).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功')
            fetchResourcePage(this.params).then(res => {
              if (res.data.code === 200) {
                this.tableData = res.data.result.records || []
                this.total = res.data.result.total
              }
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    publish() {
      // filePublish({ categoryId: this.resourcesList[0].serviceId }).then(res => {
      filePublish({
        contentId: this.resourcesList[0].serviceId,
        actId: this.$route.params.activityId,
        groupId: this.workshopId,
        projectId: this.kingdomId
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('推送成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    pige() {
      filePige({
        contentId: this.resourcesList[0].serviceId,
        actId: this.$route.params.activityId,
        groupId: this.workshopId,
        projectId: this.kingdomId
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('归档成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  watch: {
    resourcesList: function(val) {
      if (val.length) {
        this.params.categoryId = this.resourcesList[0].serviceId
        this.params.pageCurrent = 1
        fetchResourcePage(this.params).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.result.records || []
            this.total = res.data.result.total
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pagination{
  width: 80%;
  margin: 0 auto;
  height: 50px;
  padding-top: 20px;
  text-align: center;
  display: table;
}
.tuisong {
  position: absolute;
  right: 100px;top: 6px;
}
.guidang {
  position: absolute;
  right: 4px;top: 6px;
}
</style>
