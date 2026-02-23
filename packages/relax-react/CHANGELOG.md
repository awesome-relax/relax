# @relax-state/react

## 0.0.7

### Patch Changes

- 225e8c5: fix export error
- Updated dependencies [225e8c5]
  - @relax-state/core@0.0.7

## 0.0.6

### Patch Changes

- f4bd46d: commom release
- Updated dependencies [f4bd46d]
  - @relax-state/core@0.0.6

## 0.0.5

### Patch Changes

- d270e56: rebuild
- Updated dependencies [d270e56]
  - @relax-state/core@0.0.5

## 0.0.4

### Patch Changes

- ea87ab6: Changelog Summary (v0.0.3)
  @relax-state/core
  Features:

  - Action System - 全新的 Action 系统，支持插件
    - action() - 创建可派发的 action
    - dispatch() - 执行 action 并触发插件钩子
    - 支持 action 直接调用：action(store, payload)
  - Plugin System - 全局插件架构
    - onBefore/onAfter/onError 生命周期钩子
    - 全局插件管理：addPlugin, removePlugin, getPlugins, clearPlugins
    - 支持 action 级别的插件
  - 增强的 Store
    - 通过构造函数和 use() 方法支持插件
    - 改进的 TypeScript 类型支持

  Documentation:

  - 完整的 JSDoc 注释和示例
  - 重写 README，包含详细的使用指南

  ***

  @relax-state/react

  Features:

  - useActions Hook - 全新的 hook，支持完整的类型推断
    - 返回的 action 保留原始 payload 和返回类型
    - 支持多个 action 的批量绑定

  Documentation:

  - 新增 useActions 使用文档和示例

  ***

  @relax/demos

  Updates:

  - 更新 todo-list 示例，使用新的 Action 系统和插件

- Updated dependencies [ea87ab6]
  - @relax-state/core@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies
  - @relax-state/core@0.0.3

## 0.0.2

### Patch Changes

- 7143a3a: This is the initial release. Future versions may include:
  - Enhanced circular dependency error messages with dependency paths
  - Configurable dependency tracking options
  - Performance optimizations for large state trees
  - Additional React utilities and hooks
- Updated dependencies [7143a3a]
  - @relax-state/core@0.0.2
