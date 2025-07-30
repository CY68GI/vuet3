<!-- 
  TableRow (表格行组件)
  用于展示表格中的单行数据，包含选择框、数据展示和操作按钮
-->
<script setup>
// 导入Vue的computed函数，用于创建计算属性
import { computed } from 'vue';
// 导入操作按钮组件
import ActionButton from './ActionButton.vue';

// 定义组件接收的props属性
const props = defineProps({
    // 表格行数据对象，包含日期、域名、网站名称等信息
    item: {
        type: Object,
        required: true
    },
    // 时间格式化类型，默认为'default'
    timeFormat: {
        type: String,
        default: 'default'
    },
    // 行是否被选中，默认为false
    isSelected: {
        type: Boolean,
        default: false
    },
    // 行索引，用于标识表格中的具体行
    index: {
        type: Number,
        required: true
    }
});

// 定义组件可以触发的事件
const emit = defineEmits(['select-item', 'edit-item', 'delete-item']);

// 处理选择状态变化函数
// 当复选框状态改变时触发，向父组件发送选择状态变化事件
const handleSelectChange = (event) => {
    emit('select-item', {
        index: props.index,       // 发送当前行索引
        selected: event.target.checked  // 发送选择状态
    });
};

// 处理编辑操作函数
// 当点击编辑按钮时触发，向父组件发送编辑事件
const handleEdit = () => {
    emit('edit-item', {
        index: props.index,  // 发送当前行索引
        item: props.item     // 发送当前行数据对象
    });
};

// 处理删除操作函数
// 当点击删除按钮时触发，先弹出确认框，确认后向父组件发送删除事件
const handleDelete = () => {
    if (confirm(`确定要删除 "${props.item.网站名称}" 吗？`)) {
        emit('delete-item', {
            index: props.index,  // 发送当前行索引
            item: props.item     // 发送当前行数据对象
        });
    }
};

// 格式化浏览时长函数
// 根据timeFormat属性将时长转换为不同的显示格式
const formatDuration = (duration) => {
    // 如果时长为空或使用默认格式，直接返回原始值
    if (!duration || props.timeFormat === 'default') return duration;

    // 将分钟和秒分开并转换为数字
    const [minutes, seconds] = duration.split(':').map(Number);
    // 计算总秒数
    const totalSeconds = minutes * 60 + seconds;

    // 根据timeFormat属性值返回不同格式的时间字符串
    switch (props.timeFormat) {
        case 'seconds':
            return `${totalSeconds}秒`;       // 转换为秒
        case 'minutes':
            return `${(totalSeconds / 60).toFixed(2)}分钟`;  // 转换为分钟，保留两位小数
        case 'hours':
            return `${(totalSeconds / 3600).toFixed(2)}小时`; // 转换为小时，保留两位小数
        default:
            return duration;  // 默认返回原始值
    }
};
</script>

<template>
    <!-- 表格行，根据isSelected状态添加selected类 -->
    <tr class="table-row" :class="{ 'selected': isSelected }">
        <!-- 复选框单元格 -->
        <td class="checkbox-cell">
            <!-- 复选框，绑定选中状态和变化事件 -->
            <input type="checkbox" :checked="isSelected" @change="handleSelectChange" class="row-checkbox" />
        </td>
        <!-- 日期单元格 -->
        <td class="date-cell">{{ item.日期 }}</td>
        <!-- 域名单元格，使用v-html渲染可能包含HTML的内容 -->
        <td class="domain-cell" v-html="item.域名"></td>
        <!-- 网站名称单元格 -->
        <td class="name-cell">{{ item.网站名称 }}</td>
        <!-- 网站类目单元格 -->
        <td class="category-cell">{{ item.网站类目 }}</td>
        <!-- 浏览时长单元格，使用formatDuration函数格式化显示 -->
        <td class="duration-cell">{{ formatDuration(item.浏览时长) }}</td>
        <!-- 访问次数单元格 -->
        <td class="visits-cell">{{ item.访问次数 }}</td>
        <!-- 操作按钮单元格 -->
        <td class="actions-cell">
            <!-- 操作按钮容器 -->
            <div class="action-buttons">
                <!-- 编辑按钮，点击触发handleEdit函数 -->
                <ActionButton type="primary" size="small" @click="handleEdit">
                    编辑
                </ActionButton>
                <!-- 删除按钮，点击触发handleDelete函数 -->
                <ActionButton type="danger" size="small" @click="handleDelete">
                    删除
                </ActionButton>
            </div>
        </td>
    </tr>
</template>

<style scoped>
/* 表格行样式，添加背景色过渡效果 */
.table-row {
    transition: background-color var(--transition-fast);
}

/* 复选框单元格样式 */
.checkbox-cell {
    width: 40px;
    /* 设置宽度 */
    text-align: center;
    /* 文本居中 */
}

/* 行复选框样式 */
.row-checkbox {
    cursor: pointer;
    /* 设置鼠标指针为手型 */
}

/* 所有单元格的通用样式，文本左对齐 */
.date-cell,
.domain-cell,
.name-cell,
.category-cell,
.duration-cell,
.visits-cell,
.actions-cell {
    text-align: left;
}

/* 日期单元格样式 */
.date-cell {
    width: 120px;
    /* 设置宽度 */
}

/* 域名单元格样式 */
.domain-cell {
    width: 200px;
    /* 设置宽度 */
    font-weight: 500;
    /* 设置字体粗细 */
}

/* 网站名称单元格样式 */
.name-cell {
    width: 150px;
    /* 设置宽度 */
}

/* 网站类目单元格样式 */
.category-cell {
    width: 100px;
    /* 设置宽度 */
}

/* 浏览时长单元格样式 */
.duration-cell {
    width: 120px;
    /* 设置宽度 */
}

/* 访问次数单元格样式 */
.visits-cell {
    width: 100px;
    /* 设置宽度 */
}

/* 操作按钮单元格样式 */
.actions-cell {
    width: 150px;
    /* 设置宽度 */
}

/* 操作按钮容器样式 */
.action-buttons {
    display: flex;
    /* 使用flex布局 */
    gap: var(--spacing-xs);
    /* 设置按钮之间的间距 */
}
</style>