<template>
    <el-menu
      :mode="mode"
      :default-active="currentRoute"
      :active="currentRoute"
      @select="handleSelect"
      :collapse="onCollapse">
      <menu-item :menuData="dataTree"></menu-item>
    </el-menu>
</template>
<script>
import MenuItem from './MenuItem'
export default {
  name: 'NavMenu',
  components: {
    MenuItem
  },
  data() {
    return {
      isCollapse: true,
      dataTree: this.menuData
    }
  },
  watch: {
    currentRoute: function(val) {
      console.log(val, 'currentRoute')
    }
  },
  props: {
    mode: {
      type: String,
      default: 'horizontal' //
    },
    menuData: {
      type: Array
    },
    currentRoute: {
      type: String,
      default: 'workshop'
    },
    onCollapse: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // console.log(this.$route)
    // console.log(this.$route.matched[1].name)
    if (this.mode === 'horizontal') {
      this.dataTree = this.getTopMenuItem(this.getSideMenuItem(this.getNavMenuItems(this.dataTree)))
    } else {
      this.dataTree = this.getSideMenuItem(this.getNavMenuItems(this.dataTree))
    }
    // console.log(this.dataTree)
  },
  methods: {
    getNavMenuItems: function(list) {
      var _this = this
      const accessedList = list.filter(item => {
        if (!item.hidden) {
          if (item.children && item.children.length) {
            item.children = _this.getNavMenuItems(item.children)
          }
          return true
        }
        return false
      })
      console.log(accessedList, 'accessedList')
      return accessedList
    },
    getSideMenuItem: function(list) {
      var _this = this
      const accessedList = list.filter(item => {
        if (!item.hidden) {
          if (item.children) {
            if (item.children.length === 0) { delete item.children } else {
              item.children = _this.getSideMenuItem(item.children)
            }
          }
          return true
        }
        return false
      })
      return accessedList
    },
    getTopMenuItem: function(list) {
      var newList = []
      list.forEach(function(item, index) {
        if (index < 20) {
          newList.push(item)
        } else {
          if (newList.length < 21) {
            newList.push(
              { path: '···', name: '···', meta: { title: '···' }, children: [] })
          }
          newList[20].children.push(item)
        }
      })
      return newList
    },
    handleSelect: function(key) {
      var name = key
      var id = this.$route.params.id
      this.$router.push({
        name: name, params: { id: id }
      })
    }
  }
}
</script>
