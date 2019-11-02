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
        Promise.reject(error)
    }
)

//http response 拦截器
service.interceptors.response.use(res => {
    // if (res.headers && (contentType[res.headers['content-type']])) {
    //   downloadUrl(res);
    //   return;
    // }
    // if(res.data.state ==2){
    //     router.push({
    //       path:"/login",
    //       query:{redirect:router.currentRoute.fullPath}//登陆超时
    //     })
    //   }
    //   if(res.data.state ==3){
    //     router.push({
    //       path:"/error500",
    //     })
    //     Store.save('detail',res.data.detail);
    //   }
      // return res;
      return res.data
    },
    error => {
      return Promise.reject(error)
    }
)

export default service;
