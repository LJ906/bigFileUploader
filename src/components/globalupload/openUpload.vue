<template>
    <div >
        <Button type="primary" @click="openUploader(true)">打开文件上传</Button>
    </div>
</template>

<script>
import Bus from '@/utils/bus'
export default {
    mounted() {
        // 文件选择后的回调
        Bus.$on('fileAdded', () => {
            console.log('文件已选择')
        });
        // 文件上传成功的回调
        Bus.$on('fileSuccess', () => {
            console.log('文件上传成功')
        });

        Bus.$on ('onGlobalUploadComplete', (fileList) => {
            console.log('监听到所有文件上传完了', fileList)
        })
    },
    methods: {
        openUploader (flag) {
            // 打开文件选择框
            Bus.$emit('openUploader', {
                id: '1111'  // 传入的参数
            })

            // this.$store.commit ('OPEN_UPLOAD', flag)
        }
    },
    destroyed() {
        Bus.$off('fileAdded');
        Bus.$off('fileSuccess');
        Bus.$off('onGlobalUploadComplete')
    },
}

</script>

<style>

</style>
