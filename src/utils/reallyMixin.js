// 字典表请求方法拿出来, 为了尽可能的少侵入原组件, 将字典分为几类, 按需引入即可
/**
 * 学段学科  省市区  毕业院校专业学历 民族政治面貌 性别职业
 */
import { fetchDictInfo } from '@/api/dict'
const dict = {
  subject: 'SUBJECT', // 学科
  studyPhase: 'GRADE-STAGE' // 学段
}
console.log(dict)
// axios
const dictory = (params) => {
  return new Promise((resolve, reject) => {
    fetchDictInfo(params).then(res => {
      if (res.data.code === 200) {
        const arr = []
        res.data.result.forEach(element => {
          arr.push({ label: element.dictValue, value: element.dictKey })
        })
        resolve(arr)
      } else {
        reject(new Error('获取失败'))
      }
    })
  })
}
const studyPhase = { // 学段学科年级 学历学校
  methods: {
    phase() {
      return this.dictory({ groupCode: dict.studyPhase })
    },
    subject() {
      return this.dictory({ groupCode: dict.subject })
    },
    dictory
  }
}
export { studyPhase }
