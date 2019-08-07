
<template>
    
    <div> 测试内部文字

        npm-git包 - 组件puPlan:
        <putPlan></putPlan>
        <br>
        <br>


        git包 - 组件hello:
        <hello :message="message" @clickMessage="clickMessage" style="color: red"></hello>
        <br>
        <br>

       <span>===========</span>
        gitbao - 组件 bag1:
        <bag1 :message="message" @clickMessage="clickMessage"></bag1>
        <br>
        <br>
        <span>=========</span>
        <!-- <npminstallgit :message="message"  ></npminstallgit> -->
        本地包：
        <!-- <fuyong :message="message" @click="clickMessage"></fuyong> -->

    </div>
</template>

<script>


export default {
    data () {
        return {
            message: 'hello world npmgit'
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
