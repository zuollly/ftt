import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import app from './modules/app'
import workshop from './modules/workshop'
import permission from './modules/permission'
import workshopPermission from './modules/workshopPermission'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app, user, workshop, permission, workshopPermission
  },
  getters
})

export default store
