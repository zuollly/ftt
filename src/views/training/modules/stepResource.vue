<template>
  <div class="stepResourceWrapper">
    <el-button type="primary" @click="uploadResource">上传资源</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="fileName" label="资源名称" show-overflow-tooltip resizable>
      </el-table-column>
      <el-table-column prop="userName" label="上传人" show-overflow-tooltip resizable>
      </el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip resizable label="上传时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="look(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="download(scope.row)">下载</el-button>
          <el-button type="text" size="small" v-if="scope.row.userId === uuid" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="pagination">
      <el-pagination small layout="prev, pager, next" v-if="tableData.length>0" @current-change="handleAllPageChange" :current-page="params.pageCurrent" :page-size="params.pageSize" :total="total"></el-pagination>
    </div>
    <a style="display:none" id="downFA"></a>
    <el-dialog title="上传资源" :visible.sync="dialogVisible" width="30%">
      <div style="position: relative">
        <el-upload class="upload-demo" :action="appConfig.cfg_upfile_path" multiple :show-file-list="true" :file-list="fileListShow" name="multipartFile " :headers='headers' :on-success="handleUploadSuccess">
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
import { fetchActivityInfo, insertResource, fetchResourcePage } from '@/api/activityCopy.js'
import { fetchContentById, delRelevanceContent } from '@/api/content.js'
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
      fileListShow: [],
      fileList: [],
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
    },
    stepTlist: {
      type: Array
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
  mounted() {
    this.queryResourcePage()
    this.getActivityInfo()
  },
  methods: {
    uploadResource() {
      this.dialogVisible = true
      this.fileListShow = []
    },
    getActivityInfo() {
      const activityId = this.$route.query.activityId || this.$route.params.activityId
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
        this.fileList = [res.result]
        this.fileListShow = [{ name: res.result.fileName }]
      }
    },
    // addResource() {
    //   const data = {
    //     title: this.fileList.fileName,
    //     modelCode: this.modelCode,
    //     userId: this.uuid,
    //     contentLevel: 'STEP',
    //     doc: {
    //       fileId: this.fileList.id,
    //       fileName: this.fileList.fileName,
    //       fileType: this.fileList.fileType,
    //       fileSize: this.fileList.fileSize
    //     },
    //     relevance: {
    //       contentTypeCode: 'CONTENT_RESOURCE',
    //       moduleId: this.resourcesList[0].stepId
    //     }
    //   }
    //   insertRelevanceContent(data).then(res => {
    //     this.dialogVisible = false
    //     if (res.data.code === 200) {
    //       this.$message.success('上传成功')
    //       this.params.pageCurrent = 1
    //       this.queryResourcePage()
    //     } else {
    //       this.$message.error('上传失败')
    //     }
    //   })
    // },
    addResource() {
      if (!this.fileListShow.length) {
        this.$message.warning('请先选择上传文件')
        return
      }
      const fileTempList = this.fileList.map(el => {
        return {
          categoryId: this.resourcesList[0].serviceId || this.stepTlist[0].id,
          createId: this.uuid,
          createTime: el.createTime,
          fileCategory: el.fileCategory,
          fileId: el.id,
          fileName: el.fileName,
          fileSize: el.fileSize,
          fileType: el.fileType
        }
      })
      this.insertResource(fileTempList)
    },
    insertResource(params) {
      insertResource(params).then(res => {
        if (res.data.code === 200) {
          console.log(res, 'res')
          this.dialogVisible = false
          this.params.pageCurrent = 1
          this.params.categoryId = this.resourcesList[0].stepId
          fetchResourcePage(this.params).then(res => {
            if (res.data.code === 200) {
              this.tableData = res.data.result.records || []
              this.total = res.data.result.total
            }
          })
        } else {
          this.$message.error(res.data.msg)
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
        categoryId: this.resourcesList[0].stepId
      }
      fetchResourcePage(data).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.result.records || []
          this.total = res.data.result.total || []
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
    }
  },
  watch: {
    resourcesList(val) {
      if (val.length) {
        this.queryResourcePage()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pagination {
  width: 80%;
  margin: 0 auto;
  height: 50px;
  padding-top: 20px;
  text-align: center;
  display: table;
}
.tuisong {
  position: absolute;
  right: 100px;
  top: 6px;
}
.guidang {
  position: absolute;
  right: 4px;
  top: 6px;
}
</style>
