<<<<<<< HEAD
# ft
=======
# workshop

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

// 动作类关键词
创建/添加    create / add
获取         get
删除         del / remove
修改         edit / alter
设置         set
发送         send
批量         batch
申请         apply  /  join
选择         select / choose

// 标识类关键词
首页         home / index / default /main
详情         details/show
列表         list / row
模块         module
统计         stat
基础         basics / base
信息         info
默认         default
成功         win/succeed
失败         failed
总数         sum/ total
操作         handle
实例         demo / example

// 项目主模块关键词
工作坊       workshop
活动         activity
简报         bulletin
公告         notice
资源         resource
成员         member

学段         studyphase
学科/科目    subject
教师         teacher
学校         school
机构         org / organization / company
用户         user / member / person
异常         exception
评论         comment  / review

图片         img / image / pic / picture  / photo  /  album(图集)
文件         file / folder / dir / directory

命名如下方：
如：获取工作坊详情
getWorkshopDetails
获取工作坊列表
getWorkshopList
获取工作坊模块
getWorkshopModule
创建工作坊
createWorkshop
批量创建工作坊
batchCreateWorkshop
修改工作坊
alterWorkshop
批量修改工作坊
batchAlterWorkshop
删除工作坊
removeWorkshop
批量删除工作坊
batchRemoveWorkshop
获取工作坊各模块总数
getWorkshopModuleSum



样式 全用sass
命名及规范

专属当前模块
<style lang="scss" rel="stylesheet/scss" scoped="scoped">
$name: '模块名-moduel';
.#{$name}｛
       列表类：
       图文混排类
       .media-{模块名}-{list | gruop | row}{
       }
       ul列表
        .ul-{模块名}-{list | gruop | row}{
       }
       table列表
        . table-{模块名}-{list | gruop | row}{
       }
      card列表
        . card-{模块名}-{list | gruop | row}{
       }
      详情类：
    .{模块名}-{details | show}
｝
</style>
如果当前模块需要公用样式,就在当前组件下再加一个
<style lang="scss" rel="stylesheet/scss">
</style>


vue规范
组件内规范
生命周期顺序及组件属性顺序
export default {
  name: '',        组件名称
  components:{}    引入外部组件
  mixins:[]        混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项
  data(){}         组件数据
  props: {}        接收数据
  computed:{}      监控自己定义的变量
  watch:{}         侦听器
  methods:{}       执行方法
  filter:{}        过滤器函数接收的第一个值
  directive:{}        自定义指令
  render(){}          渲染函数

  // 生命周期
  beforeCreate(){},   创建vue实例前
  created(){},        创建vue实例后
  beforeMount(){},    挂载到dom前
  mounted(){},        挂载到dom后
  beforeUpdate(){},   数据变化更新前
  updated(){},        数据变化更新后
  beforeDestroy(){},  vue实例销毁前
  destroyed(){}       vue实例销毁后
}
>>>>>>> ft
