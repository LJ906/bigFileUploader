<template>
    <div @click="clickMessage">fuyong
        这是父组件传过来的值：{{message}}
    </div>
</template>

<script>
export default {
    props:{
        message: String
    }, 
    methods: {
        clickMessage () {
            console.log('message', this.message)
            this.$emit('click', this.message)
        }
    },
}
</script>

<style>

</style>
