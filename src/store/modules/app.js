import locals from '@/utils/storage/locals'
const app = {
  state: {
    appConfig: locals.getItem('appConfig'),
    currentRoute: 'workshop',
    browserInfo: '',
    containerName: '',
    isMobile: ''
  },
  mutations: {
    SET_APPCONFIG: (state, param) => {
      locals.setItem('appConfig', param)
      state.appConfig = locals.getItem('appConfig')
    },
    SET_CURRENTROUTE: (state, currentRoute) => {
      state.currentRoute = currentRoute
    },
    SET_BROWSERINFO: (state, browserInfo) => {
      state.browserInfo = browserInfo
    },
    SET_CONTAINERNAME: (state, containerName) => {
      state.containerName = containerName
    },
    SET_ISMOBILE: (state, isMobile) => {
      state.isMobile = isMobile
    }
  },
  actions: {
    SetAppConfig({ commit }, param) {
      commit('SET_APPCONFIG', param)
    },
    SetCurrentRoute({ commit }, currentRoute) {
      commit('SET_CURRENTROUTE', currentRoute)
    },
    SetBrowserInfo({ commit }, browserInfo) {
      commit('SET_BROWSERINFO', browserInfo)
    },
    SetContainerName({ commit }, containerName) {
      commit('SET_CONTAINERNAME', containerName)
    },
    SetIsMobile({ commit }, isMobile) {
      commit('SET_ISMOBILE', isMobile)
    }
  }
}

export default app
