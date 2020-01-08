<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    menuData: {
      type: Array
    }
  },
  render: function(h, context) {
    const { menuData } = context.props
    const vnodes = []
    function getTiem(children) {
      if (children) {
        return <menu-item menuData={children}/>
      } else {
        return <el-menu-item index={children.name} key={children.path}>{children.meta.title}</el-menu-item>
      }
    }
    function getIcon(icon) {
      if (icon) {
        return <svg-icon icon-class={icon}/>
      } else {
        return null
      }
    }
    if (menuData) {
      menuData.forEach(function(val, index, array) {
        if (!val.hidden) {
          if (!val.children) {
            vnodes.push(<el-menu-item index={val.name} key={val.path}><span slot='title'>{val.meta.title}</span></el-menu-item>)
          } else {
            if (val.children.length > 0) {
              vnodes.push(<el-submenu index={val.name} key={val.path}><template slot='title'>{getIcon(val.meta.icon)} <span>{val.meta.title}</span></template>{getTiem(val.children)}</el-submenu>)
            } else {
              vnodes.push(<el-menu-item index={val.name} key={val.path}><span slot='title'>{val.meta.title}</span></el-menu-item>)
            }
          }
        }
      })
    }
    return vnodes
  }
}
</script>
