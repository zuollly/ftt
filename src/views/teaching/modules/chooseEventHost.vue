<template>
  <div>
    <el-dialog
      title="选择主持人"
      :visible.sync="dialogVisible"
      width="40%">
      <el-table :data="studyPhaseList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="realname" label="姓名" show-overflow-tooltip resizable></el-table-column>
        <el-table-column prop="roleName" label="角色" show-overflow-tooltip resizable></el-table-column>
        <el-table-column prop="schoolName" label="学校" show-overflow-tooltip resizable></el-table-column>
        <el-table-column prop="segmentName" label="学段" show-overflow-tooltip resizable></el-table-column>
        <el-table-column prop="subjectName" label="学科" show-overflow-tooltip resizable></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30]"
          :current-page.sync="pageObj.pageCurrent"
          :page-size="pageObj.pageSize"
          :total.sync="pageObj.count">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchWorkshopMemberPage } from '@/api/user'
export default {
  data() {
    return {
      dialogVisible: false,
      props: {
        label: 'label',
        value: 'value',
        children: 'zones',
        isLeaf: 'leaf'
      },
      studyPhaseList: [],
      pageObj: { // 分页信息
        pageCurrent: 1,
        pageSize: 10,
        count: 0
      },
      multipleSelection: []
    }
  },
  props: {
    select: {
      type: Array
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(index) {
      this.pageObj.pageCurrent = index
      this.getData()
    },
    handleSizeChange(val) {
      this.pageObj.pageSize = val
      this.getData()
    },
    getData() {
      const params = {
        groupId: this.$route.params.id,
        pageCurrent: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize
      }
      this.getWorkshopMemberPage(params).then(res => {
        if (res.data.code === 200) {
          this.studyPhaseList = res.data.result.list
          this.pageObj.count = res.data.result.total
        }
      })
    },
    sureBtn() {
      if (this.multipleSelection.length > 1) {
        this.$message.warning('只能选择一个主持人')
        return
      }
      this.$emit('sureHost', this.multipleSelection)
    },
    getWorkshopMemberPage(params) {
      return new Promise((resolve, reject) => {
        fetchWorkshopMemberPage(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
