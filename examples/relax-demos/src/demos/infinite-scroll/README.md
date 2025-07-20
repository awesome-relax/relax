# 无限滚动列表 Demo

这是一个使用 Relax 状态管理库实现的无限滚动列表示例。

## 功能特性

- **无限滚动加载**: 当用户滚动到列表底部时，自动加载更多内容
- **加载状态指示**: 显示加载动画和状态提示
- **数据管理**: 使用 Relax 的 atom 和 selector 管理列表数据
- **响应式设计**: 支持移动端和桌面端显示
- **重置功能**: 可以重置列表重新开始

## 技术实现

### 状态管理
- `listAtom`: 存储列表数据
- `loadingAtom`: 控制加载状态
- `hasMoreAtom`: 标记是否还有更多数据
- `pageAtom`: 当前页码
- `listLengthSelector`: 计算列表长度

### 核心功能
1. **Intersection Observer**: 监听滚动到底部的事件
2. **模拟API**: 使用 setTimeout 模拟网络请求
3. **分页加载**: 每次加载10条数据
4. **状态同步**: 使用 Relax hooks 自动同步状态变化

### 样式特点
- 现代化的卡片式设计
- 渐变背景和阴影效果
- 平滑的动画过渡
- 移动端适配

## 使用方法

```tsx
import { InfiniteScroll } from './demos/infinite-scroll';

// 在组件中使用
<InfiniteScroll />
```

## 文件结构

```
infinite-scroll/
├── index.tsx      # 主组件文件
├── index.scss     # 样式文件
└── README.md      # 说明文档
```

## 依赖

- React 19+
- @relax/core
- @relax/react
- SCSS 