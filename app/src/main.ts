import { createApp } from 'vue'
import 'ant-design-vue/dist/reset.css';
import { DatePicker } from 'ant-design-vue';
import PageComponent from './pages/home.vue' // 默认导入，构建时会被替换

const app = createApp(PageComponent)
app.use(DatePicker)
app.mount('#app')