<script setup>
import { ref, onMounted } from 'vue';

// 背景图片URL
const bgImageUrl = ref('');
// 加载状态
const isLoading = ref(true);
// 错误状态
const error = ref(null);

// 获取必应每日图片
const fetchBingDailyImage = async () => {
  try {
    isLoading.value = true;
    // 使用CORS代理来避免跨域问题
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const apiUrl = encodeURIComponent('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');

    const response = await fetch(proxyUrl + apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Bing daily image');
    }

    const data = await response.json();
    const content = JSON.parse(data.contents);
    // 构建完整的图片URL
    const imageUrl = `https://www.bing.com${content.images[0].url}`;
    bgImageUrl.value = imageUrl;
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching Bing daily image:', err);
    // 如果获取失败，使用备用图片
    bgImageUrl.value = 'https://picsum.photos/seed/dailybackground/1920/1080.jpg';
  } finally {
    isLoading.value = false;
  }
};

// 组件挂载时获取图片
onMounted(() => {
  fetchBingDailyImage();

  // 每天凌晨0点更新背景图片
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    fetchBingDailyImage();
    // 之后每24小时更新一次
    setInterval(fetchBingDailyImage, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
});
</script>

<template>
  <div class="background-container">
    <!-- 背景图片 -->
    <div 
      v-if="!isLoading && !error" 
      class="background-image"
      :style="{ backgroundImage: `url(${bgImageUrl})` }"
    ></div>

    <!-- 默认背景 -->
    <div 
      v-if="isLoading || error" 
      class="background-default"
    ></div>

    <!-- 内容插槽 -->
    <div class="background-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.4) blur(2px);
  transition: all 1s ease-in-out;
}

.background-default {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
}

.background-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>