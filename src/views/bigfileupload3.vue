<template>
  <uploader 
  :options="options" 
  :file-status-text="statusText" 
  class="uploader-example" 
  ref="uploader" 
  @file-complete="fileComplete" 
  :autoStart="false"
  @complete="complete"></uploader>
</template>

<script>
  export default {
    data () {
      return {
        options: {
          target: '//localhost:3000/upload', // '//jsonplaceholder.typicode.com/posts/',
          testChunks: true
        },
        attrs: {
          accept: 'image/*'
        },
        statusText: {
          success: "已完成",
          error: "传输失败",
          uploading: "上传中",
          paused: "暂停中",
          waiting: "等待上传"
        }
      }
    },
    methods: {
      complete () {
        console.log('complete', arguments)
      },
      fileComplete () {
        console.log('file complete', arguments)
      }
    },
    mounted () {
      this.$nextTick(() => {
        window.uploader = this.$refs.uploader.uploader
      })
    }
  }
</script>

<style>
  .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
