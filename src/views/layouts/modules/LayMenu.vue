<template>
  <nav-menu mode="horizontal" :menuData="menuData"></nav-menu>
</template>
<script>
import NavMenu from './menu/NavMenu'
export default {
  name: 'LayMenu',
  components: { NavMenu },
  props: {
    menuData: {
      type: Array
    }
  }
}
</script>
