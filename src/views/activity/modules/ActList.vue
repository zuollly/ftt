<template>
    <div>

    </div>
</template>
<script>
import { getActivityList, deleteActivtiy } from '@/api/activity'
export default {
  data() {
    return {
      totalpage: 0,
      currentPage: 1,
      pagesize: 10,
      activtiyList: [],
      activityShow: false,
      orderList: {},
      userRole: Number,
      dealArry: [],
      groupId: ''
    }
  },
  components: {
    FilterTools: () => import('./FilterTools.vue'),
    ActTable: () => import('./activityTable.vue')
  },
  mounted() {
  },
  computed: {
    btnShow() {
      const arr = this.$store.state.user.
      let role
      for (const item of arr) {
        role = item
      }
      if (role === 0 || role === 1) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.manage-btn {
  float: left;
}
.page-position {
  text-align: center;
  margin-top: 10px;
}
</style>

