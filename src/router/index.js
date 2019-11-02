
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Bigfileupload2 = () => import(/* webpackChunkName:"Bigfileupload2"*/ '@/views/bigfileupload2.vue')

const router = new VueRouter ({
    routes: [
        {path: '/', redirect: '/openupload'},
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
               
                {
                    path: '/svg',
                    component: () => import('@/views/iconfont/svg')
                },


            ]
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