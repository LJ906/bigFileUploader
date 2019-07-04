<template>
  <div id="app">
    <router-view></router-view>
    <!-- <bigfileupload2></bigfileupload2> -->
  </div>
</template>

<script>
 import bigfileupload2 from '@/views/bigfileupload2'
export default {
  name: 'app',
  components: {
    bigfileupload2
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
