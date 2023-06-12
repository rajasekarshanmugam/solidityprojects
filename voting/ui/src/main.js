import "bootstrap/dist/css/bootstrap.min.css"

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from '@/router';

import "bootstrap/dist/js/bootstrap.js"
import BootstrapIcon from '@dvuckovic/vue3-bootstrap-icons';

createApp(App)
	.use(createPinia())
	.use(router)
	.component('BootstrapIcon', BootstrapIcon)
	.mount('#app')
