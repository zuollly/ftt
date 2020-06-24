<template>
  <div>
    <el-dialog
      title="选择主持人"
      :visible.sync="dialogVisible"
      :before-close="cancel"
      width="60%">
      <el-table :data="studyPhaseList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="ucName" label="姓名" show-overflow-tooltip resizable></el-table-column>
        <el-table-column prop="userRoleValue" label="角色" show-overflow-tooltip resizable></el-table-column>
        <el-table-column prop="schoolName" label="学校" show-overflow-tooltip resizable></el-table-column>
        <!-- <el-table-column prop="segmentName" label="学段" show-overflow-tooltip resizable></el-table-column>
        <el-table-column prop="subjectName" label="学科" show-overflow-tooltip resizable></el-table-column> -->
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
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTeacherList } from '@/api/workshop'
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
    },
    levelInfo: {
      type: Object
    }
  },
  watch: {
    'levelInfo': {
      handler: function(val) {
        if (val) {
          this.getData()
        }
      },
      deep: true
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
        schoolProvince: this.levelInfo.schoolProvince,
        schoolCity: this.levelInfo.schoolCity,
        schoolCounty: this.levelInfo.schoolCounty,
        schoolId: this.levelInfo.schoolId,
        pageNum: this.pageObj.pageCurrent,
        pageSize: this.pageObj.pageSize,
        state: 1,
        userRole: 'teacher',
        userType: 'person'
      }
      this.getWorkshopMemberPage(params).then(res => {
        if (res.data.code === '0') {
          this.studyPhaseList = res.data.rows
          this.pageObj.count = res.data.total
          console.log(res.data, 9999)
        }
      })
    },
    sureBtn() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请选择人员')
        return
      }
      this.$emit('sureInviteMember', this.multipleSelection)
    },
    cancel() {
      this.$emit('sureInviteMember', this.multipleSelection)
    },
    getWorkshopMemberPage(params) {
      return new Promise((resolve, reject) => {
        getTeacherList(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
