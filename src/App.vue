<template>
  <div id="app">
    <router-view></router-view>
    <!-- 将上传组件全局注册 -->
    <global-upload></global-upload>

  </div>
</template>

<script>
import GlobalUpload from '@/components/globalUpload/globalUpload'

export default {
  name: 'app',
  components: {
    GlobalUpload
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
   color: #2c3e50;
 }

</style>
