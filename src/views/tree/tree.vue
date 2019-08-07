<template>
    <div>
        点击按钮打开文件上传 
        <img src="./test.png" alt="">
        <br>
        <Button type="warning" @click="toggleOpenUpload(true)">打开全局上传组件</Button>
    </div>
</template>

<script>
// import datajson from './data.js'
export default {
    methods: {
        toggleOpenUpload (flag) {
            this.$store.commit('OPEN_UPLOAD', flag)
        }
    },
}
</script>

<style>

</style>
