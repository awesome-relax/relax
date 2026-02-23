---
"@relax-state/react": patch
"@relax-state/core": patch
---

Changelog Summary (v0.0.3)  
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

---

@relax-state/react

Features:

- useActions Hook - 全新的 hook，支持完整的类型推断
  - 返回的 action 保留原始 payload 和返回类型
  - 支持多个 action 的批量绑定

Documentation:

- 新增 useActions 使用文档和示例

---

@relax/demos

Updates:

- 更新 todo-list 示例，使用新的 Action 系统和插件
