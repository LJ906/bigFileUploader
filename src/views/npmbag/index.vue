
<template>
    
    <div> 测试内部文字

        git包 - 组件hello:
        <hello :message="message" @clickMessage="clickMessage"></hello>
        <hr>
        gitbao - 组件 bag1:
        <bag1 :message="message" @clickMessage="clickMessage"></bag1>
        <hr>
        <!-- <npminstallgit :message="message"  ></npminstallgit> -->
        本地包：
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
            alert(msg)
            // console.log('message', msg)
        }
    },
    components: {
        // Hello: npmGit.Hello
        // Hello: npminstallgit.Hello
    }
}
</script>

<style>

</style>
