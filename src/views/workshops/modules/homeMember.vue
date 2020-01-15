<template>
  <div class="card-home-member">
    <div class="text item">
      <ul class="list-group list-group-flush list-text">
        <li class="list-group-item" v-for="(item,index) in homeMemberList" :key="index">
          <div class="d-flex list-group-con">
            <div style="width: 15%">
              <!-- <span class="text-muted">{{item.projectName}}</span> -->
              <!-- <img v-if="index<3" style="width: 20px;height:20px" src="../../../../static/images/avatar.jpg" alt=""> -->
              <!-- <span v-else>{{index + 1}}</span> -->
              <svg-icon v-if="index===0" style="width: 30px;height:30px" iconClass='one'></svg-icon>
              <svg-icon v-if="index===1" style="width: 30px;height:30px" iconClass='two'></svg-icon>
              <svg-icon v-if="index===2" style="width: 30px;height:30px" iconClass='three'></svg-icon>
              <svg-icon v-if="index>2" style="width: 30px;height:30px" iconClass='more'></svg-icon>
            </div>
            <div style="width: 15%;height: 30px;line-height: 30px">
              <img v-if="item.userImg" style="width: 20px;height:20px;vertical-align: middle;" :src="item.userImg" alt="">
              <img v-if="!item.userImg" style="width: 20px;height:20px;vertical-align: middle;" src="http://api.yx.nercel.cn/file/avator/default_avator.jpg" alt="">
            </div>
            <div style="width: 55%;height: 30px;line-height: 30px">
              <span class="text-muted">{{item.userName}}</span>
            </div>
            <div style="width: 20%;height: 30px;line-height: 30px">
              <span class="text-muted">{{item.weekLiness}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="homeMemberList.length === 0">
      <LayNotData gridType="tb"></LayNotData>
    </div>
  </div>
</template>

<script>
// import img from '@/assets/1.jpg'
export default {
  data() {
    return {
      img: ''
    }
  },
  components: {
    LayNotData: () => import('@/modules/LayNotData')
  },
  props: ['homeMemberList'],
  methods: {
    getMoreMember() {
      const workshopId = this.$route.params.id
      this.$router.push({
        name: 'memberList',
        params: { id: workshopId }
      })
    }
  }
}
</script>

<style lang='scss'>
.card-home-member {
  width: 100%;
  padding: 10px;
  .list-group-con{
    height: 30px;
  }
}
</style>
