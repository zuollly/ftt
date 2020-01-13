<template>
  <div class="phase">
    <!-- <el-row :gutter="30"> -->
     <el-col :span="12">
    <el-select v-model="phaseId" placeholder="请选择学段"  @change="facultyChange" style="width: 99%;marginRight: 2%">
      <el-option
        v-for="item in phaseList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
     </el-col>
     <el-col :span="12">
    <el-select v-model="subjectId" placeholder="请选择学科"  @change="subjectChange" style="width: 99%">
      <el-option
        v-for="item in subjectList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
      </el-col>
    <!-- </el-row> -->
  </div>
</template>

<script>
/*
  学段学科: 通过触发 父组件的 faculty 自定义事件, 将学科学段的id传过去
*/
import { studyPhase } from '@/utils/reallyMixin'
export default {
  name: 'Studyphase',
  data() {
    return {
      phaseList: [],
      subjectList: [],
      phaseId: '',
      subjectId: ''
    }
  },
  mixins: [studyPhase],
  watch: {
    selected: function(val) {
      this.phaseId = val.phaseId
      this.subjectId = val.subjectId
    }
  },
  mounted() {
    this.phaseId = this.selected.phaseId
    this.subjectId = this.selected.subjectId
    this.subject().then(res => {
      this.subjectList = res
    })
    this.phase().then(res => {
      this.phaseList = res
    })
  },
  props: {
    selected: {
      type: Object
    }
  },
  methods: {
    facultyChange() { // 学段改变
      this.$emit('faculty', { phaseId: this.phaseId, subjectId: this.subjectId })
    },
    subjectChange() { // 学科改变
      this.$emit('faculty', { phaseId: this.phaseId, subjectId: this.subjectId })
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.phase {
  max-width: 437px;
}
</style>
