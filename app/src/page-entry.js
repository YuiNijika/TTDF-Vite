import { createApp } from 'vue'

// 这个文件将在构建时被处理，动态导入相应的页面组件
export function createPageApp(component) {
    return createApp(component)
}