import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Exchange',
		component: () => import('@/views/ExchangeFormPage.vue')
	},
	{
		path: '/payment',
		name: 'Payment',
		component: () => import('@/views/PaymentPage.vue')
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
