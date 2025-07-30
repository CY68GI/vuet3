<!-- 
  PaginationBar (分页组件)
  用于在大量数据分页显示时提供导航功能
  包含数据信息显示、每页显示条数选择、页码导航和跳转功能
-->
<script setup>
// 导入Vue的ref、computed和watch函数
import { ref, computed, watch } from 'vue';

// 定义组件接收的props属性
const props = defineProps({
    // 总数据条数，必需属性
    totalItems: {
        type: Number,
        required: true
    },
    // 每页显示条数，默认为10
    pageSize: {
        type: Number,
        default: 10
    },
    // 当前页码，默认为1
    currentPage: {
        type: Number,
        default: 1
    }
});

// 定义组件可以触发的事件
const emit = defineEmits(['page-change', 'page-size-change']);  // 页码变化和每页显示条数变化事件

// 每页显示条数选项数组
const pageSizeOptions = [
    { value: 10, label: '10条/页' },
    { value: 20, label: '20条/页' },
    { value: 50, label: '50条/页' }
];

// 跳转页码输入框的值，使用ref实现响应式
const goToPageInput = ref('');

// 计算总页数的计算属性
const totalPages = computed(() => {
    // 使用Math.ceil向上取整计算总页数
    return Math.ceil(props.totalItems / props.pageSize);
});

// 计算当前页显示的数据范围
const dataRange = computed(() => {
    // 计算当前页显示的起始条目
    const start = (props.currentPage - 1) * props.pageSize + 1;
    // 计算当前页显示的结束条目，不超过总条目数
    const end = Math.min(props.currentPage * props.pageSize, props.totalItems);
    return { start, end };
});

// 计算可见的页码按钮，用于智能显示页码
const visiblePageNumbers = computed(() => {
    const pages = [];
    const total = totalPages.value;  // 总页数
    const current = props.currentPage;  // 当前页

    // 总页数小于等于7，全部显示
    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        // 当前页在中间部分，显示当前页附近的页码
        if (current > 3 && current < total - 2) {
            for (let i = current - 2; i <= current + 2; i++) {
                pages.push(i);
            }
        } else {
            // 当前页在开头部分，显示前5页
            if (current <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
            }
            // 当前页在结尾部分，显示最后5页
            else {
                for (let i = total - 4; i <= total; i++) {
                    pages.push(i);
                }
            }
        }
    }

    return pages;
});

// 处理每页显示条数变化函数
const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);  // 获取新的每页显示条数
    // 如果当前页码超过了新的总页数，则调整到最后一页
    if (props.currentPage > Math.ceil(props.totalItems / newPageSize)) {
        emit('page-change', Math.ceil(props.totalItems / newPageSize));
    }
    // 触发每页显示条数变化事件
    emit('page-size-change', newPageSize);
};

// 处理页码变化函数
const handlePageChange = (page) => {
    // 确保页码在有效范围内
    if (page < 1) page = 1;
    if (page > totalPages.value) page = totalPages.value;

    // 如果页码发生变化，则触发页码变化事件
    if (page !== props.currentPage) {
        emit('page-change', page);
    }
};

// 处理上一页函数
const goToPreviousPage = () => {
    handlePageChange(props.currentPage - 1);  // 调用页码变化函数，传入当前页-1
};

// 处理下一页函数
const goToNextPage = () => {
    handlePageChange(props.currentPage + 1);  // 调用页码变化函数，传入当前页+1
};

// 处理首页函数
const goToFirstPage = () => {
    handlePageChange(1);  // 调用页码变化函数，传入1
};

// 处理末页函数
const goToLastPage = () => {
    handlePageChange(totalPages.value);  // 调用页码变化函数，传入总页数
};

// 处理跳转页码函数
const handleGoToPage = () => {
    const page = parseInt(goToPageInput.value);  // 获取输入框的值并转换为整数
    if (!isNaN(page)) {  // 如果是有效数字
        handlePageChange(page);  // 调用页码变化函数
        goToPageInput.value = ''; // 清空输入框
    }
};

// 处理回车键跳转函数
const handleKeyPress = (event) => {
    if (event.key === 'Enter') {  // 如果按下的是回车键
        handleGoToPage();  // 调用跳转页码函数
    }
};

// 监听总条数变化，重置当前页
watch(() => props.totalItems, () => {
    // 如果当前页码超过了总页数，则调整到最后一页
    if (props.currentPage > totalPages.value) {
        emit('page-change', totalPages.value);
    }
});
</script>

<template>
    <!-- 分页组件容器 -->
    <div class="pagination-bar">
        <!-- 数据信息显示区域 -->
        <div class="data-info">
            显示 {{ dataRange.start }}-{{ dataRange.end }} 条，共 {{ totalItems }} 条
        </div>

        <!-- 每页显示条数选择区域 -->
        <div class="page-size-selector">
            <label for="page-size">每页显示：</label>
            <!-- 下拉选择框，绑定每页显示条数和变化事件 -->
            <select id="page-size" :value="pageSize" @change="handlePageSizeChange" class="select page-size-select">
                <!-- 遍历每页显示条数选项 -->
                <option v-for="option in pageSizeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <!-- 分页导航按钮区域 -->
        <div class="pagination-nav">
            <!-- 首页按钮 -->
            <button class="btn btn-default btn-small" @click="goToFirstPage" :disabled="currentPage === 1">
                首页
            </button>

            <!-- 上一页按钮 -->
            <button class="btn btn-default btn-small" @click="goToPreviousPage" :disabled="currentPage === 1">
                上一页
            </button>

            <!-- 页码按钮容器 -->
            <div class="page-numbers">
                <!-- 第一页按钮，当总页数大于7且当前页大于4时显示 -->
                <button v-if="totalPages > 7 && currentPage > 4" class="btn btn-default btn-small"
                    @click="handlePageChange(1)">
                    1
                </button>

                <!-- 省略号，当总页数大于7且当前页大于4时显示 -->
                <span v-if="totalPages > 7 && currentPage > 4" class="ellipsis">...</span>

                <!-- 当前页附近的页码按钮 -->
                <button v-for="page in visiblePageNumbers" :key="page" class="btn btn-small"
                    :class="page === currentPage ? 'btn-primary' : 'btn-default'" @click="handlePageChange(page)">
                    {{ page }}
                </button>

                <!-- 省略号，当总页数大于7且当前页小于总页数-3时显示 -->
                <span v-if="totalPages > 7 && currentPage < totalPages - 3" class="ellipsis">...</span>

                <!-- 最后一页按钮，当总页数大于7且当前页小于总页数-3时显示 -->
                <button v-if="totalPages > 7 && currentPage < totalPages - 3" class="btn btn-default btn-small"
                    @click="handlePageChange(totalPages)">
                    {{ totalPages }}
                </button>
            </div>

            <!-- 下一页按钮 -->
            <button class="btn btn-default btn-small" @click="goToNextPage" :disabled="currentPage === totalPages">
                下一页
            </button>

            <!-- 末页按钮 -->
            <button class="btn btn-default btn-small" @click="goToLastPage" :disabled="currentPage === totalPages">
                末页
            </button>
        </div>

        <!-- 跳转到指定页区域 -->
        <div class="goto-page">
            <span>前往</span>
            <!-- 页码输入框，支持回车键跳转 -->
            <input type="number" v-model="goToPageInput" @keypress="handleKeyPress" class="input goto-input" min="1"
                :max="totalPages" />
            <span>页</span>
            <!-- 跳转按钮 -->
            <button class="btn btn-default btn-small" @click="handleGoToPage" :disabled="!goToPageInput">
                跳转
            </button>
        </div>
    </div>
</template>

<style scoped>
/* 分页组件容器样式 */
.pagination-bar {
    display: flex;
    /* 使用flex布局 */
    justify-content: space-between;
    /* 两端对齐 */
    align-items: center;
    /* 垂直居中 */
    padding: var(--spacing-lg) 0;
    /* 上下添加大间距 */
    flex-wrap: wrap;
    /* 允许换行 */
    gap: var(--spacing-lg);
    /* 元素间添加大间距 */
}

/* 数据信息样式 */
.data-info {
    color: var(--text-secondary);
    /* 使用次要文本颜色 */
    font-size: var(--font-size-sm);
    /* 使用小字体 */
}

/* 每页显示条数选择器样式 */
.page-size-selector {
    display: flex;
    /* 使用flex布局 */
    align-items: center;
    /* 垂直居中 */
    gap: var(--spacing-sm);
    /* 元素间添加小间距 */
}

/* 每页显示条数选择器标签样式 */
.page-size-selector label {
    color: var(--text-secondary);
    /* 使用次要文本颜色 */
    font-size: var(--font-size-sm);
    /* 使用小字体 */
}

/* 每页显示条数选择框样式 */
.page-size-select {
    width: auto;
    /* 宽度自适应内容 */
}

/* 分页导航按钮容器样式 */
.pagination-nav {
    display: flex;
    /* 使用flex布局 */
    align-items: center;
    /* 垂直居中 */
    gap: var(--spacing-xs);
    /* 元素间添加极小间距 */
}

/* 页码按钮容器样式 */
.page-numbers {
    display: flex;
    /* 使用flex布局 */
    gap: var(--spacing-xs);
    /* 元素间添加极小间距 */
}

/* 省略号样式 */
.ellipsis {
    padding: 0 var(--spacing-sm);
    /* 左右添加小间距 */
    color: var(--text-secondary);
    /* 使用次要文本颜色 */
}

/* 跳转到指定页容器样式 */
.goto-page {
    display: flex;
    /* 使用flex布局 */
    align-items: center;
    /* 垂直居中 */
    gap: var(--spacing-sm);
    /* 元素间添加小间距 */
}

/* 跳转到指定页标签样式 */
.goto-page span {
    color: var(--text-secondary);
    /* 使用次要文本颜色 */
    font-size: var(--font-size-sm);
    /* 使用小字体 */
}

/* 跳转输入框样式 */
.goto-input {
    width: 50px;
    /* 设置固定宽度 */
    text-align: center;
    /* 文本居中 */
}

/* 响应式布局：移动设备适配 */
@media (max-width: 768px) {

    /* 移动设备上分页组件容器样式调整 */
    .pagination-bar {
        flex-direction: column;
        /* 改为垂直布局 */
        align-items: flex-start;
        /* 靠左对齐 */
    }

    /* 移动设备上数据信息样式调整 */
    .data-info {
        width: 100%;
        /* 宽度100% */
    }

    /* 移动设备上每页显示条数选择器样式调整 */
    .page-size-selector {
        width: 100%;
        /* 宽度100% */
    }

    /* 移动设备上分页导航按钮样式调整 */
    .pagination-nav {
        width: 100%;
        /* 宽度100% */
        overflow-x: auto;
        /* 水平方向允许滚动 */
        justify-content: flex-start;
        /* 靠左对齐 */
    }

    /* 移动设备上跳转到指定页样式调整 */
    .goto-page {
        width: 100%;
        /* 宽度100% */
    }
}
</style>