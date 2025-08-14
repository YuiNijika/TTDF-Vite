import 'ant-design-vue/dist/reset.css';

import Antdv from '../components/Antdv.vue'
import Daisyui from '../components/Daisyui.vue'

// 挂载所有组件的函数
export function mountAllComponents() {
  const AntdvElements = document.querySelectorAll('[data-component="Antdv"]');
  AntdvElements.forEach(el => {
    const AntdvApp = createApp(Antdv);
    AntdvApp.mount(el);
  });
  const DaisyuiElements = document.querySelectorAll('[data-component="Daisyui"]');
  DaisyuiElements.forEach(el => {
    const DaisyuiApp = createApp(Daisyui);
    DaisyuiApp.mount(el);
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
