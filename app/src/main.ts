import { createApp } from 'vue'
import 'ant-design-vue/dist/reset.css';
import { DatePicker } from 'ant-design-vue';

// 创建组件映射
const componentMap = {
  // 在构建过程中，这些导入将被实际的组件替换
  // 'home': () => import('./components/home.vue'),
  // 可以添加更多组件
};

const app = createApp({})

app.use(DatePicker)

// 修改挂载逻辑，查找组件内的目标元素
const mountApp = () => {
    const componentElements = document.querySelectorAll('[data-component]')
    
    componentElements.forEach(el => {
        const componentName = el.getAttribute('data-component');
        if (componentName && componentMap[componentName]) {
            componentMap[componentName]().then(module => {
                const component = module.default || module;
                createApp(component).mount(el);
            });
        }
    });
}

// DOM 加载完成后挂载
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountApp)
    } else {
        mountApp()
    }
}

export { app }