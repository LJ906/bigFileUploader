
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const UploadFile = () => import('@/views/uploadFile')

const Bigfileupload = () => import(/* webpackChunkName:"Bigfileupload"*/ '@/views/bigfileupload.vue')
const Bigfileupload2 = () => import(/* webpackChunkName:"Bigfileupload2"*/ '@/views/bigfileupload2.vue')
const Bigfileupload3 = () => import(/* webpackChunkName:"Bigfileupload3"*/ '@/views/bigfileupload3.vue')
// const GlobalUpload = () => import('@/components/globalupload/index')
// const GlobalUpload = () => import('@/components/globalupload/index')

const router = new VueRouter ({
    routes: [
        {path: '/', redirect: '/home'},
        {
            path: '/home',
            component: () => import('@/views/home'),
            children: [
                {
                    path: '',
                    component: ()=>import('@/views/tree/tree')
                     
                },

                {
                    path: '/bigfileupload2',
                    component: Bigfileupload2
                     
                },
                {
                    path: '/openupload', // 打开全局上传组件
                    // component: ()=>import('@/views/tree/tree')
                    component: () => import('@/components/globalUpload/openUpload')
                },
                {
                    path: '/chinamap',
                    component: () => import('@/views/chinaMap/index')
                },
                {
                    path: '/map2',
                    component: () => import('@/views/chinaMap/map2')
                },
                {
                    path: '/npmbag',
                    component: () => import('@/views/npmbag/index')
                },
                {
                    path: '/searchbar',
                    component: () => import('@/views/searchBar')
                },


            ]
        },
        {
            path: '/fileupload',
            component: UploadFile
        },
        // {
        //     path: '/globalupload',
        //     component: GlobalUpload
        // },
        {
            path: '/bigfileupload',
            component: Bigfileupload
        },
        // {
        //     path: '/bigfileupload2',
        //     component: Bigfileupload2
        // },
        {
            path: '/bigfileupload3',
            component: Bigfileupload3
        },
        {
            path: '/lineChart',
            component: () => import('@/views/Charts/lineChart')
        },
        {
            path: '/columnChart',
            component: () => import('@/views/Charts/columnChart')
        },
    ]
})

export default router