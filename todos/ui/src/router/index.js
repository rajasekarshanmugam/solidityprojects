import { createRouter, createWebHistory } from 'vue-router'

import todos from '../views/todos.vue'

const routes = [
	{
		path: '/',
		redirect: { name: 'todos' },
		component: todos,
	},

	{
		path: '/todos',
		name: 'todos',
		component: todos,
	},
]

const base = import.meta.env.BASE_URL
const history = createWebHistory(base)
const router = createRouter({
	history,
	routes,
})

export default router
