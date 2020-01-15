<template>
  <div class="container mt-3">
    <BackSuperior></BackSuperior>
    <el-row :gutter="18">
      <el-col :span="24">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="card-title">{{title||'资源分享'}}</span>
          </div>
          <article class="article">
            <h3 class="article-title text-center">{{instationDetail.title}}</h3>
            <div class="article-mate">
              <span>发布者： {{instationDetail.userName||'佚名'}}</span>
              <span>发布于：{{instationDetail.createTime && instationDetail.createTime.split(' ')[0]}}</span>
              <!-- <span>资源分类</span> -->
              <span>阅读数({{instationDetail.views||0}})</span>
              <span v-if="!title">点赞数({{instationDetail.ups||0}})</span>
              <span v-if="!title">评论数 ({{instationDetail.comments||0}})</span>
            </div>
            <div v-html="transRichImg(instationDetail.txt)"></div>
            <div class="article-body" v-if="!instationDetail.link">
              <iframe :src="previewUrl" frameborder="0" style="width: 100%; height: 510px"></iframe>
            </div>
            <div class="article-body" v-if="instationDetail.link">
              <div>
                资源标题：
                <span class="wbba">{{instationDetail.title}}</span>
              </div>
              <div>
                资源地址：
                <a
                  class="wbba"
                  :href="instationDetail.link"
                  target="_blank"
                >{{instationDetail.link}}</a>
              </div>
              <div>
                资源描述：
                <!-- <span class="wbba">{{instationDetail.introduction}}</span> -->
                <span class="wbba" v-html="transRichImg(instationDetail.introduction)"></span>
              </div>
              <div>
                关键字：
                <span class="wbba">{{instationDetail.keywords}}</span>
              </div>
            </div>
          </article>
          <div class="article-footer">
            <div class="text-center">
              <el-button type="warning" @click="addContentUp()">点赞</el-button>
            </div>
          </div>
          <div
            class="mt-3"
          >
            <z-z-comment-list
              @commenthandle="commenthandler"
              :categoryId="instationBaseInfo.contentId || instationBaseInfo.id"
              :category="instationBaseInfo.type || instationDetail.fileType || 'doc'"
              :categoryName="instationDetail.title"
              :categoryUrl="projectUrl"
              :userId="uuid"
              :avatar="userAvatar"
              :needLogin="needLogin"
              :loginRouteName="'login'"
            ></z-z-comment-list>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetchContentById, giveContentUp } from '@/api/content'
import { getPreviewURL } from '@/api/file.js'
import { mapGetters } from 'vuex'
import { transRichImg } from '@/utils/filters'
export default {
  components: {
    ZZCommentList: () => import('@/components/comment/index'),
    BackSuperior: () => import('@/components/BackSuperior')
  },
  mounted() {
    this.getChannelById()
  },
  data() {
    return {
      textarea: '',
      authorModule: 'fourth',
      recentModule: 'fifth',
      docType: this.$route.query.docType,
      title: this.$route.query.title,
      needLogin: false,
      projectUrl: window.location.href,
      activeNames: ['1'],
      instationBaseInfo: this.$route.query,
      instationDetail: {
        title: ''
      },
      previewUrl: '',
      tc: ''
    }
  },
  computed: {
    ...mapGetters(['uuid', 'userAvatar', 'kingdomId'])
  },
  methods: {
    transRichImg,
    commenthandler(param) {
      console.log(param)
      if (param.status === 'success') {
        if (param.type === 'comment') {
          this.instationDetail.comments++
        } else if (param.type === 'delete') {
          this.instationDetail.comments--
        }
      }
    },
    handleChange(val) {
      console.log(val)
    },
    getChannelById() {
      fetchContentById({ id: this.$route.params.id }).then(res => {
        res = res.data
        if (res.code === 200) {
          this.instationDetail = res.result
          if (res.result.fileId) {
            this.getFilePreSee(this.instationDetail.fileId)
          }
        }
      })
    },
    // getContentRelevanceById() {
    //   fetchContentRelevanceById({ id: this.instationBaseInfo.id, modelCode: 'doc' }).then(res => {
    //     res = res.data
    //     if (res.code === 200) {
    //       this.instationDetail = res.result
    //       this.instationBaseInfo['contentId'] = res.result.contentId
    //       if (this.instationDetail.fileId) this.getFilePreSee(this.instationDetail.fileId)
    //     }
    //   })
    // },
    // 内容点赞
    addContentUp() {
      giveContentUp({
        contentId: this.instationDetail.contentId,
        userId: this.uuid
      }).then(res => {
        res = res.data
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.init()
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      })
    },
    // 获取文件预览地址
    getFilePreSee(id) {
      getPreviewURL({ id: id }).then(res => {
        console.log(res, '99999--')
        res = res.data
        this.previewUrl = res
      })
    }
    // queryRelevanceOne(id) {
    //   fetchRelevanceOne({ id: id }).then(res => {
    //     console.log(res, 10)
    //     this.instationDetail = res.data.result
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
.wbba {
  word-break: break-all;
}
</style>
