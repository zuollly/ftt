<template>
  <div>
    <el-dialog :title="choosePersonTitle" :visible.sync="chooseVisible" :before-close='beforeClose' :close-on-click-modal='false' append-to-body>
      <div class="content">
        <div class="top">
          <el-input v-model="search" placeholder="请输入人名" clearable></el-input>
        </div>
        <div class="main">
          <div v-if="!listData.length && isFirst" class="loading"><i class="el-icon-loading"></i>loading...</div>
          <div v-else-if="!listData.length && !isFirst" class="loading">未检索到相关成员</div>
          <ul class="clearfix ulList" v-else>
            <li v-for="(item, index) in listData" :key="index" @click="select(index)" :class="{ border409EFF: checkList[index] }">
              <!-- 背景图不能这样用过滤器, 除非自己在转换一次 -->
              <!-- <span class="pic" :style="{ backgroundImg: `url(${item.avatar | domain})` }"></span> -->
              <span class="checkIcon"><i class="el-icon-success" v-if="checkList[index]"></i></span>
              <img class="pic" :src="item.avatar | domain(appConfig.cfg_upfile_path, appConfig.cfg_user_face_not)" alt="pic">
              <div class="right">
                <p>{{item.name}}</p>
                <p><span>{{item.subject}}</span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="dialog-footer">
        <!-- <el-button @click="cancelBtn">取 消</el-button> -->
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPersonList } from '@/api/member'
import appConfig from '../../../static/appConfig.js'
export default {
  name: 'ChoosePerson',
  data() {
    return {
      appConfig: appConfig,
      chooseVisible: true,
      allData: [],
      search: '',
      isFirst: true // 因为搜索的写法, 这里打了一个补丁
    }
  },
  props: {
    isSingle: {
      // 参数为  multiple single    multiple代表可以多选, single代表单选
      type: String,
      default: 'multiple'
    },
    checkedPersonId: { // 选中的人的id组成的数组
      type: Array
    },
    choosePersonTitle: { // 弹窗的title
      type: String
    },
    groupId: { // 坊的id, 如果传了, 那么查出的结果就会过滤掉该坊的成员
      type: String
    }
  },
  mounted() {
    this.teacherList()
  },
  methods: {
    teacherList() {
      // 教师list
      return this.getTeachers().then(data => {
        console.log(data)
        if (data.data.code === 200) {
          this.allData = data.data.result.list.map(el => {
            return { id: el.userId, name: el.real, subject: el.subjName, avatar: el.avatar, checked: false }
          })
          if (this.checkedPersonId) {
            this.checkedPersonId.forEach(el => {
              this.allData.forEach(ele => {
                if (ele.id === el) {
                  ele.checked = true
                }
              })
            })
          }
          this.isFirst = false
        }
      })
    },
    select(index) {
      console.log(index)
      const bool = this.listData[index].checked // 基础数据类型才可以这样
      if (this.isSingle === 'single') {
        this.allData.forEach(el => {
          el.checked = false
        })
      }
      this.listData[index].checked = !bool // 原来computed里面的数据结构是这样的是可以修改的
    },
    sureBtn() {
      this.$emit('closeChoose', this.checked)
    },
    beforeClose(done) {
      this.$emit('closeChoose')
    },
    /* axios----- */
    getTeachers() {
      return new Promise((resolve, reject) => {
        const params = { pageCurrent: 1, pageSize: 1000 }
        if (this.groupId) { params.groupId = this.groupId }
        getPersonList(params).then(res => {
          resolve(res)
        })
      })
    }
  },
  computed: {
    listData() {
      if (!this.search.trim()) {
        return this.allData
      }
      return this.allData.filter(el => {
        return el.name.indexOf(this.search) > -1
      })
    },
    checkList() {
      return this.listData.map(el => el.checked)
    },
    checked() {
      // 选中的
      return this.allData.filter(el => {
        return el.checked
      })
    }
  },
  components: {}
}
</script>

<style scoped lang="scss">

$border: 1px solid #eee;
$border409EFF: 1px solid #409EFF;
.border409EFF {
  border: $border409EFF;
}
.boxShadow {
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, .1);
  transform: translate3d(0, -2px, 0);
}
.clearfix:before,
.clearfix:after {
  content: '';
  display: table;
}
.clearfix:after {
  clear: both;
  overflow: hidden;
}
.dialog-footer {
  text-align: center;
  margin-top: 30px;
}
.content {
  border: $border;
  padding: 5px;
  // width: 850px;
  .top {
    height: 50px;
    border-bottom: $border;
    /deep/ .el-input__inner {
      border: none;
    }
  }
  .loading {
    text-align: center;
    font-size: 20px;
    line-height: 400px;
    i {
      font-size: 40px;
      margin-right: 15px;
    }
  }
  .main .ulList {
    height: 400px;
    overflow: scroll;
    li {
      float: left;
      width: 160px;
      height: 50px;
      padding: 5px 0 5px 5px;
      margin-top: 20px;
      margin-right: 5px;
      cursor: pointer;
      transition: all .1s linear;
      &:hover {
        // border: 2px solid #7bc7f0;
        box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, .1);
        transform: translate3d(0, -2px, 0);
      }
      .checkIcon {
        display: inline-block;
        width: 14px;
      }
      .pic {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 3px;
        vertical-align: top;
      }
      .right {
        display: inline-block;
        height: 40px;
        width: 85px;
        vertical-align: top;
      }
      .el-icon-success {
        line-height: 40px;
        color: #1295db;
      }
    }
  }
}
</style>
