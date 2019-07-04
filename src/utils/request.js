import axios from 'axios'
// import Cookies from 'js-cookie';

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api 的 base_url
    timeout: 5000, // 请求超时时间
    // withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
})

// request拦截器
service.interceptors.request.use(
    async config => {
        // if (store.getters.token) {
        //     config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        // }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器


export default service;
