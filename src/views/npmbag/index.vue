
<template>
    
    <div> 测试内部文字
        <hello :message="message" @clickMessage="clickMessage"></hello>
        <!-- <npminstallgit :message="message"  ></npminstallgit> -->
        <fuyong :message="message" @click="clickMessage"></fuyong>
    </div>
</template>

<script>


export default {
    data () {
        return {
            message: 'hello world'
        }
    }, 
    methods: {
        clickMessage (msg) {
            console.log('message', msg)
        }
    },
    components: {
        // Hello: npminstallgit.Hello
    }
}
</script>

<style>

</style>
