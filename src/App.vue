<script setup>
// 导入Vue 3的组合式API函数
import { ref, reactive, onMounted, watch } from 'vue';
// 导入自定义组件
import FilterBar from './components/FilterBar.vue';  // 筛选栏组件
import DataTable from './components/DataTable.vue';  // 数据表格组件
import PaginationBar from './components/PaginationBar.vue';  // 分页栏组件
import DailyBackground from './components/DailyBackground.vue';  // 每日背景组件

// 筛选条件 - 使用reactive创建响应式对象
const filters = reactive({
  search: '',          // 搜索关键词
  startDate: null,     // 开始日期
  endDate: null,       // 结束日期
  websiteCategory: '', // 网站分类
  timeFormat: 'default' // 时间格式
});

// 分页参数 - 使用reactive创建响应式对象
const pagination = reactive({
  currentPage: 1,  // 当前页码
  pageSize: 10     // 每页显示条数
});

// 总数据条数 - 使用ref创建响应式变量
const totalItems = ref(0);

// 处理筛选条件变化函数
// 接收新的筛选条件参数，更新filters对象，并重置页码到第一页
const handleFilterChange = (newFilters) => {
  Object.assign(filters, newFilters);  // 将新筛选条件合并到当前filters对象
  // 筛选条件变化时重置到第一页
  pagination.currentPage = 1;
};

// 处理页码变化函数
// 更新当前页码为用户选择的页码
const handlePageChange = (page) => {
  pagination.currentPage = page;
};

// 处理每页显示条数变化函数
// 更新每页显示条数，并重置页码到第一页
const handlePageSizeChange = (size) => {
  pagination.pageSize = size;
  // 每页显示条数变化时重置到第一页
  pagination.currentPage = 1;
};

// 处理删除项目函数
// 删除单个项目后，检查当前页是否还有数据，如果没有则返回上一页
const handleDeleteItem = () => {
  // 删除操作后，如果当前页没有数据了，则返回上一页
  if (pagination.currentPage > 1 &&
    (pagination.currentPage - 1) * pagination.pageSize >= totalItems.value - 1) {
    pagination.currentPage--;
  }
};

// 处理批量删除函数
// 批量删除项目后，检查当前页是否还有数据，如果没有则返回上一页
const handleBatchDelete = () => {
  // 批量删除操作后，如果当前页没有数据了，则返回上一页
  if (pagination.currentPage > 1 &&
    (pagination.currentPage - 1) * pagination.pageSize >= totalItems.value - 1) {
    pagination.currentPage--;
  }
};

// 更新总数据条数函数
// 接收数据总条数，更新totalItems响应式变量
const updateTotalItems = (count) => {
  totalItems.value = count;
};

// 组件挂载时执行初始化操作
// 使用Vue的onMounted生命周期钩子
onMounted(() => {
  // 这里可以添加初始化数据加载逻辑
  console.log('应用已启动');
});
</script>

<template>
  <!-- 背景组件单独放置，不包裹内容 -->
  <DailyBackground />

  <!-- 内容区域独立于背景组件 -->
  <div class="app-content">
    <div class="container">
      <!-- 页面头部区域 -->
      <header class="header">
        <h1>网站浏览数据管理系统</h1>
      </header>

      <!-- 页面主体内容区域 -->
      <main class="card">
        <!-- 筛选栏组件 -->
        <!-- 监听filter-change事件，当筛选条件变化时调用handleFilterChange方法 -->
        <!-- 监听batch-delete事件，当批量删除时调用handleBatchDelete方法 -->
        <FilterBar @filter-change="handleFilterChange" @batch-delete="handleBatchDelete" />

        <!-- 数据表格组件 -->
        <!-- 传入filters和pagination作为props -->
        <!-- 监听delete-item事件，当删除单个项目时调用handleDeleteItem方法 -->
        <!-- 监听delete-items事件，当批量删除时调用handleBatchDelete方法 -->
        <!-- 监听total-items-change事件，当总数据条数变化时调用updateTotalItems方法 -->
        <DataTable :filters="filters" :pagination="pagination" @delete-item="handleDeleteItem"
          @delete-items="handleBatchDelete" @total-items-change="updateTotalItems" />

        <!-- 分页栏组件 -->
        <!-- 传入totalItems、pageSize和currentPage作为props -->
        <!-- 监听page-change事件，当页码变化时调用handlePageChange方法 -->
        <!-- 监听page-size-change事件，当每页显示条数变化时调用handlePageSizeChange方法 -->
        <PaginationBar :total-items="totalItems" :page-size="pagination.pageSize" :current-page="pagination.currentPage"
          @page-change="handlePageChange" @page-size-change="handlePageSizeChange" />
      </main>

      <!-- 页面底部区域 -->
      <footer class="footer">
        <p>© 2024 网站浏览数据管理系统</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 应用内容区域样式 */
.app-content {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
}

/* 移除所有重复的样式，使用全局CSS变量 */
/* scoped属性表示这些样式只应用于当前组件，不会影响其他组件 */
</style>