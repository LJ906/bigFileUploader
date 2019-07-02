<template>
    <div 
        class="globalupload-wrp" 
        :class="{'collapse': collapse, 'boder-e': collapse}" 
        v-if="isShowGlobalUploader">
        <div id="global-uploader">
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

                <div class="uploader-title-wrp" @dblclick="collapse = !collapse">
                    <uploader-btn :directory="true">选文件夹</uploader-btn>
                    <uploader-btn id="global-uploader-btn uploder-btn" :attrs="attrs" ref="uploadBtn">选文件</uploader-btn>
                    <template v-if="collapse">
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
                    <span class="config-progress-title">上传总进度：</span>
                    <Progress :percent="formatPercent(totalProgress)" :stroke-width="5" class="total-progress"/>
                    <span style="width: 100px; margin-right: 10px">{{formatedAverageSpeed}}</span> 
                    <!-- <span style="width: 60px; margin-right: 10px"> {{totalSize}}</span> -->
                    <div class="oper-btn" v-show="!collapse">
                        <Button size="small" @click="hanldeAllPaused" class="operBtn" type="warning">全部暂停</Button>
                        <Button size="small" @click="hanldeAllUpload" class="operBtn" type="primary">全部开始</Button>
                        <Button size="small" @click="handleAllDelete" class="operBtn" type="error">全部删除</Button>
                    </div>
                </div>

                <div class="common-config-count" v-show="!collapse">
                    <span class="oper-btn-left">
                    <!-- 共有 <span class="font-blue">{{totalFileCount}}</span>  个上传任务  -->
                    </span>
                    <span class="oper-btn-right">
                    共有 <span class="font-blue">{{totalFileCount}}</span>  个上传任务 
                    </span>
                </div>

                <uploader-list v-show="panelShow" ref="uploaderList">
                    <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                        <div class="file-title">
                            <h4>文件名</h4>
                            <h4>状态</h4>
                            <h4>操作</h4>
                        </div>
                        <ul class="file-list">
                        <li v-for="file in props.fileList" :key="file.id">
                            <uploader-file
                            style="flex: 1"
                            :class="'file_' + file.id"
                            ref="files"
                            :file="file"
                            :list="true"
                            @removeFile="removeFile"
                            :isShowFilePosition="true"
                            :handleShowFilePosition="handleShowFilePosition"
                            @onStatusChange="onStatusChange"
                            >
                            </uploader-file>
                            <!-- <div style="width: 10%">文件位置</div> -->
                        </li>
                        <div class="no-file" v-if="!props.fileList.length">
                            <i class="nucfont inuc-empty-file"></i> 暂无待上传文件
                        </div>
                        </ul>
                    </div>
                </uploader-list>
            </uploader>
        </div>
    </div>
</template>

<script>
import { ACCEPT_CONFIG } from "./js/config";
// import Bus from "./js/bus";
import SparkMD5 from "spark-md5";
import util from './js/util';

export default {
  data() {
    return {
        options: {
            target: "//localhost:3000/upload", // 目标上传 URL
            // chunkSize: 1 * 1024 * 1024, //分块大小1m 插件会根据你设置的分块的大小自动计算出 chunkNumber当前第几块 totalChunk 总块数
            chunkSize: 2 * 1024, //分块大小2kb 
            fileParameterName: "file", //上传文件时文件的参数名，默认file
            maxChunkRetries: 1, //最大自动失败重试上传次数
            testChunks: true, //是否开启服务器分片校验
            simultaneousUploads: 3, // 并发上传数，默认 3
            initialPaused: false,
            /**
             * 服务器分片校验函数，秒传及断点续传基础
             * 前端分片检验 当前分片是否已经传过
             * 它会根据 XHR 响应内容检测每个块是否上传成功了，成功的分片直接跳过上传
             * 你要在这个函数中进行处理，可以跳过的情况下返回true即可。
             * @chunk 所有分片都会调用此方法， 索引offset 0, 1, 2, 3...
             * @message 后台返回的信息 字段skipUpload: true 表示已经传过了 -> 秒传, false
             * @return true 秒传 跳过， false 上传  
             */
            checkChunkUploadedByResponse: function(chunk, message) {
                message = JSON.stringify({
                    uploaded: [],
                    // uploaded: [1,2,3,4, 5, 6,7]  
                })
                console.log('分片校验-chunk:', chunk)
                let objMessage = JSON.parse(message) ? JSON.parse(message) : {};
                if (objMessage.skipUpload) {
                    return true;
                }

                // uploaded, [1,2,3...] 已经传过的分片, 第几个分片，插件会自动跳过这些
                // 注：skipUpload 和 uploaded 是我和后台商议的字段，你要按照后台实际返回的字段名来。
                console.log(('分片校验结果：', objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0)
                return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
            },
            // 在header中添加的验证，请根据实际业务来
            headers: {
            // Authorization: "Bearer " //+ Ticket.get().access_token
            },
            allowDuplicateUploads: true
        },
        attrs: {
            // 接受的文件类型，形如['.png', '.jpg', '.jpeg', '.gif', '.bmp'...] 这里我封装了一下
            accept: ACCEPT_CONFIG.getAll()
        },
        statusText: {
            success: "已完成",
            error: "传输失败",
            uploading: "上传中",
            paused: "暂停中",
            waiting: "等待上传"
        },
        panelShow: true, //选择文件后，展示上传panel
        collapse: false,
        isShowGlobalUploader: true,
        isShowFilePosition: true, // 是否显示文件夹位置的一列

        myFileList: [], // 上传的所有文件列表
        totalProgress: 0, // 总上传进度百分比，未格式化成小数
        currentSpeed: 0, // 当前上传速度，未格式化 
        sizeUploaded: 0, // 总的上传的文件大小 -好像没用

        successCount: 0, // 已传成功的文件个数
        errorCount: 0,

        };
    },
    mounted () {
    
    },
    computed: {
        //Uploader实例
        uploader() {
            return this.$refs.uploader.uploader;
        },
        // 文件总个数
        totalFileCount () {
            return this.myFileList.length ? this.myFileList.length : 0;
        },
        // 格式化上传速度
        formatedAverageSpeed () {
            let speed = this.currentSpeed ? this.currentSpeed: 0 
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
    },
  watch:{
 
  },
  methods: {
    // 文件添加进来时能获取file: 名称 文件类型，大小size 相对路径 chunk id
    onFileAdded(file) {
        this.panelShow = true;
        this.myFileList = this.uploader.fileList;
        // 计算MD5
        this.computeMD5(file);
    },

    // 文件进度的回调
    onFileProgress(rootFile, file, chunk) {
        this.totalProgress = this.uploader.progress() ; 
        this.currentSpeed = this.uploader.currentSpeed; // 当前速度 未格式化上面格式
        this.sizeUploaded = this.uploader.sizeUploaded(); // 已上传的size 没用
        console.log('上传中chunck', chunk)
    },
    // 上传成功后
    onFileSuccess(rootFile, file, response, chunk) {
        console.log('onFileSuccess调用', rootFile, file, response, chunk);
        // response 成功后返回的 这里返回done
        // let res = JSON.parse(response);
        let res = response;
        res = {
            code: 200,
            result: 'done', 
            needMerge: false
        }
        // 服务器自定义的错误，这种错误是Uploader无法拦截的
        if (!res.result) {
            // console.log('onsuccess error')
            // this.$message({ message: res.message, type: "error" }); // 待定 element-ui 转成iview
            return;
        }

        // 如果服务端返回需要合并
        if (res.needMerge) {
            // api
            //   .mergeSimpleUpload({
            //     tempName: res.tempName,
            //     fileName: file.name,
            //     ...this.params
            //   })
            //   .then(data => {
            //     // 文件合并成功
            //     Bus.$emit("fileSuccess", data);
            //   })
            //   .catch(e => {});
            // 不需要合并
        } else {
            // Bus.$emit("fileSuccess", res);
            console.log("上传成功");
        }
    },

    onFileError(rootFile, file, response, chunk) {
      console.log('error', rootFile, file, response, chunk);
    },

    /**
     * 计算md5，实现断点续传及秒传
     *
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
        // 判断文件是否上传完成 file.size和读取结果的result.byteLength是否相等
        if (file.size != e.target.result.byteLength) {
          this.error(
            "Browser reported success but could not read the file until the end."
          ); // 未读取完成
          return;
        }
        // 读取完成后 结果加密 转成MD5
        md5 = SparkMD5.ArrayBuffer.hash(e.target.result);

        // 添加额外的参数
        this.uploader.opts.query = {
            ...this.params
        }

        console.log(
          `MD5计算完毕：${file.id} ${
            file.name
          } MD5：${md5} 用时：${new Date().getTime() - time} ms`
        );

        file.uniqueIdentifier = md5;
        // file.resume(); // 继续上传
      };
      // 可能会出错， 因为大文件会消耗内存消耗
      fileReader.onerror = function() {
        this.error(
          "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
        );
      };
    },

    toggleFullScreen() {
      this.collapse = !this.collapse;
    },
    // 最小化
    close() {
      this.uploader.cancel();
      this.panelShow = false;
      this.isShowGlobalUploader = false
    },
    error(msg) {
      this.$notify({
        title: this.$t("c.false"),
        message: msg,
        type: "error",
        duration: 2000
      });
    },
    // 可以删除
    removeFile (fileList) {
      console.log('删除单个文件后的list',this.myFileList);
      // this.myFileList = fileList
    },
    onFileComplete () {
      console.log('complete参数', arguments)
    },
    /**
     * 小数转成百分比
     * @decimalNum 是小数的
     */
    formatPercent (decimalNum) {
      return parseInt(decimalNum * 100);
    },
    
    // 全部暂停 待定有问题=======
    hanldeAllPaused() {
      console.log('点击全部暂停按钮');
      this.uploader.pause(); // 可以暂停但是 单个文件中的按钮没有改变
    },
    // 待定
    hanldeAllUpload() {
      console.log('全部开始上传 uploader', this.uploader);
      this.uploader.resume(); 
      // this.uploader.fileList.forEach(file => {
      //   console.log('单个文件上传')
      //     file.resume();
      // });
 
    },
    //  全部删除功能 完成
    handleAllDelete () {
      this.uploader.cancel(); // 取消上传并上传所有文件
      // 清空
      this.currentSpeed = 0; // this.uploader.currentSpeed 删除时不是0
      this.totalProgress = this.uploader.progress() ; // 0
      this.myFileList = this.uploader.fileList // []
      console.log('全部删除')
    },
    // 根据文件位置打开文件夹 没有盘符只有文件名字， 怎么实现？？
    handleShowFilePosition (relativePath) {
      console.log('relativePath', relativePath)
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
    },
    // 测试用 后续删除
    onStatusChange (status, callback) {
    //   console.log('status' ,status, "===方法", callback)
      callback && callback();
    }


  }
};
</script>
 
<style scoped lang="scss">
.globalupload-wrp {
    position: fixed;
    z-index: 20;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    &.collapse {
        right: 15px;
        bottom: 15px;
        width: 526px;
        height: auto;
        padding: 10px;
    }
}

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
    }
}

#global-uploader {
  width: 100%;
  &.collapse {
    right: 15px;
    bottom: 15px;
    width: 520px;
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
      min-height: 240px;
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
  /**
  /deep/.uploader-file-actions > span {
    margin-left: 10px;
  } */
}
/* 隐藏上传按钮 */
/* #global-uploader-btn {
  // position: absolute;
  // clip: rect(0, 0, 0, 0);
} */

.common-config-process {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
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
  height: 20px;
  // padding: 0 10px;
  .oper-btn-right {
    flex: 1;
    text-align: right;
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
    border: 1px solid #eee;
    border-radius: 5px;
}
</style>
