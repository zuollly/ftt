<template>
  <div>
    <el-dialog
      title="学段学科"
      :visible.sync="dialogVisible"
      width="40%">
      <el-tree
      :data="studyPhaseList"
      :default-checked-keys="select"
      node-key="code"
      ref="tree"
      show-checkbox
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDictRelationListPage } from '@/api/dict'
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
      checked: []
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
    getData() {
      const params = {
        groupCode: 'bMOU_EQbt',
        pageNum: 1,
        pageSize: 1000
      }
      this.fetchDictRelationListPage(params).then(res => {
        if (res.data.code === 200) {
          this.createTree(res.data.result.data)
        }
      })
    },
    createTree(array) {
      const arr = []
      const firstLevel = []
      tree.bind(this)(array)
      function tree(array) {
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          if (firstLevel.indexOf(element.code.split('_')[0]) < 0) {
            firstLevel.push(element.code.split('_')[0])
            arr.push({ label: element.key.dictValue,
              value: element.key.dictKey,
              children: [{ label: element.value.dictValue, value: element.value.dictKey, id: element.id, code: element.code }]
            })
            array.splice(index, 1)
            index--
          } else {
            arr[firstLevel.indexOf(element.code.split('_')[0])].children.push({
              label: element.value.dictValue, value: element.value.dictKey, id: element.id, code: element.code
            })
          }
        }
        console.log(arr)
        this.studyPhaseList = arr
      }
    },
    sureBtn() {
      const checked = this.$refs.tree.getCheckedKeys().filter(el => { return el })
      this.dialogVisible = false
      console.log(checked)
      const studyphaseToSubject = []
      this.studyPhaseList.forEach(el => {
        el.children.forEach(ele => {
          if (checked.indexOf(ele.code) > -1) {
            studyphaseToSubject.push(el.label + ' - ' + ele.label)
          }
        })
      })
      this.$emit('studyPhase', checked, studyphaseToSubject)
    },
    fetchDictRelationListPage(params) {
      return new Promise((resolve, reject) => {
        fetchDictRelationListPage(params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
