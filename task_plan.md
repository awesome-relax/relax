# Task Plan: 修改单测，之后再修改relax-react

## 项目概述
项目已经添加了新的功能，包括 `computed` 和 `store`，但现有的测试文件和 react 集成还没有更新以支持这些功能。

## 总体目标
1. 更新测试文件以支持新的 `computed` 功能
2. 更新 relax-react 包以支持新功能
3. 确保所有功能正常工作

## 详细任务

### 阶段一：更新测试文件 (当前阶段)
- [x] 检查现有测试文件结构
- [x] 查看 selector.test.ts 文件内容
- [x] 查看 computed.ts 文件内容
- [x] 更新 selector.test.ts 为 computed.test.ts
- [x] 创建 store.test.ts 文件
- [ ] 删除 atom.ts 和 atom.test.ts 文件
- [ ] 更新 index.ts 文件
- [ ] 运行所有测试以确保它们通过

### 阶段二：更新 relax-react 包
- [ ] 检查 relax-react 包的源代码
- [ ] 更新 relax-react 以支持 new features
- [ ] 更新 relax-react 的测试文件
- [ ] 运行 relax-react 的测试

### 阶段三：验证和测试
- [ ] 运行整个项目的测试
- [ ] 检查项目是否能正常构建
- [ ] 验证 examples 是否能正常工作

## 决策记录

## 文件创建/修改记录

| File | Status | Comments |
|------|--------|----------|
| packages/core/__tests__/selector.test.ts | 待修改 | 需要更新为使用 computed |
| packages/core/__tests__/store.test.ts | 待创建 | 需要创建新的测试文件 |
| packages/relax-react/src/ | 待检查 | 需要检查是否需要更新 |
| packages/relax-react/__tests__/ | 待检查 | 需要检查是否需要更新 |

## Errors Encountered