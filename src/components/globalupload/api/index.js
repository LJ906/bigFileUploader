import axios from 'axios';

// 配置请求域名   反向代理，参见vue.config.js devServer.proxy
// const baseUrl = process.env.NODE_ENV === 'production' ? '' : '';  
// 创建实例
const instance = axios.create({
    baseURL: process.env.BASE_UPLOAD_API,
    timeout: 20000, 
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
});

// 文件上传 合并请求
 export const mergeFile = data => {
    return instance.request({
        method: 'POST',
        url: '/upload/mergeFile',
        data
    });
};
