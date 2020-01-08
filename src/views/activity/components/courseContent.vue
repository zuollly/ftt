 <template>
  <el-table class="courseWrapper" :data="courseInfo" style="width: 100%">
    <el-table-column label="课程名称" width="180">
      <template slot-scope="scope">
          <router-link :to="'/course/'+scope.row.courseId+'/course-study'" tag="a" target="_blank">{{scope.row.courseName}}</router-link>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="categoryName" label="类别" width="180"></el-table-column> -->
    <!-- <el-table-column prop="introduction" label="简介" width="180"></el-table-column> -->
    <el-table-column prop="moduleName" label="模块" width="180"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
    <el-table-column label="操作" width="180">
      <template>
        <router-link v-if='courseInfo.length' tag="a" target='_blank' :to="{ name: 'activity-course', params: { courseId: courseInfo[0].courseId } }">
          课程中心
        </router-link>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchCourseInfo } from '@/api/activityCopy.js'
export default {
  props: ['courseList'],
  data() {
    return {
      courseInfo: []
    }
  },
  watch: {
    courseList: function(val) {
      if (val.length) {
        this.queryCourseInfo(val[0])
      }
    }
  },
  methods: {
    toCourse() {
      this.$router.push({ name: 'activity-course' })
    },
    queryCourseInfo(obj) {
      this.fetchCourseInfo({ id: obj.serviceId }).then(res => {
        console.log(res.data, 1)
        if (res.data.code === 200) {
          this.courseInfo.push(res.data.result)
        }
      })
    },
    fetchCourseInfo(params) { // 获取课程基本信息
      return new Promise((resolve, reject) => {
        fetchCourseInfo(params).then(res => {
          resolve(res)
        })
      })
    }
  },
  mounted() {
    this.queryCourseInfo(this.courseList[0])
  }
}
</script>

<style lang="scss" scoped>
.courseWrapper{
  margin-bottom: 40px
}
</style>
