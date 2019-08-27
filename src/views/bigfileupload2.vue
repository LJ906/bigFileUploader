<template>
    <div id="global-uploader" 
        class="globalupload-wrp" 
        :class="{'collapse': collapse, 'boder-e': collapse}" 
        v-if="isOpenUpload"
    >
        <!-- 上传 -->
        <uploader
            :autoStart="false"
            ref="uploader"
            :started="false"
            :options="options"
            :file-status-text="statusText"
            @file-added="onFileAdded"
            @file-progress="onFileProgress"
            @file-error="onFileError"
            @file-success="onFileSuccess"
            @file-complete="onFileComplete" 
            class="uploader-app">
            <uploader-unsupport></uploader-unsupport>

            <div :class="{'padding10': collapse}">
                <!-- 上传按钮 -->
                <div class="uploader-title-wrp" @dblclick="collapse = !collapse">
                    <!-- <uploader-btn :directory="true" v-if="!collapse">选文件夹</uploader-btn> -->
                    <template v-if="collapse">
                        <uploader-btn id="global-uploader-btn uploder-btn" :attrs="attrs" ref="uploadBtn" >+ 选择文件</uploader-btn>
                        <Button size="small" @click="hanldeAllPaused" class="operBtn" type="warning">全部暂停</Button>
                        <Button size="small" @click="hanldeAllUpload" class="operBtn" type="primary">全部开始</Button>
                        <Button size="small" @click="handleAllDelete" class="operBtn" type="error">全部删除</Button>
                    </template>

                    <!-- 全屏 -->
                    <div class="operate">
                        <Button size="small" @click="toggleFullScreen" :icon="collapse ? 'md-expand' : 'md-contract'" type="text"></Button>
                        <Button size="small" @click="close" icon="md-close" type="text"></Button>
                    </div>
                </div>
                <!-- 进度条 -->
                <div class="common-config-process">
                    <!-- 进度条 -->
                    <!-- <span class="config-progress-title">上传总进度：</span>
                    <Progress :percent="formatPercent(totalProgress)" :stroke-width="5" class="total-progress"/>
                    <span style="width: 100px; margin-right: 10px">{{formatedAverageSpeed}}</span>  -->

                    <!-- <span style="width: 60px; margin-right: 10px"> {{totalSize}}</span> -->
                    <div class="oper-btn" v-show="!collapse">
                        <uploader-btn id="global-uploader-btn uploder-btn" :attrs="attrs" ref="uploadBtn" >+ 选择文件</uploader-btn>

                        <Button size="small" @click="hanldeAllPaused" class="operBtn" type="warning">全部暂停</Button>
                        <Button size="small" @click="hanldeAllUpload" class="operBtn" type="primary">全部开始</Button>
                        <Button size="small" @click="handleAllDelete" class="operBtn" type="error">全部删除</Button>
                    </div>
                </div>

                <div class="common-config-count" v-show="!collapse">
                    <span class="oper-btn-right">
                        共有 <span class="font-blue">{{totalFileCount}}</span>  个上传任务 
                    </span>
                </div>
            </div>
            <uploader-list v-show="panelShow" ref="uploaderList" class="panelShow">
                <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                    <div class="file-title">
                        <h4>文件名</h4>
                        <h4>状态</h4>
                        <h4>操作</h4>
                    </div>
                    <ul class="file-list">
                    <li v-for="file in props.fileList" :key="file.id">
                        <uploader-file
                            :class="'file_' + file.id"
                            ref="files"
                            :file="file"
                            :list="true"
                            :togglePausedAllStatus=" (flag) => {needActionCheck = flag}"

                            :needActionCheck="needActionCheck"
                            :isShowFilePosition="isShowFilePosition"
                            :handleShowFilePosition="handleShowFilePosition"
                        >
                        </uploader-file>
                    </li>
                    <div class="no-file" v-if="!props.fileList.length">
                        <i class="nucfont inuc-empty-file"></i> 暂无待上传文件
                    </div>
                    </ul>
                </div>
            </uploader-list>
        </uploader>
    </div>
</template>

<script>
import { ACCEPT_CONFIG } from "./js/config";
import SparkMD5 from "spark-md5";
import util from './js/util';
import { mergeFile } from '@/api';
import $ from "jquery";
export default {
    data() {
        return {
            options: {
                target: "/upload/chunk", // 目标上传 URL
                // target: "//localhost:3000/upload", 
                chunkSize: 2* 1024 * 1024, //分块大小0.5M 
                fileParameterName: "file", //上传文件时文件的参数名，默认file
                maxChunkRetries: 1, //最大自动失败重试上传次数
                testChunks: true, //测试每个块是否在服务端已经上传了，主要用来实现秒传、跨浏览器上传等，默认true
                simultaneousUploads: 3, 
                checkChunkUploadedByResponse: function(chunk, message) {
                    let objMessage = JSON.parse(message) ? JSON.parse(message) : {};
                    if (objMessage.skipUpload) {
                        return true;
                    }
                    return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
                },

                headers: {
                // Authorization: "Bearer " //+ Ticket.get().access_token
                },
                allowDuplicateUploads: true
            },
            attrs: {
                accept: ACCEPT_CONFIG.getAll()
            },
            statusText: {
                success: "已完成",
                error: "传输失败",
                uploading: "上传中",
                paused: "暂停中",
                waiting: "等待上传"
            },
            // 自定义字段
            panelShow: true, //选择文件后，展示上传panel
            collapse: true, // 默认折叠状态
            isShowFilePosition: true, // 是否显示文件夹位置的一列 alse 不显示
            myFileList: [], // 上传的所有文件列表
            totalProgress: 0, // 总上传进度百分比，未格式化成小数
            currentSpeed: 0, // 当前上传速度，未格式化 
            needActionCheck: false, // 全部暂停 传给组件重置 _actionCheck
            // isOpenUpload: true, // 待定， 正式时删除
        };
    },
    computed: {
        uploader() {
            return this.$refs.uploader.uploader;
        },
        totalFileCount () {
            return this.myFileList.length ? this.myFileList.length : 0;
        },
        // 格式化上传速度
        formatedAverageSpeed () {
            let speed = this.currentSpeed ? this.currentSpeed: 0;
            return `${util.formatSize(speed)} / s`
        },
        // 文件总大小 
        totalSize () {
            let size =  this.myFileList.reduce((cal, ele) => {
                            cal += ele.size;
                            return cal
                        }, 0)
            return util.formatSize(size)
        },
        // 文件上传页面显示隐藏 从store 中获取
        isOpenUpload () {
            return this.$store.state.isOpenUpload;
        }
         
    },
    methods: {
        onFileAdded(file) {
            this.panelShow = true;
            this.myFileList = this.uploader.fileList;
            this.computeMD52(file);
        },
        // 文件过程中
        onFileProgress(rootFile, file, chunk) {
            this.totalProgress = this.uploader.progress(); 
            this.currentSpeed = this.uploader.currentSpeed; // 当前速度 未格式化上面格式
        },
        
        /**
         * 上传成功后
         * @rootFile {Object}  文件夹上传时返回的跟目录
         * @file {Object}      上传成功的文件对象
         * @response {Object}  成功时后台返回的对象
         * @chunk {Object}     最后一个chunk 吧
         */
        async onFileSuccess(rootFile, file, response, chunk) {
            let res = JSON.parse(response) || {}
            let dataInfo = {
                ...file,
                filename: file.name,
                identifier: file.uniqueIdentifier,
                totalSize: file.size,
                id: file.id,
                type: file.fileType, 
            }
        
            // 如果服务端返回需要合并
            if (res.needMerge){
                 this.statusSet(file.id, 'merging');
                try {
                    const mergeRes = await mergeFile(dataInfo);
                    if (mergeRes.data.msg == '合并成功') {
                        this.statusRemove(file.id);
                    } else {
                        this.statusSet(file.id, 'mergefailed');
                    }
                } catch (error) {
                    this.statusSet(file.id, 'mergefailed');
                }
            }  
        },
        // 失败后
        onFileError(rootFile, file, response, chunk) {
            this.toggleProcess = 0
            console.log('onFileError');
        },

        /**
         * 计算md5，实现断点续传及秒传
         * 断点续传及秒传的基础是要计算文件的MD5，这是文件的唯一标识，然后服务器根据MD5进行判断，是进行秒传还是断点续传。
         * 在file-added事件之后，就计算MD5，我们最终的目的是将计算出来的MD5加到参数里传给后台，然后继续文件上传的操作
         * @param file 文件对象 file.file 文件流
         */
        computeMD5(file) {
            let fileReader = new FileReader();
            let time = new Date().getTime();
            let md5 = "";
            file.pause(); // 暂停上传

            fileReader.readAsArrayBuffer(file.file); // 读取文件对象，把文件转成md5，
            fileReader.onload = e => {
                if (file.size != e.target.result.byteLength) {
                    this.$Notice.warning({
                        title: '正在上传中',
                        duration: 2, // 秒
                        desc: "Browser reported success but could not read the file until the end."
                    })
                    return;
                }
                
                md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
                console.log(`MD5计算完毕：${file.name} \nMD5：${md5}  大小:${file.size} 用时：${new Date().getTime() - time} ms`);

                // 添加额外的参数
                this.uploader.opts.query = {
                    ...this.params
                }

                file.uniqueIdentifier = md5;
            };
                file.resume(); // 继续上传
            // 可能会出错， 因为大文件会消耗内存消耗
            fileReader.onerror = function() {
                this.$Notice.warning({
                    name: 'notice',
                    title: '文件读取失败',
                    duration: 3, // 秒
                    desc:"FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
                })
            };
        },
        // 修改md5 start
        computeMD52(file) {
            let fileReader = new FileReader();
            let time = new Date().getTime();
            let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
            let currentChunk = 0;
            const chunkSize = 10 * 1024 * 1000;
            let chunks = Math.ceil(file.size / chunkSize);
            let spark = new SparkMD5.ArrayBuffer();
            // 文件状态设为"计算MD5"
            this.statusSet(file.id, 'md5');
            file.pause();
            loadNext();
            fileReader.onload = (e => {
                spark.append(e.target.result);
                if (currentChunk < chunks) {
                    currentChunk++;
                    loadNext();
                    // 实时展示MD5的计算进度
                    this.$nextTick(() => {
                        console.log(((currentChunk/chunks)*100).toFixed(0)+'%')
                        $(`.myStatus_${file.id}`).text('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
                    })
                } else {
                    let md5 = spark.end();
                    this.computeMD5Success(md5, file);
                    console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
                }
            });
            fileReader.onerror = function () {
                // this.error(`文件${file.name}读取出错，请检查该文件`)
                file.cancel();
            };
            function loadNext() {
                let start = currentChunk * chunkSize;
                let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
            }
        },
        computeMD5Success(md5, file) {
            // 将自定义参数直接加载uploader实例的opts上
            Object.assign(this.uploader.opts, {
                query: {
                    ...this.params,
                }
            })
            file.uniqueIdentifier = md5;
            file.resume();
            this.statusRemove(file.id);
        },
        /**
         * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
         * @param id
         * @param status
         */
        statusSet(id, status) {
            let statusMap = {
                md5: {
                    text: '校验MD5',
                    bgc: '#fff'
                },
                merging: {
                    text: '合并中',
                    bgc: '#e2eeff'
                },
                transcoding: {
                    text: '转码中',
                    bgc: '#e2eeff'
                },
                failed: {
                    text: '上传失败',
                    bgc: '#e2eeff'
                }
            }
            this.$nextTick(() => {
                $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status>span`).css({
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'right': '0',
                    'bottom': '0',
                    'zIndex': '1',
                    'backgroundColor': statusMap[status].bgc
                }).text(statusMap[status].text);
            })
        },
        statusRemove(id) {
            this.$nextTick(() => {
                $(`.myStatus_${id}`).remove();
            })
        },

        // 切换全屏
        toggleFullScreen() {
            this.collapse = !this.collapse;
        },
        // 最小化 关闭
        close() {
            this.uploader.cancel();
            this.$store.commit('OPEN_UPLOAD', false)
        },
        
        /**
         * 小数转成百分比
         * @decimalNum 是小数的
         */
        formatPercent (decimalNum) {
            return parseInt(decimalNum * 100);
        },
        // 全部暂停  
        hanldeAllPaused() {
            this.uploader.pause();
            this.needActionCheck = true
        },
        // 全部开始
        hanldeAllUpload() {
            this.uploader.resume(); 
            this.needActionCheck = true;
        },
        //  全部删除功能
        handleAllDelete () {
            this.uploader.cancel(); // 取消上传并上传所有文件
            this.currentSpeed = 0;  // this.uploader.currentSpeed 删除时不是0
            this.totalProgress = this.uploader.progress() ; // 0
            this.myFileList = this.uploader.fileList ;// []
        },
        // 根据文件位置打开文件夹  待定
        handleShowFilePosition (relativePath) {
            try{ 
                var obj=new ActiveXObject("wscript.shell"); 
                if(obj){ 
                    obj.run("explorer.exe "+relativePath);
                    // obj.Run("\""+filename+"\"", 1, false );
                    obj=null; 
                } 
            }catch(e){ 
                alert("请确定是否存在该盘符或文件"); 
            } 
        }
    }
};
</script>

<style scoped lang="scss">
.uploader-title-wrp {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 40px;
    cursor: pointer;
    .operate {
        flex: 1;
        text-align: right;
        button {
            margin-left: 10px;
        }
    }
    .uploader-btn {
        margin-right: 10px;
    }
    .operBtn {
        margin-right: 10px;
        cursor: pointer;
    }
}

#global-uploader {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    &.collapse {
        right: 15px;
        bottom: 15px;
        width: 520px;
        height: auto;       
        padding: 0px;
        border: 1px solid #e2e2e2;
    }
    .padding10 {
        padding: 10px;
    }
    .uploader-app {
        width: 100%;
    }
    .file-panel {
        background-color: #fff;
        border: 1px solid #e2e2e2;
        border-radius: 7px 7px 0 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        .file-title {
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ddd;
            h4 {
                float: left;
                padding: 0 15px;
                &:first-child {
                    width: 40%;
                }
                &:nth-child(2) {
                    width: 35%;
                }
                &:last-child {
                    width: 25%;
                }
            }
        }
        .file-list {
            position: relative;
            // height: 400px;
            min-height: 440px;
            overflow-x: hidden;
            overflow-y: auto;
            background-color: #fff;
            > li {
                background-color: #fff;
            }
        }
        &.collapse {
            .file-title {
                background-color: #e7ecf2;
            }
            .file-list {
                height: 400px;
            }
        }
    }
    .no-file {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
    }
    /deep/.uploader-file-icon {
        &:before {
            content: "" !important;
        }
        &[icon="image"] {
            background: url(./images/image-icon.png);
        }
        &[icon="video"] {
            background: url(./images/video-icon.png);
        }
        &[icon="document"] {
            background: url(./images/text-icon.png);
        }
    }

    /deep/.uploader-file-actions {
        display: flex;
        padding: 0 10px;
    }
    .uploader-file-status {
        padding-left: 10px;
    }
   
    /deep/.uploader-file-actions > span {
        margin-left: 10px;
    } 
}

.common-config-process {
    display: flex;
    align-items: center;
    width: 100%;
    // height: 40px;
    .config-progress-title {
        min-width: 90px;
    }
    .total-progress {
        flex: 1;
    }
    .oper-btn {
        text-align: right;
        display: flex;
        min-width: 80px;
        margin-left: 20px;
        justify-content: flex-end;
        button {
            margin: 0 10px;
        }
    }

}

.common-config-count {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    .oper-btn-right {
        flex: 1;
        text-align: right;
        color: #777;
    }
    .oper-btn-left {
        flex: 1;
        text-align: left;
    }
}

.font-blue {
    color: #2d8cf0;
}

.font-red {
    color: #ed4014;
}
.font-yellow {
    color: #f90;
}
.boder-e {
    border-radius: 10px;
}
</style>
