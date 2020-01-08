<template>
  <div>
    <el-dialog
      title="新增环节"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="120px" size="small">
      <el-form-item label="环节名称" required>
        <el-input v-model="form.stepName" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="环节开始时间" required>
        <el-date-picker
          v-model="form.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="环节结束时间" required>
        <el-date-picker
          v-model="form.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="环节类型" required>
        <el-select v-model="form.stepTypeCode" placeholder="请选择">
          <el-option
            v-for="item in stepTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="环节描述">
        <tinymce :value='form.description' v-model="form.description" :height='200'></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="sureBtn">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { insertActivityStep, activityStepTypeList, updateActivityStep } from '@/api/activityCopy'
import { html2Text } from '@/utils/filters'
export default {
  components: {
    tinymce: () => import('@/components/tinymce')
  },
  data() {
    return {
      form: { description: '', stepName: '', startTime: '', endTime: '', stepTypeCode: '' },
      stepTypeOptions: [],
      dialogVisible: true
    }
  },
  props: {
    stageId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: [Boolean, Object]
    },
    stepNumber: {
      type: Number
    }
  },
  mounted() {
    this.getStepTypeList()
    if (this.isEdit) {
      this.form = JSON.parse(JSON.stringify(this.isEdit))
    }
  },
  methods: {
    getStepTypeList() {
      this.activityStepTypeList().then(res => {
        if (res.data.code === 200) {
          this.stepTypeOptions = res.data.result.map(el => {
            return { value: el.typeCode, label: el.typeName }
          })
        }
      })
    },
    ruleCheck() {
      if (!this.form.stepName.trim()) {
        this.$message.warning('请填写环节名称')
        return false
      }
      if (!this.form.startTime) {
        this.$message.warning('请选择环节开始时间')
        return false
      }
      if (!this.form.endTime) {
        this.$message.warning('请选择环节结束时间')
        return false
      }
      if (this.form.startTime > this.form.endTime) {
        this.$message.warning('请正确选择时间')
        return false
      }
      if (!this.form.stepTypeCode) {
        this.$message.warning('请选择环节类型')
        return false
      }
      return true
    },
    sureBtn() {
      if (!this.ruleCheck()) {
        return
      }
      const params = Object.assign(this.form, {
        stageId: this.stageId,
        stepIntroduction: html2Text(this.form.description).substring(0, 150)
      })
      if (this.isEdit && this.isEdit.id) {
        this.updateActivityStep([params]).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message.success('填写成功')
            this.$emit('addStepSuccess', true)
          } else {
            this.$message.warning(res.data.msg)
          }
        })
        return
      }
      params.stepSort = ++this.stepNumber
      this.insertActivityStep(params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message.success('填写成功')
          this.$emit('addStepSuccess', res.data.result)
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    cancel() {
      this.$emit('addStepSuccess')
    },
    handleClose(done) {
      this.$emit('addStepSuccess')
      done()
    },
    /* axios------ */
    insertActivityStep(params) {
      return new Promise((resolve, reject) => {
        insertActivityStep(params).then(res => {
          resolve(res)
        })
      })
    },
    activityStepTypeList() {
      return new Promise((resolve, reject) => {
        activityStepTypeList().then(res => {
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
    }
  }
}
</script>

<style scoped lang="scss">
</style>
