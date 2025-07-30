// 导入 Vue 的 createApp 函数，用于创建 Vue 应用实例
import { createApp } from 'vue'
// 导入全局样式文件
import './style.css'
// 导入根组件 App
import App from './App.vue'

// 创建 Vue 应用实例，并将其挂载到 DOM 中 id 为 'app' 的元素上
// 这是 Vue 应用的入口点，启动整个应用
createApp(App).mount('#app')
