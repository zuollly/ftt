import { loginByUsername, fetchUserInfo } from '@/api/login'
import { fetchUserRolePower } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/storage/cookies'

const user = {
  state: {
    uuid: '', // ID
    userID: '', // 登录ID
    userStatus: '', // 状态
    userCode: '', // ID
    token: getToken(),
    userName: '', // 昵称
    userAvatar: '', // 头像
    introduction: '', // 介绍
    userRoles: [], // 角色
    userRolePower: '',
    setting: { // 权限相关
      articlePlatform: []
    }
  },
  mutations: {
    SET_UUID: (state, uuid) => {
      state.uuid = uuid
    },
    SET_USERID: (state, userID) => {
      state.userID = userID
    },
    SET_USERCODE: (state, userCode) => {
      state.userCode = userCode
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_USERSTATUS: (state, userStatus) => {
      state.userStatus = userStatus
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_USERAVATAR: (state, userAvatar) => {
      state.userAvatar = userAvatar
    },
    SET_USERROLES: (state, userRoles) => {
      state.userRoles = userRoles
    },
    SET_USERROLEPOWER: (state, userRolePower) => {
      state.userRolePower = userRolePower
    }
  },
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const data = {
        username: userInfo.username.trim(),
        password: userInfo.password
      }
      return new Promise((resolve, reject) => {
        loginByUsername(data).then(response => {
          const data = response.data
          commit('SET_USERID', userInfo.username)
          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        fetchUserInfo().then(response => {
          if (response.data.code !== 200) {
            reject(response)
          }
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            // reject('error')
          }
          const data = response.data.result
          commit('SET_UUID', data.userId)
          commit('SET_USERID', data.username)
          // commit('SET_CODE', data.code)
          commit('SET_USERROLES', data.roles)
          commit('SET_USERNAME', data.realname)
          commit('SET_USERAVATAR', data.avatar)
          commit('SET_USERSTATUS', data.status)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getUserRolePower({ commit, state }, userId) {
      if (state.userRolePower !== 'admin') {
        return new Promise((resolve, reject) => {
          fetchUserRolePower({ userId: userId }).then(response => {
            commit('SET_USERROLEPOWER', response.data.result)
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        })
      }
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_UUID', '')
        commit('SET_USERROLES', [])
        removeToken()
        resolve()
      })
    }
  }
}

export default user
