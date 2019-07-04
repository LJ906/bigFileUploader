import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    isOpenUpload: false, // 上传空间的打开true，关闭false
}

const mutations = {
    OPEN_UPLOAD (state, flag) {
        state.isOpenUpload = flag
    }
}

const actions = {

}

const Store = new Vuex.Store({
    state, 
    actions, 
    mutations
})

export default Store