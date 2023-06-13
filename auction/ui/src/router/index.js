import { createRouter, createWebHistory } from 'vue-router'

import auctions from '../views/auctions.vue'
import myauctions from '../views/myauctions.vue'

const routes = [
	{
		path: '/',
		redirect: { name: 'myauctions' },
	},

	{
		path: '/myauctions',
		name: 'myauctions',
		component: myauctions,
	},
	{
		path: '/auctions',
		name: 'auctions',
		component: auctions,
	},
]

const base = import.meta.env.BASE_URL
const history = createWebHistory(base)
const router = createRouter({
	history,
	routes,
})

export default router
