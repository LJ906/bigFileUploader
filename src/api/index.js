import axios from 'axios';
// import qs from 'qs';    // 参见node qs模块，如不需要可删除

// 配置请求域名   反向代理，参见vue.config.js devServer.proxy
// 测试环境
const baseUrl = process.env.NODE_ENV === 'production' ? '' : ''; // 测试环境线上域名http://risk.secoolocal.com
 
// 创建实例
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 20000, // 超时时间，单位毫秒    可选，默认60s
    headers: { // 默认可不设，如单一接口需修改参数类型，请在方法内部修改
        'Content-Type': 'application/json; charset=UTF-8'
    }
});

// 领券明细查询--查询列表数据
export const upload = query => {
    return instance.request({
        method: 'GET',
        url: '/upload',
       query
    });
};

export const mergeFile = data => {
    return instance.request({
        method: 'POST',
        url: '/upload/mergeFile',
        data
    });
};
