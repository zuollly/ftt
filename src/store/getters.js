const getters = {
  appConfig: state => state.app.appConfig,
  currentRoute: state => state.app.currentRoute,
  browserInfo: state => state.app.browserInfo,
  containerName: state => state.app.containerName,
  isMobile: state => state.app.isMobile,
  // user
  uuid: state => state.user.uuid, // 登录用户ID
  userCode: state => state.user.userCode, // 登录用户code
  userID: state => state.user.userID, // 登录用户帐户ID
  token: state => state.user.token, // 登录用户登录Token
  userAvatar: state => state.user.userAvatar, // 登录用户头像
  userName: state => state.user.userName, // 登录用户昵称
  userIntroduction: state => state.user.introduction, // 登录用户简介
  userStatus: state => state.user.userStatus, // 登录用户状态
  userRoles: state => state.user.userRoles, // 登录用户角色
  userRolePower: state => state.user.userRolePower,
  userSetting: state => state.user.setting, // 登录用户个人的一设置，权限，等
  workshopInfo: state => state.workshop.workshopInfo,
  workshopBehaviour: state => state.workshop.workshopBehaviour, // 当前工作坊统计信息
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters // 0-坊主 1-副坊主  2-参与人员  3-申请人员  4-报名未通过人员  5-没有参与工作坊的成员
}

export default getters
