<!-- DataTable (数据表格组件)​ -->
<!-- 该组件负责展示数据表格，支持数据筛选、分页、选择、编辑和删除功能 -->
<script setup>
// 导入Vue 3的组合式API函数
import { ref, reactive, onMounted, computed, watch } from 'vue';
// 导入子组件
import TableRow from './TableRow.vue';    // 表格行组件
import ActionButton from './ActionButton.vue'; // 操作按钮组件

// 定义组件的props
const props = defineProps({
    // 筛选条件 - 从父组件传入的筛选参数
    filters: {
        type: Object,              // 类型为对象
        default: () => ({})        // 默认值为空对象
    },
    // 分页参数 - 从父组件传入的分页信息
    pagination: {
        type: Object,              // 类型为对象
        default: () => ({          // 默认值包含当前页码和每页显示条数
            currentPage: 1,        // 当前页码，默认为1
            pageSize: 10           // 每页显示条数，默认为10
        })
    }
});

// 定义组件可以触发的事件
const emit = defineEmits([
    'delete-items',  // 批量删除事件
    'edit-item',     // 编辑项目事件
    'delete-item',   // 删除项目事件
    'total-items-change' // 总数据条数变化事件
]);

// 原始数据 - 存储从服务器获取的完整数据集
const tableData = ref([]);
// 过滤后的数据 - 存储应用筛选条件后的数据
const filteredData = ref([]);
// 分页后的数据 - 存储当前页显示的数据
const paginatedData = ref([]);
// 选中的行索引 - 使用Set存储被选中行的索引
const selectedRows = ref(new Set());

// 加载数据函数 - 从服务器获取数据或使用本地示例数据
const loadData = async () => {
    try {
        // 尝试从服务器获取数据
        const response = await fetch('/data/data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        // 将获取的数据赋值给tableData
        tableData.value = await response.json();
        // 应用筛选条件
        applyFilters();
    } catch (error) {
        // 处理错误情况
        console.error('Error loading data:', error);
        // 如果获取失败，使用本地数据作为示例
        tableData.value = [
            {
                "日期": "2024-08-15",
                "域名": "<span class='highlight'>youtube.com</span>",
                "网站名称": "YouTube",
                "网站类目": "Video",
                "浏览时长": "45:22",
                "访问次数": 12
            },
            {
                "日期": "2024-09-03",
                "域名": "<span class='tech'>github.com</span>",
                "网站名称": "GitHub",
                "网站类目": "Tech",
                "浏览时长": "32:17",
                "访问次数": 9
            }
        ];
        // 应用筛选条件
        applyFilters();
    }
};

// 应用筛选条件和分页函数
const applyFilters = () => {
    // 如果没有筛选条件，直接使用全部数据
    if (!props.filters) {
        filteredData.value = [...tableData.value];
        applyPagination();
        return;
    }

    // 创建原始数据的副本进行处理
    let result = [...tableData.value];

    // 应用搜索筛选
    if (props.filters.search) {
        const searchTerm = props.filters.search.toLowerCase();
        result = result.filter(item => {
            // 处理域名中的HTML标签，只提取文本内容
            const domainText = item.域名.replace(/<[^>]*>/g, '').toLowerCase();
            // 检查域名或网站名称是否包含搜索词
            return domainText.includes(searchTerm) ||
                item.网站名称.toLowerCase().includes(searchTerm);
        });
    }

    // 应用日期筛选
    if (props.filters.startDate && props.filters.endDate) {
        const startDate = new Date(props.filters.startDate);
        const endDate = new Date(props.filters.endDate);
        endDate.setHours(23, 59, 59); // 设置结束日期为当天结束时间

        result = result.filter(item => {
            const itemDate = new Date(item.日期);
            // 检查数据日期是否在筛选范围内
            return itemDate >= startDate && itemDate <= endDate;
        });
    }

    // 应用网站类目筛选
    if (props.filters.websiteCategory) {
        result = result.filter(item => item.网站类目 === props.filters.websiteCategory);
    }

    // 保存筛选后的全部数据
    filteredData.value = result;
    // 应用分页
    applyPagination();
    // 触发总数据条数变化事件，通知父组件更新
    emit('total-items-change', result.length);
};

// 应用分页函数 - 根据分页参数从过滤后的数据中提取当前页数据
const applyPagination = () => {
    const { currentPage, pageSize } = props.pagination;
    // 计算当前页的起始索引
    const startIndex = (currentPage - 1) * pageSize;
    // 计算当前页的结束索引
    const endIndex = startIndex + pageSize;

    // 只显示当前页的数据
    paginatedData.value = filteredData.value.slice(startIndex, endIndex);
};

// 处理行选择函数 - 当用户选择/取消选择某行时调用
const handleRowSelect = ({ index, selected }) => {
    if (selected) {
        // 如果选中，将索引添加到选中集合
        selectedRows.value.add(index);
    } else {
        // 如果取消选中，从选中集合中移除索引
        selectedRows.value.delete(index);
    }
};

// 处理编辑操作函数 - 当用户点击编辑按钮时调用
const handleEditItem = ({ index, item }) => {
    // 这里可以添加编辑逻辑，例如打开编辑对话框
    console.log('编辑项目', index, item);
    // 触发编辑事件，通知父组件
    emit('edit-item', { index, item });
};

// 处理删除操作函数 - 当用户点击删除按钮时调用
const handleDeleteItem = ({ index, item }) => {
    // 确认删除操作
    if (confirm(`确定要删除 "${item.网站名称}" 吗？`)) {
        // 找到原始数据中的索引
        const originalIndex = tableData.value.findIndex(
            dataItem => JSON.stringify(dataItem) === JSON.stringify(item)
        );

        if (originalIndex !== -1) {
            // 从原始数据中删除
            tableData.value.splice(originalIndex, 1);
            // 重新应用筛选
            applyFilters();
            // 发送删除事件，通知父组件
            emit('delete-item', { index, item });
        }
    }
};

// 处理全选/取消全选函数 - 当用户点击表头的复选框时调用
const handleSelectAll = (event) => {
    if (event.target.checked) {
        // 全选当前页的所有行
        selectedRows.value = new Set(paginatedData.value.map((_, index) => (pagination.currentPage - 1) * pagination.pageSize + index));
    } else {
        // 取消全选
        selectedRows.value.clear();
    }
};

// 批量删除函数 - 当用户点击批量删除按钮时调用
const handleBatchDelete = () => {
    // 检查是否有选中的行
    if (selectedRows.value.size === 0) {
        alert('请先选择要删除的行');
        return;
    }

    // 确认批量删除操作
    if (confirm(`确定要删除选中的 ${selectedRows.value.size} 条记录吗？`)) {
        // 获取要删除的索引（从大到小排序，避免删除时索引变化）
        const indexesToDelete = Array.from(selectedRows.value).sort((a, b) => b - a);

        // 从原始数据中删除选中的行
        indexesToDelete.forEach(index => {
            const originalIndex = tableData.value.findIndex(
                item => JSON.stringify(item) === JSON.stringify(filteredData.value[index])
            );
            if (originalIndex !== -1) {
                tableData.value.splice(originalIndex, 1);
            }
        });

        // 清空选择
        selectedRows.value.clear();

        // 重新应用筛选
        applyFilters();

        // 发送删除事件，通知父组件
        emit('delete-items');
    }
};

// 计算是否全选 - 使用computed属性计算当前页是否全部选中
const isAllSelected = computed(() => {
    // 当有数据且选中行数等于当前页数据行数时返回true
    return paginatedData.value.length > 0 && selectedRows.value.size === paginatedData.value.length;
});

// 计算是否部分选中 - 使用computed属性计算当前页是否部分选中
const isIndeterminate = computed(() => {
    // 当有选中行但不是全部选中时返回true
    return selectedRows.value.size > 0 && selectedRows.value.size < paginatedData.value.length;
});

// 组件挂载时加载数据 - 使用Vue的onMounted生命周期钩子
onMounted(() => {
    loadData();
});

// 监听筛选条件变化 - 使用Vue的watch函数
watch(() => props.filters, () => {
    // 筛选条件变化时重新应用筛选
    applyFilters();
    // 筛选条件变化时清空选择
    selectedRows.value.clear();
}, { deep: true }); // 深度监听，确保对象内部属性变化也能触发

// 监听分页参数变化 - 使用Vue的watch函数
watch(() => props.pagination, () => {
    // 分页参数变化时重新应用分页
    applyPagination();
    // 分页变化时清空选择
    selectedRows.value.clear();
}, { deep: true }); // 深度监听，确保对象内部属性变化也能触发
</script>

<template>
    <!-- 数据表格容器，提供水平滚动功能 -->
    <div class="data-table-container">
        <!-- 表格元素 -->
        <table class="table">
            <!-- 表头部分 -->
            <thead>
                <tr>
                    <!-- 复选框列头 -->
                    <th class="checkbox-header">
                        <!-- 全选/取消全选复选框 -->
                        <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                            @change="handleSelectAll" class="header-checkbox" />
                    </th>
                    <!-- 各列标题 -->
                    <th>日期</th>
                    <th>域名</th>
                    <th>网站名称</th>
                    <th>网站类目</th>
                    <th>浏览时长</th>
                    <th>访问次数</th>
                    <!-- 操作列标题 -->
                    <th class="actions-header">操作</th>
                </tr>
            </thead>
            <!-- 表格主体部分 -->
            <tbody>
                <!-- 遍历分页后的数据，为每一项创建TableRow组件 -->
                <TableRow v-for="(item, index) in paginatedData" :key="index" :item="item"
                    :index="(pagination.currentPage - 1) * pagination.pageSize + index"
                    :time-format="filters?.timeFormat || 'default'"
                    :is-selected="selectedRows.has((pagination.currentPage - 1) * pagination.pageSize + index)"
                    @select-item="handleRowSelect" @edit-item="handleEditItem" @delete-item="handleDeleteItem" />
                <!-- 计算并传递全局索引（考虑分页） -->
                <!-- 传递时间格式参数 -->
                <!-- 传递是否选中状态 -->
                <!-- 监听行选择事件 -->
                <!-- 监听编辑事件 -->
                <!-- 监听删除事件 -->
            </tbody>
        </table>

        <!-- 当没有数据时显示的提示 -->
        <div v-if="paginatedData.length === 0" class="empty-data">
            暂无数据
        </div>
    </div>
</template>

<style scoped>
/* 数据表格容器样式 */
.data-table-container {
    width: 100%;
    /* 宽度填满父容器 */
    overflow-x: auto;
    /* 水平方向自动滚动，适应小屏幕 */
}

/* 复选框表头样式 */
.checkbox-header {
    width: 40px;
    /* 设置固定宽度 */
    text-align: center;
    /* 文本居中对齐 */
}

/* 表头复选框样式 */
.header-checkbox {
    cursor: pointer;
    /* 鼠标指针为手型 */
}

/* 操作列表头样式 */
.actions-header {
    width: 150px;
    /* 设置固定宽度 */
}

/* 空数据提示样式 */
.empty-data {
    padding: var(--spacing-xl);
    /* 内边距使用CSS变量 */
    text-align: center;
    /* 文本居中对齐 */
    color: var(--text-muted);
    /* 文字颜色使用CSS变量 */
    background-color: var(--bg-card);
    /* 背景色使用CSS变量 */
    border: 1px solid var(--border-primary);
    /* 边框使用CSS变量 */
    border-top: none;
    /* 移除顶部边框 */
    border-radius: 0 0 var(--border-radius-medium) var(--border-radius-medium);
    /* 底部圆角使用CSS变量 */
}
</style>