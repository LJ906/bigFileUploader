<template>
  <uploader :options="options" class="uploader-example" ref="uploader">
      <!-- 如果浏览器不支持上传则在此处提示 -->
    <uploader-unsupport></uploader-unsupport>
      <p>文件上传</p>
      <uploader-btn>select files</uploader-btn>
      <uploader-btn :attrs="attrs">select images</uploader-btn>
      <uploader-btn :directory="true">select folder</uploader-btn>
      <!-- 已上传的文件列表 -->
    <uploader-list></uploader-list>
  </uploader>
</template>

<script>
  export default {
    data () {
      return {
        options: {
          // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
          target: '//localhost:3000/upload',
          testChunks: true
        },
        attrs: {
          accept: 'image/*'
        }
      }
    },
    methods: {
        onFileAdded () {
            console.log('add')
        }, 
        onFileSuccess () {
            console.log('success')
        },
        onFileProgress () {
            console.log('onFileProgress')
        },
        onFileError () {
            console.log('onFileError')
        },
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