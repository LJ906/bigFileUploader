<template>
  <div id="app">
    <router-view></router-view>
    <global-upload></global-upload>

  </div>
</template>

<script>
import GlobalUpload from '@/components/globalUpload/globalUpload'

//  import bigfileupload2 from '@/views/bigfileupload2'
export default {
  name: 'app',
  components: {
    // bigfileupload2,
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
