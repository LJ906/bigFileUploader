
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const UploadFile = () => import('@/views/uploadFile')

const Bigfileupload = () => import('@/views/bigfileupload.vue')
const Bigfileupload2 = () => import('@/views/bigfileupload2.vue')
const Bigfileupload3 = () => import('@/views/bigfileupload3.vue')
const GlobalUpload = () => import('@/components/globalupload/index')

const router = new VueRouter ({
    routes: [
        {
            path: '/home',
            component: () => import('@/views/home'),
            children: [
                {
                    path: '/bigfileupload2',
                    component: Bigfileupload2
                     
                },
                {
                    path: '/tree',
                    component: ()=>import('@/views/tree/tree')
                },
                {
                    path: '/chinamap',
                    component: () => import('@/views/chinaMap/index')
                },
                // {
                //     path: '/npmbag',
                //     component: () => import('@/views/npmbag/index')
                // },

            ]
        },
        {
            path: '/fileupload',
            component: UploadFile
        },
        {
            path: '/globalupload',
            component: GlobalUpload
        },
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