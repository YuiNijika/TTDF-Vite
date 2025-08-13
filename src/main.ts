import { createApp } from 'vue'
import 'ant-design-vue/dist/reset.css';
import { DatePicker } from 'ant-design-vue';

// 自动导入 components 目录下的所有 vue 组件
const modules = import.meta.glob('./components/*.vue');

// 创建组件映射
const componentMap: Record<string, () => Promise<any>> = {};

// 构建组件映射关系
Object.keys(modules).forEach((key) => {
    // 从文件路径提取组件名
    const componentName = key.match(/\/([^/]+)\.vue$/)?.[1];
    if (componentName) {
        componentMap[componentName] = modules[key];
    }
});

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