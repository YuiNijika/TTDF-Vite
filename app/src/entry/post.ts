import { createApp } from 'vue'
import Component from '../components/post.vue'
import 'ant-design-vue/dist/reset.css';

const app = createApp(Component)

// 挂载到组件内的第一个元素而不是 #app
const mountComponent = () => {
  const componentElements = document.querySelectorAll('[data-component="post"]')
  componentElements.forEach((el, index) => {
    // 为每个实例创建独立的app实例
    if (index === 0) {
      // 第一个实例使用原始app
      createApp(Component).mount(el)
    } else {
      // 其他实例创建新的app实例
      createApp(Component).mount(el)
    }
  })
}

// 如果在浏览器环境中，立即挂载
if (typeof window !== 'undefined') {
  // 使用 MutationObserver 确保 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountComponent)
  } else {
    mountComponent()
  }
}

// 也导出以便在需要时手动挂载
export { app }
