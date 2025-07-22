import type { Language } from './index';

// Translation interface
export interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

// Common translations
export const commonTranslations: Translations = {
  // App level
  appTitle: {
    en: 'Relax Demos',
    zh: 'Relax 演示',
  },

  // Demo titles
  todoListTitle: {
    en: 'Todo List',
    zh: '待办事项',
  },
  infiniteScrollTitle: {
    en: 'Infinite Scroll',
    zh: '无限滚动',
  },
  modalTitle: {
    en: 'Modal Demo',
    zh: '弹框演示',
  },

  // Language switcher
  languageSwitch: {
    en: 'Language',
    zh: '语言',
  },
  english: {
    en: 'English',
    zh: 'English',
  },
  chinese: {
    en: '中文',
    zh: '中文',
  },
};

// Todo List translations
export const todoListTranslations: Translations = {
  title: {
    en: 'Todo List',
    zh: '待办事项',
  },
  subtitle: {
    en: 'Manage your task list',
    zh: '管理你的任务清单',
  },
  inputPlaceholder: {
    en: 'Enter a new todo item...',
    zh: '输入新的待办事项...',
  },
  addButton: {
    en: 'Add',
    zh: '添加',
  },
  emptyTitle: {
    en: 'No todo items',
    zh: '暂无待办事项',
  },
  emptySubtitle: {
    en: 'Add some tasks to start your plan!',
    zh: '添加一些任务开始你的计划吧！',
  },
  totalCount: {
    en: 'Total',
    zh: '总计',
  },
  completedCount: {
    en: 'Completed',
    zh: '已完成',
  },
  pendingCount: {
    en: 'Pending',
    zh: '待完成',
  },
  markCompleted: {
    en: 'Mark as completed',
    zh: '标记为已完成',
  },
  markIncomplete: {
    en: 'Mark as incomplete',
    zh: '标记为未完成',
  },
  deleteTask: {
    en: 'Delete task',
    zh: '删除任务',
  },
};

// Infinite Scroll translations
export const infiniteScrollTranslations: Translations = {
  title: {
    en: 'Infinite Scroll',
    zh: '无限滚动',
  },
  subtitle: {
    en: 'Load more content as you scroll',
    zh: '滚动时加载更多内容',
  },
  loading: {
    en: 'Loading...',
    zh: '加载中...',
  },
  noMoreData: {
    en: 'No more data',
    zh: '没有更多数据',
  },
  resetButton: {
    en: 'Reset',
    zh: '重置',
  },
  itemTitle: {
    en: 'Item',
    zh: '项目',
  },
  itemDescription: {
    en: 'This is the detailed description of item {id}, containing rich content information.',
    zh: '这是第 {id} 个项目的详细描述，包含了丰富的内容信息。',
  },
  totalItems: {
    en: 'Total items',
    zh: '总项目数',
  },
};

// Modal translations
export const modalTranslations: Translations = {
  title: {
    en: 'Modal Demo',
    zh: '弹框演示',
  },
  subtitle: {
    en: 'Using Relax to control modal display and data rendering',
    zh: '使用Relax控制弹框显示和数据渲染',
  },
  infoModal: {
    en: 'Info Modal',
    zh: '信息弹框',
  },
  successModal: {
    en: 'Success Modal',
    zh: '成功弹框',
  },
  warningModal: {
    en: 'Warning Modal',
    zh: '警告弹框',
  },
  errorModal: {
    en: 'Error Modal',
    zh: '错误弹框',
  },
  features: {
    en: 'Features',
    zh: '功能特性',
  },
  feature1: {
    en: 'Use Relax state management to control modal display',
    zh: '使用Relax状态管理控制弹框显示',
  },
  feature2: {
    en: 'Support multiple modal types (info, success, warning, error)',
    zh: '支持多种弹框类型（信息、成功、警告、错误）',
  },
  feature3: {
    en: 'Click overlay or press ESC to close modal',
    zh: '点击遮罩层或按ESC键关闭弹框',
  },
  feature4: {
    en: 'Responsive design, adapts to different screen sizes',
    zh: '响应式设计，适配不同屏幕尺寸',
  },
  feature5: {
    en: 'Use Selector to compute modal styles and icons',
    zh: '使用Selector计算弹框样式和图标',
  },
  // Modal content
  infoTitle: {
    en: 'Information',
    zh: '信息提示',
  },
  infoContent: {
    en: 'This is an information modal for displaying general information.',
    zh: '这是一个信息类型的弹框，用于显示一般信息。',
  },
  successTitle: {
    en: 'Success',
    zh: '操作成功',
  },
  successContent: {
    en: 'Congratulations! Your operation has been completed successfully.',
    zh: '恭喜！你的操作已经成功完成。',
  },
  warningTitle: {
    en: 'Warning',
    zh: '警告提示',
  },
  warningContent: {
    en: 'Please note that this operation may have some side effects.',
    zh: '请注意，这个操作可能会产生一些副作用。',
  },
  errorTitle: {
    en: 'Error',
    zh: '错误提示',
  },
  errorContent: {
    en: 'Sorry, the operation failed. Please try again later.',
    zh: '抱歉，操作失败，请稍后重试。',
  },
  closeModal: {
    en: 'Close modal',
    zh: '关闭弹框',
  },
  confirm: {
    en: 'Confirm',
    zh: '确定',
  },
};

// All translations combined
export const allTranslations = {
  ...commonTranslations,
  ...todoListTranslations,
  ...infiniteScrollTranslations,
  ...modalTranslations,
};
