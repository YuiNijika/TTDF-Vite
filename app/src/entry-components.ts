import 'ant-design-vue/dist/reset.css';

import home from './components/home.vue'
import post from './components/post.vue'

// 挂载所有组件的函数
export function mountAllComponents() {
  const homeElements = document.querySelectorAll('[data-component="home"]');
  homeElements.forEach(el => {
    const homeApp = createApp(home);
    homeApp.mount(el);
  });
  const postElements = document.querySelectorAll('[data-component="post"]');
  postElements.forEach(el => {
    const postApp = createApp(post);
    postApp.mount(el);
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
