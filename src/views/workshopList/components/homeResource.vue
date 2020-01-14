<template>
  <div class="homeResourceWrapper">
    <div class="content">
      <div class="main" v-for="(item, idx) in resourcetDataList" :key="idx">
        <div class="top">
          <img :src="item.groupLogo" alt="">
          <div class="desc">
            <p class="nameG">{{item.groupName}}</p>
            <p class="numW"><span class="num">{{item.groupResources}}</span>篇文档</p>
          </div>
        </div>
        <div class="bottom">
          <div v-for="(ele, index) in item.contents" :key="index">
            <div class="contentB">
              <el-tooltip class="item" effect="dark" :content="ele.title" placement="top-start">
                <div class="title">{{ele.title}}</div>
              </el-tooltip>
              <div>{{ele.userName}}</div>
              <div>{{ele.createTime}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['resourcetDataList']
}
</script>
<style lang="scss" scoped>
.homeResourceWrapper{
  .content{
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    .main{
      height: 180px;
      width: 32%;
      margin-right: 1%;
      background: #F5F5F5;
      margin-bottom: 10px;
      padding: 10px;

      .top{
        margin-bottom: 5px;
        height: 75px;
        display: flex;
        flex-direction: row;
        img{
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }
        .desc{
          padding: 0px 0 0 15px;
          .nameG{
            font-size: 18px;
          }
          .numW{
            color: #BDBDBC;
          }
          .num{
            color: #F8620F;
            font-size: 16px;
          }
          p{
            margin-bottom: 5px;
          }
        }
      }
      .bottom{
        height: 95px;
        .contentB{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #545455;
          .title{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 50%
          }
        }
      }
    }
  }
}
</style>
