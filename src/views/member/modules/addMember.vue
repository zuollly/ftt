<template>
  <div v-loading="loading">
    <el-dialog title="选择成员" append-to-body width="80%" :visible.sync="dialogTableVisible" :before-close="beforeClose">
      <div>
        已选择: <el-tag
          v-for="(tag, index) in selectMember"
          :key="index"
          closable
          size="mini"
          @close="handleClose(tag)">
          {{tag.ucName}}
        </el-tag>
      </div>
      <div style="margin-top: 20px">
        <el-select v-model="value1" size="small" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="teacherParams.cityCode" size="small" placeholder="请选择" @change="handleAreaChange(2)">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="teacherParams.countyCode" size="small" placeholder="请选择" @change="handleAreaChange(3)">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="teacherParams.schoolId" size="small" placeholder="请选择" @change="handleAreaChange(4)">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入内容" v-model="teacherParams.ucName" size="small" style="width: 200px">
          <el-button slot="append" icon="el-icon-search" @click="getTeacherList(teacherParams)"></el-button>
        </el-input>
      </div>
      <el-table :data="gridData">
        <el-table-column label="用户名" min-width="180">
          <template slot-scope="scope">
            <span>{{scope.row.user.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column property="ucName" label="真实姓名" min-width="200"></el-table-column>
        <el-table-column label="身份ID" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.user.idcard}}</span>
          </template>
        </el-table-column>
        <el-table-column property="sexValue" label="性别" width="100"></el-table-column>
        <el-table-column property="schoolName" label="学校名称" min-width="200"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" :loading="btnLoading" v-if="selectIds.indexOf(scope.row.id) < 0" @click="appoint(scope.row)">添加</el-button>
            <el-button type="warning" size="small" v-else @click="remove(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="teacherParams.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="teacherParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArea, getSchool, getTeacherList, insertMember } from '@/api/workshop'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      gridData: [],
      dialogTableVisible: true,
      options1: [{
        value: '690000',
        label: '新疆生产建设兵团'
      }],
      value1: '690000',
      options2: [],
      value2: '',
      options3: [],
      value3: '',
      options4: [],
      value4: '',
      teacherParams: {
        pageNum: 1,
        pageSize: 10,
        state: '1',
        provinceCode: '690000',
        cityCode: '',
        countyCode: '',
        schoolId: '',
        ucName: '',
        userRole: 'teacher',
        userType: 'person'
      },
      total: 0,
      selectMember: [],
      id: this.$route.params.id,
      loading: false,
      btnLoading: false
    }
  },
  computed: {
    ...mapGetters(['kingdomId']),
    selectIds() {
      return this.selectMember.map(el => {
        return el.id
      })
    }
  },
  async created() {
    this.getArea('690000', 1)
    this.getSchool({
      schoolProvince: this.value1,
      schoolCity: this.teacherParams.cityCode,
      schoolCounty: this.teacherParams.countyCode,
      schoolLevel: 0
    })
    this.getTeacherList(this.teacherParams)
  },
  methods: {
    getTeacherList(params) {
      return getTeacherList(params).then(res => {
        console.log(res)
        if (res.data.code === '0') {
          this.gridData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    getArea(code, level) { // 市 区
      return getArea(code).then(res => {
        console.log(res)
        this[`options${level + 1}`] = res.data.map(el => {
          return { value: el.districtCode, label: el.districtName }
        })
      })
    },
    getSchool(params) { // 学校
      return getSchool(params).then(res => {
        console.log(res)
        this.options4 = res.data.map(el => {
          return { value: el.id, label: el.schoolName }
        })
      })
    },
    async handleAreaChange(level) {
      const schoolParams = {
        schoolProvince: this.value1,
        schoolCity: this.teacherParams.cityCode,
        schoolCounty: this.teacherParams.countyCode
      }
      if (level === 2) {
        this.teacherParams.countyCode = ''
        this.teacherParams.schoolId = ''
        this.getArea(this.teacherParams.cityCode, level)
        schoolParams.schoolLevel = 1
        this.getSchool(schoolParams)
        this.getTeacherList(this.teacherParams)
      }
      if (level === 3) {
        this.teacherParams.schoolId = ''
        schoolParams.schoolLevel = 2
        this.getSchool(schoolParams)
        this.getTeacherList(this.teacherParams)
      }
      if (level === 4) {
        this.getTeacherList(this.teacherParams)
      }
    },
    cancel() {
      this.$emit('leaderInfo')
    },
    sure() {
      this.btnLoading = true
      const params = this.selectMember.map(el => {
        return {
          roleCode: el.userRole,
          userId: el.id,
          groupId: this.$route.params.id
        }
      })
      this.loading = true
      insertMember(params).then(res => {
        this.btnLoading = false
        if (res.data.code === 200) {
          this.$message.success('添加成功')
          this.$emit('leaderInfo', 1)
        } else {
          this.$message.error('添加失败')
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    beforeClose() {
      this.$emit('leaderInfo')
    },
    appoint(row) {
      // this.$emit('leaderInfo', row)
      console.log(row)
      this.selectMember.push(row)
    },
    remove(row) {
      for (let index = 0; index < this.selectMember.length; index++) {
        const element = this.selectMember[index]
        if (element.id === row.id) {
          this.selectMember.splice(index, 1)
          break
        }
      }
    },
    handleSizeChange(val) {
      this.teacherParams.pageSize = val
      this.getTeacherList(this.teacherParams)
    },
    handleCurrentChange(val) {
      this.teacherParams.pageNum = val
      this.getTeacherList(this.teacherParams)
    },
    handleClose(tag) {
      for (let index = 0; index < this.selectMember.length; index++) {
        const element = this.selectMember[index]
        if (element.id === tag.id) {
          this.selectMember.splice(index, 1)
          break
        }
      }
    }
  }
}
</script>

<style lang="scss">
.el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
