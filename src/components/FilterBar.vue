<!-- FilterBar (筛选栏组件)​ -->
<!-- 该组件提供数据筛选功能，包括搜索、日期范围筛选、网站类目选择和时间格式选择 -->
<script setup>
// 导入Vue 3的组合式API函数
import { ref, reactive, onMounted, computed } from 'vue';

// 定义组件可以触发的事件
// filter-change: 当筛选条件变化时触发，传递新的筛选条件
// batch-delete: 当点击批量删除按钮时触发
const emit = defineEmits(['filter-change', 'batch-delete']);

// 筛选条件 - 使用reactive创建响应式对象
const filters = reactive({
  search: '',          // 搜索关键词，用于搜索域名或网站名称
  startDate: null,     // 开始日期，用于筛选数据的起始日期
  endDate: null,       // 结束日期，用于筛选数据的结束日期
  websiteCategory: '', // 网站分类，用于按类目筛选数据
  timeFormat: 'default' // 时间格式，控制浏览时长的显示方式
});

// 网站类目选项数组
const websiteCategories = ['未分类', 'Video', 'Tech', 'Info'];

// 时间格式选项数组
// 包含值和对应的显示标签
const timeFormatOptions = [
  { value: 'default', label: '默认时间格式' },
  { value: 'seconds', label: '按秒显示' },
  { value: 'minutes', label: '按分钟显示' },
  { value: 'hours', label: '按小时显示' }
];

// 组件挂载时执行的初始化操作
// 设置默认日期为包含数据的日期范围
onMounted(() => {
  // 格式化日期为YYYY-MM-DD格式，这是HTML date输入框需要的格式
  const formatDate = (date) => {
    const year = date.getFullYear();          // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0');  // 获取月份，补零到两位
    const day = String(date.getDate()).padStart(2, '0');         // 获取日期，补零到两位
    return `${year}-${month}-${day}`;         // 返回格式化后的日期字符串
  };

  // 设置开始日期为今天（实时更新）
  filters.startDate = formatDate(new Date());
  // 设置结束日期为今天（实时更新）
  filters.endDate = formatDate(new Date());
  // 应用初始筛选条件
  applyFilters();
});

// 应用筛选条件函数
// 将当前筛选条件发送给父组件
const applyFilters = () => {
  // 使用展开运算符创建filters对象的副本，避免引用问题
  emit('filter-change', { ...filters });
};

// 清除网站类目选择函数
// 重置网站类目筛选条件并应用新的筛选条件
const clearCategory = () => {
  filters.websiteCategory = '';  // 清空网站类目
  applyFilters();                // 应用更新后的筛选条件
};

// 触发批量删除函数
// 通知父组件执行批量删除操作
const triggerBatchDelete = () => {
  emit('batch-delete');
};
</script>

<template>
  <!-- 筛选栏容器，使用flex布局，包含多个筛选控件 -->
  <div class="filter-bar">
    <!-- 搜索框筛选项 -->
    <div class="filter-item">
      <!-- 文本输入框，绑定到filters.search，输入时触发applyFilters -->
      <input type="text" v-model="filters.search" placeholder="搜索域名或网站名称" @input="applyFilters"
        class="input search-input" />
    </div>

    <!-- 日期筛选项 -->
    <div class="filter-item date-filter">
      <!-- 开始日期选择框，绑定到filters.startDate，变化时触发applyFilters -->
      <input type="date" v-model="filters.startDate" @change="applyFilters" class="input date-input" />
      <!-- 日期范围分隔符 -->
      <span class="date-separator">至</span>
      <!-- 结束日期选择框，绑定到filters.endDate，变化时触发applyFilters -->
      <input type="date" v-model="filters.endDate" @change="applyFilters" class="input date-input" />
    </div>

    <!-- 网站类目选择项 -->
    <div class="filter-item category-filter">
      <!-- 类目选择容器，根据是否有值添加has-value类 -->
      <div class="category-select" :class="{ 'has-value': filters.websiteCategory }">
        <!-- 下拉选择框，绑定到filters.websiteCategory，变化时触发applyFilters -->
        <select v-model="filters.websiteCategory" @change="applyFilters" class="select">
          <!-- 默认选项，值为空字符串 -->
          <option value="">网站类目</option>
          <!-- 遍历网站类目数组，生成选项 -->
          <option v-for="category in websiteCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <!-- 清除按钮，当有选择值时显示，点击调用clearCategory方法 -->
        <button v-if="filters.websiteCategory" @click="clearCategory" class="clear-button">
          ×
        </button>
      </div>
    </div>

    <!-- 浏览时长格式选择项 -->
    <div class="filter-item">
      <!-- 时间格式下拉选择框，绑定到filters.timeFormat，变化时触发applyFilters -->
      <select v-model="filters.timeFormat" @change="applyFilters" class="select time-format-select">
        <!-- 遍历时间格式选项数组，生成选项 -->
        <option v-for="option in timeFormatOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- 批量删除按钮项 -->
    <div class="filter-item delete-button-container">
      <!-- 批量删除按钮，点击时调用triggerBatchDelete方法 -->
      <button @click="triggerBatchDelete" class="btn btn-danger btn-medium">
        批量删除
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 筛选栏容器样式 */
.filter-bar {
  display: flex;
  /* 使用flex布局 */
  align-items: center;
  /* 垂直居中对齐 */
  padding: var(--spacing-md);
  /* 内边距使用CSS变量 */
  background-color: var(--bg-secondary);
  /* 背景色使用CSS变量 */
  border-radius: var(--border-radius-medium);
  /* 圆角使用CSS变量 */
  margin-bottom: var(--spacing-lg);
  /* 下边距使用CSS变量 */
  flex-wrap: wrap;
  /* 允许项目换行 */
  gap: var(--spacing-md);
  /* 项目间距使用CSS变量 */
}

/* 筛选项通用样式 */
.filter-item {
  margin-bottom: var(--spacing-sm);
  /* 下边距使用CSS变量 */
}

/* 搜索输入框样式 */
.search-input {
  width: 200px;
  /* 设置固定宽度 */
}

/* 日期筛选容器样式 */
.date-filter {
  display: flex;
  /* 使用flex布局 */
  align-items: center;
  /* 垂直居中对齐 */
  gap: var(--spacing-sm);
  /* 子元素间距使用CSS变量 */
}

/* 日期分隔符样式 */
.date-separator {
  color: var(--text-secondary);
  /* 文字颜色使用CSS变量 */
}

/* 类目选择容器样式 */
.category-select {
  position: relative;
  /* 相对定位，用于内部绝对定位元素 */
  width: 150px;
  /* 设置固定宽度 */
}

/* 类目选择下拉框样式 */
.category-select select {
  width: 100%;
  /* 宽度填满容器 */
  appearance: none;
  /* 移除默认样式 */
  background-color: var(--bg-secondary);
  /* 背景色使用CSS变量 */
}

/* 有值时的类目选择下拉框样式 */
.category-select.has-value select {
  padding-right: 30px;
  /* 右侧增加内边距，为清除按钮留出空间 */
}

/* 清除按钮样式 */
.clear-button {
  position: absolute;
  /* 绝对定位 */
  right: 8px;
  /* 距右侧8px */
  top: 50%;
  /* 距顶部50% */
  transform: translateY(-50%);
  /* 向上平移50%，实现垂直居中 */
  background: none;
  /* 无背景 */
  border: none;
  /* 无边框 */
  font-size: var(--font-size-md);
  /* 字体大小使用CSS变量 */
  cursor: pointer;
  /* 鼠标指针为手型 */
  color: var(--text-muted);
  /* 文字颜色使用CSS变量 */
  padding: 0;
  /* 无内边距 */
  width: 20px;
  /* 设置宽度 */
  height: 20px;
  /* 设置高度 */
  display: flex;
  /* 使用flex布局 */
  align-items: center;
  /* 垂直居中对齐 */
  justify-content: center;
  /* 水平居中对齐 */
}

/* 清除按钮悬停样式 */
.clear-button:hover {
  color: var(--text-secondary);
  /* 悬停时文字颜色使用CSS变量 */
}

/* 时间格式选择下拉框样式 */
.time-format-select {
  width: 150px;
  /* 设置固定宽度 */
}

/* 删除按钮容器样式 */
.delete-button-container {
  margin-left: auto;
  /* 左边距自动，将按钮推到最右边 */
  margin-right: 0;
  /* 右边距为0 */
}

/* 响应式样式：屏幕宽度小于768px时应用 */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    /* 改为垂直布局 */
    align-items: stretch;
    /* 子元素拉伸填满宽度 */
  }

  .filter-item {
    margin-right: 0;
    /* 移除右边距 */
    width: 100%;
    /* 宽度填满容器 */
  }

  .delete-button-container {
    margin-left: 0;
    /* 移除左边距 */
    text-align: right;
    /* 文本右对齐 */
  }
}
</style>