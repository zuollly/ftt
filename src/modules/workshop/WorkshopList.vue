<template>
  <div class="workshopListWrapper">
    <div class="workshopList-block-wrapper">
      <!-- <div class="workshopList-block"> -->
        <!-- <div class="workshop-details" v-for="(item, idx) in workshopList" :key="idx">
          <div class="image">
            <img v-if="item.groupImg" :src="item.groupImg" alt="">
            <img v-else src="http://api.yx.nercel.cn/file/avator/default_avator.jpg" alt="">
          </div>
          <div class="label">
            <span class="name">{{item.groupName}}</span>
            <span class="seg" v-if="item.groupSegSubs">{{item.groupSegSubs[0].segSubtName}}</span>
          </div>
          <div class="maskBtn">
            <el-button round @click="enterWorkshop(item)">查看名师工作室</el-button>
          </div>
          <div class="workshopList-mask">
            <div class="personal-statics">
              <div class="statics-label statics-line">
                <p class="num">{{item.groupViews || 0}}</p>
                <p class="type">访问量</p>
              </div>
              <div class="statics-label statics-line">
                <p class="num">{{item.groupResources || 0}}</p>
                <p class="type">资源数</p>
              </div>
              <div class="statics-label">
                <p class="num">{{item.groupLiveness || 0}}</p>
                <p class="type">活跃度</p>
              </div>
            </div>
          </div>
        </div> -->
        <el-row class="workshopList-block" :gutter="30">
          <el-col class="workshop-details" :span="6" v-for="(item, idx) in workshopList" :key="idx">
            <div class="workshop-details-con">
              <div class="image">
                <img v-if="item.groupImg" :src="item.groupImg" alt="">
                <img v-else src="http://api.yx.nercel.cn/file/avator/default_avator.jpg" alt="">
              </div>
              <div class="label">
                <span class="name">{{item.groupName}}</span>
                <span class="seg" v-if="item.groupSegSubs">{{item.groupSegSubs[0].segSubtName}}</span>
              </div>
              <div class="maskBtn">
                <el-button round @click="enterWorkshop(item)">查看名师工作室</el-button>
              </div>
              <div class="workshopList-mask">
                <div class="personal-statics">
                  <div class="statics-label statics-line">
                    <p class="num">{{item.groupViews || 0}}</p>
                    <p class="type">访问量</p>
                  </div>
                  <div class="statics-label statics-line">
                    <p class="num">{{item.groupResources || 0}}</p>
                    <p class="type">资源数</p>
                  </div>
                  <div class="statics-label">
                    <p class="num">{{item.groupLiveness || 0}}</p>
                    <p class="type">活跃度</p>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['workshopList'],
  components: {
  },
  methods: {
    handleClick() {
      console.log(1)
    },
    enterWorkshop(item) {
      console.log(item)
      this.$router.push({ name: 'workshop',
        params: { id: item.id }})
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.workshopListWrapper{
  .workshopList-block-wrapper{
    padding: 20px 0px 20px 2%;
  }
  .workshopList-block{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .workshop-details{
        position: relative;
        border-radius: 15px;
        // width: 18%;
        // width: 240px;
        height: 300px;
        // margin-right: 2%;
        margin-bottom: 20px;
        .workshop-details-con{
          background: #F5F5F5;
          width: 100%;
          height: 300px;
          border-radius: 10px;
        }
      .image{
        width: 100%;
        height: 80px;
        position: absolute;
        text-align: center;
        margin-bottom: 10px;
        left: 0;
        top: 32px;
        z-index: 99;
        img{
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .label{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 50px;
        position: absolute;
        left: 0;
        top: 119px;
        width: 100%;
        height: 78px;
        .name{
          font-size: 20px;
          margin-bottom: 10px;
        }
        .seg{
          font-size: 16px;
          color: #1a1717;
        }
      }
      .maskBtn{
        z-index: 99;
        position: absolute;
        left: 0;
        bottom: 33px;
        width: 100%;
        height: 50px;
        text-align: center;
      }
    }
  }
  .workshopList-mask{
    position: absolute;
    margin-left: 15px;
    margin-right: 15px;
    width: calc(100% - 30px);
    height: 70%;
    left: 0;
    bottom: 0;
    cursor: pointer;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    z-index: 1;
    background-color: #409EFE;
    transition: opacity 0.3s;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    .personal-statics{
      width: 100%;
      // height: 100px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 45px 15px 20px 15px;
      .statics-line{
        border-right: 1px #F1F1F1 solid;
      }
      .statics-label{
        width: 30%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .num{
          font-size: 20px;
        }
        .type{
          font-size: 16px;
          color: #ffffff;
        }
      }
    }
  }
  .workshopList-mask:hover {
    opacity: 1;
  }
  .maskBtn:hover+.workshopList-mask {
    opacity: 1;
  }
}
</style>
