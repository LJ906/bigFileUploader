<template>
    <div>
        <Button type="primary" @click="openUploader(true)">打开文件上传</Button>
    </div>
</template>

<script>
export default {
    methods: {
        openUploader (flag) {
            this.$store.commit ('OPEN_UPLOAD', flag)
        }
    }
}
</script>

<style>

</style>
