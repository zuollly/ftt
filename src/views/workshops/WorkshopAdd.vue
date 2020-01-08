<template>
  <div>
    <el-dialog title="创建工作坊" :visible.sync="shopVisible" :close-on-click-modal='false' :before-close='beforeClose' class="dialog">
      <el-form :model="shopTemp" :rules="shopRule" ref="shopTemp" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工作坊名称" prop="name">
          <el-col :span="12">
          <el-input v-model="shopTemp.name" placeholder='请输入工作坊名称, 20字以内' maxlength="20" style="max-width: 437px;"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学段学科" required>
          <el-col :span="12">
          <!-- <studyphase @faculty='subject'></studyphase> -->
          </el-col>
        </el-form-item>
        <el-form-item label="设置坊主" required>
          <el-col :span="12" class="shoperBox">
          <el-input v-model="shopTemp.shoperInfo.name"  @click.native="openChoose" readonly placeholder='请选择工作坊坊主' class='shoper'></el-input>
          <svg-icon :iconClass='"admin"' class="admin"></svg-icon>
          </el-col>
        </el-form-item>
        <el-form-item label="工作坊介绍" prop="introduction">
          <el-col :span="18">
          <tinymce :value='shopTemp.introduction' v-model="shopTemp.introduction" :height="200"></tinymce>
          </el-col>
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            class="tag"
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            maxlength="10"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-tooltip v-else class="item" effect="dark" content="每个关键字最多输入十个字" placement="top-start">
          <el-button class="button-new-tag" size="small" type="success" @click="showInput">添加关键词</el-button>
          </el-tooltip>
        </el-form-item>
        <div class="btnGroup">
          <el-button type="primary" @click="submitpunish('shopTemp')">{{"确定"}}</el-button>
          <el-button @click="cancelpunish('shopTemp')">取消</el-button>
        </div>
      </el-form>
      <choosePerson v-if="chooseVisible" :choosePersonTitle="choosePersonTitle" @closeChoose='closeChoose' :isSingle="'single'" :checkedPersonId='checkedPersonId'></choosePerson>
    </el-dialog>
  </div>
</template>

<script>
// import { addWorkshop } from '@/api/workshop'
export default {
  name: 'WorkshopAdd',
  components: {
    choosePerson: () => import('@/modules/choosePerson'),
    // studyphase: () => import('@/modules/studyphase'),
    tinymce: () => import('@/components/tinymce')
  },
  data() {
    return {
      shopVisible: true,
      shopTemp: {
        introduction: '',
        shoperInfo: {}
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      shopRule: {
        name: [
          { required: true, message: '请输入工作坊名称', trigger: 'blur' },
          { max: 20, message: '长度在 20 个字以内', trigger: 'blur' }
        ]
      },
      chooseVisible: false,
      faculty: {}, // 学段学科的id,
      choosePersonTitle: '设置坊主'
    }
  },
  computed: {
    description() {
      const div = document.createElement('div')
      div.innerHTML = this.shopTemp.introduction
      return div.innerText.substr(0, 100)
    },
    checkedPersonId() {
      return [this.shopTemp.shoperInfo.id]
    }
  },
  methods: {
    openChoose() {
      this.chooseVisible = true
    },
    closeChoose(data) {
      this.chooseVisible = false
      if (data) {
        this.shopTemp.shoperInfo = data[0] || {}
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    subject(data) {
      // 学段学科
      this.faculty = data
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue && this.dynamicTags.indexOf(inputValue) < 0) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    submitpunish() {
      if (!this.filter()) {
        return
      }
      const params = {
        groupName: this.shopTemp.name,
        adminUserId: this.shopTemp.shoperInfo.id,
        description: this.description,
        faculty: this.faculty.facultyId,
        introduction: this.shopTemp.introduction,
        label: this.dynamicTags.join(','),
        subject: this.faculty.subjectId,
        facultyName: this.faculty.facultyName,
        subjectName: this.faculty.subjectName
      }
      this.insertGroup(params).then(data => {
        console.log(data)
        if (data.data.code === 200) {
          this.$message({ message: '添加成功', type: 'success' })
          this.$emit('close', true)
        } else {
          this.$message.warning(data.data.msg)
        }
      })
    },
    cancelpunish() {
      this.$emit('close')
    },
    beforeClose(done) {
      this.shopVisible = true
      this.$emit('close')
      done()
    },
    filter() {
      // 验证
      if (!this.shopTemp.name) {
        this.$message({ message: '请输入工作坊名称', type: 'warning' })
        return false
      }
      if (!this.faculty.facultyId) {
        this.$message({ message: '请选择学段', type: 'warning' })
        return false
      }
      if (!this.faculty.subjectId) {
        this.$message({ message: '请选择学科', type: 'warning' })
        return false
      }
      if (!this.shopTemp.shoperInfo.id) {
        this.$message({ message: '请设置坊主', type: 'warning' })
        return false
      }
      return true
    },
    /* axios---- */
    insertGroup(params) {
      return new Promise((resolve, reject) => {
        // addWorkshop(params).then(res => {
        //   resolve(res)
        // })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.dialog {
  min-width: 720px;
}
.btnGroup {
  text-align: center;
  margin-top: 10px;
}
// .admin {
//   transform: translateX(-27px);
// }
.shoperBox {
  position: relative;
  max-width: 437px;
  .admin {
    transform: translateY(-50%);
    position: absolute;
    right: 27px;
    top: 20px;
  }
}
.shoper {
  max-width: 437px;
  /deep/ .el-input__inner {
    cursor: pointer;
  }
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 160px;
  margin-left: 10px;
  vertical-align: bottom;
}
.tag {
  margin-left: 10px;
}
</style>
