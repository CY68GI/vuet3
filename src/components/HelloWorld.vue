<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">计数是 {{ count }}</button>
    <p>
      编辑
      <code>components/HelloWorld.vue</code> 来测试热更新
    </p>
  </div>

  <p>
    查看
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >，官方的 Vue + Vite 启动器
  </p>
  <p>
    在
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue 文档扩展指南</a
    >中了解更多关于 Vue IDE 支持的信息。
  </p>
  <p class="read-the-docs">点击 Vite 和 Vue 标志了解更多信息</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
