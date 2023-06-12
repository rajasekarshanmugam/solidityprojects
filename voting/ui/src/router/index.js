import { createRouter, createWebHistory } from 'vue-router'

import voting from '../views/voting.vue'
import votingmonitor from '../views/votingmonitor.vue'
import candidates from '../views/candidates.vue'

const routes = [
	{
		path: '/',
		redirect: { name: 'votingmonitor' },
	},

	{
		path: '/votingmonitor',
		name: 'votingmonitor',
		component: votingmonitor,
	},
	
	{
		path: '/voting',
		name: 'voting',
		component: voting,
	},


	{
		path: '/candidates',
		name: 'candidates',
		component: candidates,
	},
]

const base = import.meta.env.BASE_URL
const history = createWebHistory(base)
const router = createRouter({
	history,
	routes,
})

export default router
