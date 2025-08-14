import { createApp } from 'vue'
import App from './app.vue' 
import 'ant-design-vue/dist/reset.css';
import { DatePicker } from 'ant-design-vue';

// 自动导入 components 目录下的所有 vue 组件
const modules = import.meta.glob('./components/*.vue');

// 创建组件映射
const componentMap: Record<string, () => Promise<any>> = {};

// 构建组件映射关系
Object.keys(modules).forEach((key) => {
    const componentName = key.match(/\/([^/]+)\.vue$/)?.[1];
    if (componentName) {
        componentMap[componentName] = modules[key];
    }
});

// 检查是否在开发模式下运行
const isDevMode = import.meta.env.DEV;

let app;

if (isDevMode) {
    // 开发模式下使用 App.vue 作为根组件
    app = createApp(App)
    app.use(DatePicker)
    app.mount('#app')
} else {
    // 生产模式下保持原有逻辑
    app = createApp({})
    app.use(DatePicker)

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

    if (typeof window !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', mountApp)
        } else {
            mountApp()
        }
    }
}

export { app }