
<template>
  <div class="container mt-3">
    <el-row :gutter="18">
      <el-col :span="24">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="headerWrapper">
            <span class="card-title">{{instationBaseInfo.categoryMap}}</span>
            <el-button type="warning" size="mini" @click="back">返回</el-button>

          </div>
          <article class="article">
            <h3 class="article-title text-center">{{instationDetail.title}}</h3>
            <div class="article-mate">
              <span>发布者： {{instationDetail.userName||'佚名'}}</span>
              <span>阅读数({{instationDetail.views||0}})</span>
              <span>点赞数({{instationDetail.ups||0}})</span>
              <span>评论数 ({{instationDetail.comments||0}})</span>
            </div>
            <div class="article-body" v-html="transRichA(transRichImg(instationDetail.txt))"></div>
            <div class="article-footer">
              <div class="text-center">
                <el-button type="warning" @click="setNoticeUp()">点赞</el-button>
              </div>
            </div>
          </article>
          <div class="mt-3">
            <z-z-comment-list
              @commenthandle="commenthandler"
              :categoryId="instationBaseInfo.contentId"
              :category="instationBaseInfo.type"
              :categoryName="instationDetail.title"
              :categoryUrl="projectUrl"
              :userId="uuid"
              :avatar="userInfo.userAvatar"
              :needLogin="needLogin"
              :loginRouteName="'login'"
            ></z-z-comment-list>
          </div>
          <!-- <div class="mt-3">
            <comment-add></comment-add>
          </div>
          <div class="mt-3">
            <comment-list></comment-list>
          </div>-->
        </el-card>
      </el-col>
      <!-- <el-col :span="6"></el-col> -->
    </el-row>
  </div>
</template>
<script>
import { giveContentUp, fetchContentById } from '@/api/content'
import { transRichImg, transRichA } from '@/utils/filters'
import { mapGetters } from 'vuex'
export default {
  name: 'NoticeShow',
  components: {
    /* commentAdd: () => import('@/views/modules/comment/commentAdd'),
    commentList: () => import('@/views/modules/comment/commentList'), */
    ZZCommentList: () => import('@/components/comment/index')
  },
  mounted() {
    this.getNoticeById()
  },
  data() {
    return {
      textarea: '',
      needLogin: false,
      projectUrl: window.location.href,
      instationBaseInfo: this.$route.query,
      activeNames: ['1'],
      instationDetail: {
        category: 'project',
        content: '第三期简报',
        createTime: '2019-05-31 16:52:44',
        description: null,
        status: 2,
        title: '第三期简报',
        type: 'briefing',
        updateTime: '2019-05-31 16:52:44',
        userId: 'cfe4d43f5a95e68d3eb40686d4be003b',
        userName: '项目管理员'
      },
      // userId: '1058da0851a3d8cd0a3a77f4470051c7',
      userInfo: this.$store.state.user
    }
  },
  computed: {
    ...mapGetters([
      'uuid'
    ])
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    transRichImg,
    transRichA,
    handleChange(val) {
      console.log(val)
    },
    commenthandler(param) {
      console.dir(param)
      if (param.status === 'success') {
        this.getNoticeById()
      }
    },
    // 公告什么的点赞
    setNoticeUp() {
      const data = {
        contentId: this.$route.query.contentId,
        userId: this.uuid
      }
      giveContentUp(data).then(res => {
        res = res.data
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '点赞成功！'
          })
          this.getNoticeById()
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      })
    },
    // 获取公告、简报、通知详情
    getNoticeById() {
      fetchContentById({ id: this.$route.params.id }).then(res => {
        res = res.data
        if (res.code === 200) {
          this.instationDetail = res.result
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
  .headerWrapper{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .article-body{
    a{
      text-decoration: black;
      color: red;
    }
  }
</style>
