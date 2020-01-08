<template>
    <div class="apply-member-wrapper">
      <div class="apply-member-list">
        <!-- <div v-if="homeMemberList.length === 0"><div class="text-center mb-5"><img :src="$store.getters.appConfig.cfg_thumbnail_not" /> <p class="text-muted" style="font-size: 16px">{{$store.getters.appConfig.cfg_data_not_disc}}</p></div></div> -->
        <div v-if="homeMemberList.length === 0">
          <LayNotData gridType="tb"></LayNotData>
        </div>
        <div class="apply-member-list-body" v-for="(item, index) in homeMemberList" :key="index">
          <el-checkbox v-model="item.checked"></el-checkbox>
          <img :src="item.userVO.avatar | domain(appConfig.cfg_upfile_path, appConfig.cfg_user_face_not)" class="img align-middle rounded"/>
          <div class="apply-member-main-body">
            <p>{{item.userVO.real}}</p>
            <!-- <p>{{item.userVO.sign}}</p> -->
            <p class="media-userinfo"><span>学科：</span><span>{{item.userVO.subjName | subjectFilter}}</span><span style="margin: 0 10px 0 10px">  |  </span><span>申请时间：</span><span>{{item.applyTime | jionTimeFilter | parseTime('{y}年{m}月{d}日')}}</span></p>
            <p class="media-userinfo">{{item.userVO.sign | descriptionFilter}}</p>
          </div>
          <div>
            <div class="apply-member-main-operator">
              <div class="btn">
                <el-button type="success" size='mini' @click="getOperatorMember(item, 'pass', 'single')">通过</el-button>
              </div>
              <div class="btn">
                <el-button type="danger" size='mini' @click="getOperatorMember(item, 'refuse', 'single')">拒绝</el-button>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
</template>
<script>
import img from '@/assets/1.jpg'
import { mapGetters } from 'vuex'
export default {
  components: {
    LayNotData: () => import('@/modules/LayNotData')
  },
  data() {
    return {
      checked: true,
      img: img
    }
  },
  computed: {
    ...mapGetters([
      'appConfig'
    ])
  },
  props: ['homeMemberList', 'count'],
  filters: {
    descriptionFilter(val) {
      if (val === null || val === '' || val === undefined || val.length === 0) {
        return '暂无描述信息'
      } else {
        return val
      }
    },
    subjectFilter(val) {
      if (val === null || val === '' || val === undefined || val.length === 0) {
        return '暂无信息'
      } else {
        return val
      }
    },
    jionTimeFilter(val) {
      if (val === null || val === '' || val === undefined || val.length === 0) {
        return '暂无信息'
      } else {
        return val
      }
    }
  },
  methods: {
    getOperatorMember(item, status, type) {
      this.$emit('getRefuseApplyMember', type, status, item)
    }
  }
}
</script>
<style lang='scss' scoped>
.apply-member-wrapper {
  // border: solid #eeeeee 1px;
  // min-height: 250px;
  border-top: none;
  background: #fff;
  padding: 10px 15px 0 15px;
  box-sizing: border-box;
  .apply-member-list {
    margin-top: 10px;
    .home-member{
      color: #dbdbdb;
      margin: 100px auto;
      text-align: center;
      font-size: 25px;
    }
    .apply-member-list-body {
      border-bottom: 1px #eeeeee solid;
      box-sizing: border-box;
      padding: 10px 15px 10px 15px;
      height: calc(100% - 30px);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .img {
        width: 50px;
        height: 53px;
        border-radius: 5px;
        margin-left: 20px;
      }
      .apply-member-main-body {
        margin-left: 10px;
        flex: 1;
        width: 70%;
      }
      .apply-member-main-operator {
        width: 15%;
        display: flex;
        font-size: 12px;
        flex-flow: row-reverse center;
        .btn {
          flex: 1;
          text-align: center;
          margin-right: 10px;
        }
      }
    }
  }
  .pagination {
    display: table; /* 宽度不确定元素居中 */
    margin: 0 auto;
    padding: 20px;
  }
}
</style>
