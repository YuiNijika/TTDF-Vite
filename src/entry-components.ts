import 'ant-design-vue/dist/reset.css';

import WelCome from './components/WelCome.vue'

// 挂载所有组件的函数
export function mountAllComponents() {
  const WelComeElements = document.querySelectorAll('[data-component="WelCome"]');
  WelComeElements.forEach(el => {
    const WelComeApp = createApp(WelCome);
    WelComeApp.mount(el);
  });
}

import { createApp } from 'vue';

// 如果在浏览器环境中，立即挂载所有组件
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAllComponents);
  } else {
    mountAllComponents();
  }
}
