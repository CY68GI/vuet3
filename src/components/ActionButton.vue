<!-- 
  ActionButton (操作按钮组件)
  一个可自定义类型、大小和图标的按钮组件
-->
<script setup>
// 定义组件接收的props属性
const props = defineProps({
    // 按钮类型，默认为'default'
    type: {
        type: String,
        default: 'default', // 可以是 'default', 'primary', 'success', 'warning', 'danger'
        validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)  // 验证器，确保值在允许的列表中
    },
    // 按钮大小，默认为'medium'
    size: {
        type: String,
        default: 'medium', // 可以是 'small', 'medium', 'large'
        validator: (value) => ['small', 'medium', 'large'].includes(value)  // 验证器，确保值在允许的列表中
    },
    // 按钮是否禁用，默认为false
    disabled: {
        type: Boolean,
        default: false
    },
    // 按钮图标，默认为空字符串
    icon: {
        type: String,
        default: ''
    }
});

// 定义组件可以触发的事件
const emit = defineEmits(['click']);  // 定义点击事件

// 处理按钮点击函数
// 当按钮被点击时触发，如果按钮未禁用则触发click事件
const handleClick = () => {
    if (!props.disabled) {  // 检查按钮是否禁用
        emit('click');      // 触发点击事件
    }
};

// 根据类型获取按钮类名函数
// 返回按钮类型对应的CSS类名
const getButtonClass = () => {
    return `btn-${props.type}`;  // 例如：btn-primary, btn-danger等
};

// 根据大小获取按钮类名函数
// 返回按钮大小对应的CSS类名
const getSizeClass = () => {
    return `btn-${props.size}`;  // 例如：btn-small, btn-large等
};
</script>

<template>
    <!-- 
      按钮元素，动态绑定类名和属性
      类名包括基础类btn、类型类、大小类和禁用状态类
    -->
    <button 
        :class="['btn', getButtonClass(), getSizeClass(), { 'disabled': disabled }]" 
        @click="handleClick"
        :disabled="disabled">
        <!-- 
          如果有图标，显示图标元素
          图标与文本之间有间距
        -->
        <span v-if="icon" class="button-icon">{{ icon }}</span>
        <!-- 
          插入插槽内容，可以是按钮文本或其他内容
        -->
        <slot></slot>
    </button>
</template>

<style scoped>
/* 
  按钮图标样式
  图标与文本之间添加右边距，使用全局CSS变量控制间距
*/
.button-icon {
    margin-right: var(--spacing-xs);  /* 使用全局CSS变量定义的极小间距 */
}
</style>