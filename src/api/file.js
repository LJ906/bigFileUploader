import service from '@/utils/request.js'

// 文件上传 合并请求
export const mergeFile = data => {
    return service.request({
        method: 'POST',
        url: 'a/upload/mergeFile',
        data
    });
};