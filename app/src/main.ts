import { createApp } from 'vue'
import PageComponent from './pages/home.vue' // 默认导入，构建时会被替换

const app = createApp(PageComponent)
app.mount('#app')