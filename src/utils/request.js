import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/storage/cookies'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}
// create an axios instance
const service = axios.create({
  baseURL: 'http://yx.nercel.cn/msapi/', // api的base_url
  timeout: 30000 // request timeout
})

service.interceptors.request.use(config => {
  if (getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  // config.headers['Authorization'] = 'bearer 8c1e6fb0-c9ee-45bc-8572-9a8584c3b350'
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error)// for debug
    Message({
      message: codeMessage[error.response.status],
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
