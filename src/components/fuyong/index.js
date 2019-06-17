import Fuyong from './fuyong.vue'

const fuyong = {
    install,
    Fuyong
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install)
}

function install (Vue) {
    if (install.installed) {
        return
    }
    Vue.component('Fuyong', Fuyong)
}

export default fuyong
