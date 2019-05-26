<template>
  <div class="globalupload-wrp" :class="{'collapse': collapse}" v-if="isShowGlobalUploader">
     <div id="global-uploader">
      <!-- 上传 -->
        <!-- @file-success="onFileSuccess" -->
      <uploader
        ref="uploader"
        :started="false"
        :options="options"
        :autoStart="false"
        :file-status-text="statusText"
        @file-added="onFileAdded"
        @file-progress="onFileProgress"
        @file-error="onFileError"
        @file-complete="onFileComplete" 
        class="uploader-app"
      >
        <uploader-unsupport></uploader-unsupport>
        <div class="uploader-title-wrp">
          <uploader-btn :directory="true">选中文件夹</uploader-btn>
          <uploader-btn id="global-uploader-btn uploder-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>
          <div class="operate">
            {{'文件总数： ' + totalFileCount}}
            <Button @click="toggleFullScreen" icon="ios-fullscreen" type="text">{{collapse ? '展开':'折叠'}}</Button>
            <Button @click="close" icon="ios-close" type="text">关闭</Button>
          </div>
        </div>

        <div class="common-config">
          <span class="total-progress-title">上传总进度：</span>
          <Progress :percent="formatPercent(totalProgress)" :stroke-width="5" class="total-progress"/>
          <!-- <span style="width: 50px;">{{currentSpeed}}</span> -->
          <span style="width: 80px;">{{formatedAverageSpeed}}</span> 
          <span style="width: 80px;"> {{totalSize}}</span>
          <div class="total-progress-btn">
            <Button size="small">删除暂停</Button>
            <Button size="small">删除暂停</Button>
            <Button size="small">删除暂停</Button>
            <Button size="small">删除暂停</Button>
          </div>
        </div>

        <uploader-list v-show="panelShow" ref="uploaderList">
          <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
            <div class="file-title">
              <!-- <h2>文件列表</h2> -->
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
import Bus from "./js/bus";
import SparkMD5 from "spark-md5";
import { constants } from 'crypto';
 import util from './js/util'
export default {
  data() {
    return {
      options: {
        target: "//localhost:3000/upload", // 目标上传 URL
        chunkSize: "2048000", //分块大小2m 插件会根据你设置的分块的大小自动计算出 chunkNumber当前第几块 totalChunk 总块数
        fileParameterName: "file", //上传文件时文件的参数名，默认file
        maxChunkRetries: 3, //最大自动失败重试上传次数
        testChunks: true, //是否开启服务器分片校验
        // autoStart: false,
        simultaneousUploads: 3, // 并发上传数，默认 3
        initialPaused: true,
        // 服务器分片校验函数，秒传及断点续传基础
        /**
         * 前端分片检验 当前分片是否已经传过
         * 它会根据 XHR 响应内容检测每个块是否上传成功了，成功的分片直接跳过上传
         * 你要在这个函数中进行处理，可以跳过的情况下返回true即可。
         * @chunk 当前块 
         * @message 后台返回的信息 字段skipUpload: true 表示已经传过了 -> 秒传
         */
        checkChunkUploadedByResponse: function(chunk, message) {
          console.log('message',message)
          let objMessage = {}
          try {
            objMessage = JSON.parse(message) ? JSON.parse(message) : {}
            if (objMessage.skipUpload) {
                return true; // skipUpload 已经传过了则 跳过->返回true
              }
          } catch (e) {
              console.log('e')
          }
            // fake response
            // objMessage.uploaded_chunks = [2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 17, 20, 21]
            // check the chunk is uploaded
            return (objMessage.uploaded_chunks || []).indexOf(chunk.offset + 1) >= 0
          // }
          // let objMessage = JSON.parse(message);
          // if (objMessage.skipUpload) {
          //   return true; // skipUpload 已经传过了则 跳过->返回true
          // }
          // uploaded, [1,2,3...] 已经传过的分片，插件会自动跳过这些
          // 判断当前chunk 是否已经上传过了，
          // 注：skipUpload 和 uploaded 是我和后台商议的字段，你要按照后台实际返回的字段名来。
          // return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0;
        },
        headers: {
          // 在header中添加的验证，请根据实际业务来
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

      myFileList: [],
      sizeUploaded: 0, // 总的上传的文件大小
      totalSize: 0, // 总文件大小 
      totalProgress: 0, // 总上传进度百分比curr
      currentSpeed: ''

    };
  },
  mounted () {
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader.uploader
    })
  },
  computed: {
    //Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    },
    totalFileCount () {
      return this.myFileList.length ? this.myFileList.length : 0;
    },
    formatedAverageSpeed () {
      console.log('计算当前速度', this.currentSpeed)
     let speed =   this.currentSpeed ? this.currentSpeed: 0 
      return `${util.formatSize(speed)} / s`
    },
  },
  methods: {
    // 文件添加进来时能获取file: 名称 文件类型，大小size 相对路径 chunk id
    onFileAdded(file) {
      // console.log("add", file);
      this.panelShow = true;
      this.myFileList = [...file.uploader.fileList]
      console.log('所有文件列表', this.myFileList)
      // 计算MD5
      this.computeMD5(file);
    },

    // 文件进度的回调
    onFileProgress(rootFile, file, chunk) {
      // console.log("progress-file", file);
      // console.log(
      //   `上传中 ${file.name}，chunk：${chunk.startByte /
      //     1024 /
      //     1024} ~ ${chunk.endByte / 1024 / 1024}`
      // );
      this.sizeUploaded = this.uploader.uploader.sizeUploaded();
      this.totalSize = this.uploader.uploader.getFormatSize();
      this.totalProgress = this.uploader.uploader.progress() ;
      this.currentSpeed = this.uploader.uploader.currentSpeed;
      // this.currentSpeed = this.uploader.uploader.gerCurrentSpeed;
      console.log('已传大小', this.sizeUploaded)
      console.log('总大小', this.totalSize)
      console.log('总进度', this.totalProgress)
      console.log('speed', this.currentSpeed)
      console.log('uploader', this.uploader.uploader)
 
    },
    // 上传成功后
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);

      // 服务器自定义的错误，这种错误是Uploader无法拦截的
      if (!res.result) {
        console.log('onsuccess error')
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
        Bus.$emit("fileSuccess", res);
        console.log("上传成功");
      }
    },

    onFileError(rootFile, file, response, chunk) {
      console.log('error');
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
        // this.uploader.opts.query = {
        //     ...this.params
        // }

        console.log(
          `MD5计算完毕：${file.id} ${
            file.name
          } MD5：${md5} 用时：${new Date().getTime() - time} ms`
        );

        file.uniqueIdentifier = md5;
        file.resume(); // 继续上传
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
    removeFile (fileList) {
      console.log('2删除后的list',fileList)
      this.myFileList = fileList
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
  &.collapse {
    right: 15px;
    bottom: 15px;
    width: 520px;
    height: auto;
  }
}

.uploader-title-wrp {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 40px;

  .operate {
    flex: 1;
    text-align: right;
  }
  .uploader-btn {
    margin-right: 20px;
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
      // display: flex;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      // justify-content: space-between;
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
          // text-align: center;
        }
      }
    }
    .file-list {
      position: relative;
      height: 240px;
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

.common-config {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  line-height:40px;
  .total-progress-title {
    min-width: 90px;
  }
  .total-progress {
    flex: 1;
  }
  .total-progress-btn {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    button {
      margin-left: 10px;
    }
  }

}
</style>
