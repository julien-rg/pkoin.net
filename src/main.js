import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

import PrimeVue from 'primevue/config'

import ToastService from 'primevue/toastservice'
import VueClipboard from 'vue-clipboard2'
import Tooltip from 'primevue/tooltip'
import '@/assets/styles/main.sass'

Vue.use(PrimeVue)
Vue.use(ToastService)
Vue.use(VueClipboard)
Vue.use(Tooltip)

import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/saga-blue/theme.css'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
