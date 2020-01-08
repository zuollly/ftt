<script>
import { getToken } from '@/utils/storage/cookies'
import store from '@/store'
export default {
  name: 'TokenLogin',
  created() {
    // 判断是否是变更用户
    var isToken = (getToken() !== '' && getToken() !== this.$route.params.token)
    if (this.$route.params.token) {
      const token = this.$route.params.token
      store.dispatch('GetUserInfo', token).then((res) => {
        if (res.data.code !== 200) {
          this.$message({
            message: '请使用正确的用户认证码(token)', type: 'warning'
          })
        } else {
          if (isToken) {
            this.$message({
              message: '更换登录用户成功', type: 'success'
            })
          }
        }
        if (this.$route.query.redirect) {
          this.$router.push(decodeURIComponent(this.$route.query.redirect || '/'))
        } else {
          this.$router.push('/')
        }
      })
    } else {
      if (this.$route.query.redirect) {
        this.$router.push(decodeURIComponent(this.$route.query.redirect || '/'))
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>
