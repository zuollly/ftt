import { fetchWorkshopRolePage } from '@/api/user'
const workshopPermission = {
  state: {
    workshopPermissionInfo: {}
  },
  mutations: {
    SET_WORKSHOPPERMISSIONINFO: (state, workshopPermissionInfo) => {
      state.workshopPermissionInfo = workshopPermissionInfo
    }
  },
  actions: {
    // 获取当前活动的详细信息
    GetWorkshopPermission({ commit }, data) {
      return new Promise((resolve, reject) => {
        fetchWorkshopRolePage(data).then(response => {
          console.log(response, 'response-1')
          if (response.data.code === 200) {
            commit('SET_WORKSHOPPERMISSIONINFO', response.data.result)
          }
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default workshopPermission
