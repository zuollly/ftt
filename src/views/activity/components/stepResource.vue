<template>
  <div class="stepResourceWrapper">
    <el-button type="primary" @click="uploadResource">上传资源</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="title"
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
        width="250">
        <template slot-scope="scope">
          <el-button @click="look(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="download(scope.row)">下载</el-button>
          <el-button type="text" size="small" v-if="scope.row.userId === uuid"  @click="del(scope.row)">删除</el-button>
          <el-button type="text" @click="pige" size="small">归档</el-button>
          <el-button type="text" @click="publish(scope.row)" size="small">推送</el-button>
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
    <el-dialog
      title="上传资源"
      :visible.sync="dialogVisible"
      width="30%">
      <div style="position: relative">
        <el-upload
          class="upload-demo"
          action="http://yx.nercel.cn/msapi/zuul/tool/file/upload"
          multiple
          :show-file-list="true"
          name="multipartFile "
          :headers='headers'
          :on-success="handleUploadSuccess">
          <el-button type="primary" size="small">上传资源</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addResource">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchActivityInfo } from '@/api/activityCopy.js'
import { fetchContentPage, insertRelevanceContent, fetchContentById, delRelevanceContent, pushRelevanceContent, publishToGroup } from '@/api/content.js'
import { getPreviewURL, downloadFile } from '@/api/file.js'
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
      fileList: {},
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      dialogVisible: false,
      activityInfo: {},
      modelCode: ''
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
      'uuid', 'appConfig'
    ])
  },
  created() {
    this.queryResourcePage()
    this.getActivityInfo()
  },
  methods: {
    uploadResource() {
      this.dialogVisible = true
    },
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
        this.fileList = res.result
      }
      switch (this.fileList.fileCategory) {
        case 'document':
          this.modelCode = 'doc'
          break
        case 'picture':
          this.modelCode = 'doc'
          break
        case 'voice':
        case 'video':
          this.modelCode = 'video'
          break
        default:
          this.modelCode = 'doc'
          break
      }
    },
    addResource() {
      const data = {
        title: this.fileList.fileName,
        modelCode: this.modelCode,
        userId: this.uuid,
        contentLevel: 'STEP',
        doc: {
          fileId: this.fileList.id,
          fileName: this.fileList.fileName,
          fileType: this.fileList.fileType,
          fileSize: this.fileList.fileSize
        },
        relevance: {
          contentTypeCode: 'CONTENT_RESOURCE',
          moduleId: this.resourcesList[0].stepId
        }
      }
      insertRelevanceContent(data).then(res => {
        this.dialogVisible = false
        if (res.data.code === 200) {
          this.$message.success('上传成功')
          this.params.pageCurrent = 1
          this.queryResourcePage()
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
      const data = {
        pageCurrent: this.params.pageCurrent,
        pageSize: this.params.pageSize,
        moduleId: this.resourcesList[0].stepId
      }
      fetchContentPage(data).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.result ? res.data.result.list : []
          this.total = res.data.result ? res.data.result.total : 0
        }
      })
    },
    look(row) {
      fetchContentById({ id: row.id }).then(res => {
        console.log(res)
        if (res.status === 200) {
          if (!res.data.result || !res.data.result.fileId) {
            this.$message.error('暂无资源')
            return
          }
          getPreviewURL({ id: res.data.result.fileId }).then(res => {
            if (res.status === 200) {
              window.open(res.data)
            }
          })
        }
      })
    },
    download(row) {
      fetchContentById({ id: row.id }).then(res => {
        if (res.status === 200) {
          if (!res.data.result || !res.data.result.fileId) {
            this.$message.error('暂无资源')
            return
          }
          downloadFile({ id: res.data.result.fileId }).then(res => {
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
        }
      })
    },
    del(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRelevanceContent([row.id]).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功')
            this.queryResourcePage()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    publish(item) {
      pushRelevanceContent({
        contentTypeCode: 'CONTENT_RESOURCE_ACT_ARCHIVE',
        moduleId: this.$route.params.id,
        pushStatus: 1,
        userId: this.uuid,
        id: item.id
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('推送成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    pige() {
      publishToGroup({
        actId: this.$route.params.activityId,
        groupId: this.$route.params.id,
        contentId: this.resourcesList[0].serviceId
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
        this.queryResourcePage()
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
