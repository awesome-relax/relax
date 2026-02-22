# Findings: 修改单测，之后再修改relax-react

## 项目状态
项目已成功添加了新的功能：
- `computed` 功能：替代了之前的 selector
- `store` 功能：提供了新的状态管理方式

## 代码变更分析

### 主要变更
- 删除了 `packages/core/src/selector.ts`
- 新增了 `packages/core/src/computed.ts`
- 新增了 `packages/core/src/store.ts`
- 更新了 `packages/core/src/index.ts` 以导出新功能

### 需要更新的部分

#### 测试文件
1. `packages/core/__tests__/selector.test.ts` 需要更新为使用 `computed` 而不是 `selector`
2. 需要创建新的 `packages/core/__tests__/store.test.ts` 来测试 store 功能

#### React 集成
1. 需要检查 `packages/relax-react/` 包是否需要更新以支持新功能
2. 需要检查 `packages/relax-react/__tests__/` 目录下的测试文件是否需要更新

## 依赖关系
- `packages/relax-react` 依赖于 `packages/core`
- `examples/relax-demos` 依赖于两个包

## 功能特性

### computed 功能
- 提供了与 selector 类似的功能
- 语法更加简洁
- 自动跟踪依赖关系
- 支持异步初始化

### store 功能
- 提供了集中式状态管理
- 支持状态的获取和设置
- 提供了 effect 机制来监听状态变化
- 可以创建多个独立的 store 实例