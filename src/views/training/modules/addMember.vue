<template>
  <div v-loading="loading">
    <el-dialog title="选择范围" width="50%" :visible.sync="dialogTableVisible">
      <div style="margin-top: 20px">
        <el-select v-model="value1" clearable size="small" placeholder="请选择">
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="teacherParams.cityCode" clearable size="small" placeholder="请选择" @change="handleAreaChange(2)">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="teacherParams.countyCode" clearable size="small" placeholder="请选择" @change="handleAreaChange(3)">
          <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="teacherParams.schoolId" clearable size="small" placeholder="请选择" @change="handleAreaChange(4)">
          <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArea, getSchool } from '@/api/workshop'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      gridData: [],
      dialogTableVisible: false,
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
        state: '1',
        provinceCode: '690000',
        cityCode: '',
        countyCode: '',
        schoolId: '',
        userRole: 'teacher',
        userType: 'person'
      },
      total: 0,
      selectMember: [],
      id: this.$route.params.id,
      loading: false,
      btnLoading: false,
      schoolParams: { schoolProvinceName: '新疆生产建设兵团', cityName: '', schoolName: '', schoolProvince: 690000, schoolLevel: 0 }
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
  watch: {
    'teacherParams.cityCode'(val) {
      if (val) {
        this.schoolParams.cityName = this.selectChooseObj(val, this.options2).label
      }
    },
    'teacherParams.countyCode'(val) {
      if (!val) {
        this.schoolParams.schoolLevel = 1
      }
    },
    'teacherParams.schoolId'(val) {
      if (val) {
        this.schoolParams.schoolName = this.selectChooseObj(val, this.options4).label
      }
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
  },
  methods: {
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
        schoolProvinceName: '新疆生产建设兵团',
        cityName: this.schoolParams.cityName,
        schoolName: this.schoolParams.schoolName,
        schoolProvince: this.value1,
        schoolCity: this.teacherParams.cityCode,
        schoolCounty: this.teacherParams.countyCode,
        schoolId: this.teacherParams.schoolId
      }
      if (level === 2) {
        this.getArea(this.teacherParams.cityCode, level)
        schoolParams.schoolLevel = 1
        this.getSchool(schoolParams)
      }
      if (level === 3) {
        schoolParams.schoolLevel = 3
        this.getSchool(schoolParams)
      }
      if (level === 4) {
        schoolParams.schoolLevel = 2
      }
      this.schoolParams = schoolParams
    },
    cancel() {
      this.$emit('leaderInfo', '')
    },
    sure() {
      console.log(this.schoolParams)
      if (this.schoolParams.schoolLevel === 3) {
        this.$message.warning('不能选择团')
        return
      }
      this.$emit('leaderInfo', this.schoolParams)
    },
    appoint(row) {
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
    handleClose(tag) {
      for (let index = 0; index < this.selectMember.length; index++) {
        const element = this.selectMember[index]
        if (element.id === tag.id) {
          this.selectMember.splice(index, 1)
          break
        }
      }
    },
    selectChooseObj(code, option) {
      let obj = {}
      obj = option.find((item) => { // model就是上面的数据源
        return item.value === code// 筛选出匹配数据
      })
      return obj
    }
  }
}
</script>

<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
