import { fetchGroupById } from '@/api/workshop'
const workshop = {
  state: {
    workshopInfo: {}, // 工作坊详情
    workshopUserTotal: 0
  },
  mutations: {
    SET_WORKSHOPINFO: (state, workshopInfo) => {
      state.workshopInfo = workshopInfo
    },
    SET_WORKSHOPUSERTOTAL: (state, workshopUserTotal) => {
      state.workshopUserTotal = workshopUserTotal
    }
  },
  actions: {
    // 获取当前活动的详细信息
    GetWorkshopDetails({ commit }, groupId) {
      return new Promise((resolve, reject) => {
        fetchGroupById(groupId).then(response => {
          console.log(response, 'response')
          const data = response.data
          if (data.code === 200) {
            commit('SET_WORKSHOPINFO', data.result)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
    // 当前工作坊模块数据总数统计
    // GetWorkshopModuleSum({ commit }, groupId) {
    //   return new Promise((resolve, reject) => {
    //     getWorkshopModuleSum(groupId).then(response => {
    //       const data = response.data
    //       if (data.code === 200) {
    //         commit('SET_WORKSHOPUSERTOTAL', data.result.groupUserCount)
    //       }
    //       resolve(data)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}
export default workshop
