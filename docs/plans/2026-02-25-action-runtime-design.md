# Action Runtime 设计方案

## 背景与目标

当前 `action` 与 `state` 的约束不够强：`store` 可在任意位置被拿到并直接 `set`，导致状态写入边界不清晰。  
本次重构目标是将 **state 写能力限制在 action 执行上下文内**，并移除对外暴露的默认单例 `DefultStore`。

核心目标：

- 对外不再暴露可写 `store`
- action 创建后自动绑定运行时内部 store
- action 调用形态收敛为仅传 `payload`
- 保持插件生命周期（`onBefore/onAfter/onError`）语义稳定

非目标：

- 不追求向旧 API 兼容（本次为破坏性升级）
- 不引入新的状态模型（仅调整运行时边界与调用方式）

## 方案对比

### 方案 A（采纳）：Runtime 容器模式

引入 `createRuntime()` 作为唯一运行入口。`Runtime` 内部持有私有 store，并在 action 绑定时注入可写上下文。

优点：

- 写入边界最清晰，符合“只能在 action 内修改 state”
- 天然支持多实例（测试、隔离场景）
- 便于后续扩展 runtime 级能力（中间件、调试钩子）

缺点：

- 需要迁移入口 API

### 方案 B：隐式单例模式

内部保留一个默认 runtime，不再导出 `DefultStore`，action 默认绑定该单例。

优点：调用最简单。  
缺点：测试隔离与多实例能力弱，长期扩展受限。

### 方案 C：Scope 工厂模式

通过 `createScope()` 返回 `action/get/subscribe` 的作用域对象，每个作用域持有私有 store。

优点：灵活，适合多上下文。  
缺点：抽象层更多，认知成本更高。

## 最终设计

### 1) 公共 API 调整

- 删除公共导出：`Store`、`createStore`、`DefultStore`
- 新增公共入口：`createRuntime()`
- `action` 定义函数签名由 `(store, payload)` 改为 `(ctx, payload)`
- 绑定后的 action 调用签名为 `(payload) => result`

### 2) 模块职责

- `runtime.ts`（新增）
  - 创建并封装私有 store
  - 暴露只读 API：`get(state)`、`subscribe(state, fn)`
  - 提供 action 绑定能力（内部注入可写 `ctx`）
- `action.ts`（重构）
  - 保留 action 元数据与插件编排逻辑
  - 不再接收外部传入的 store
- `store.ts`（内聚）
  - 仍保留底层状态存储实现
  - 仅供 runtime 内部使用，不作为公共 API 暴露

### 3) 数据流与执行链

一次 action 调用过程如下：

1. 调用方执行 `runtime.actions.xxx(payload)`
2. runtime 创建内部 `ActionContext`（含 `get/set/effect`）
3. 触发插件 `onBefore`
4. 执行 action handler（可写 state）
5. 发生异常时触发 `onError` 并抛出
6. 成功时触发 `onAfter` 并返回结果

### 4) 写权限限制策略

双重限制：

- 编译期：对外只暴露只读 runtime 接口，不提供 `set`
- 运行时：store 仅存在于 runtime 闭包内，外部不可访问

可选增强（后续可增量加入）：

- 为 store 写入加内部 token 校验，进一步防止内部误调用

## 错误处理策略

- action handler 抛错：保持原始错误抛出，并触发 `plugin.onError`
- 插件错误默认策略建议保持“插件异常不吞主错误，不改变 handler 语义”
- 底层错误（无效 state、循环依赖）维持当前行为，避免非预期语义漂移

## 迁移策略（Breaking）

### API 迁移

- `action((store, payload) => ...)` -> `action((ctx, payload) => ...)`
- `myAction(store, payload)` -> `runtime.actions.myAction(payload)`
- `store.get(state)` -> `runtime.get(state)`
- `store.effect(state, fn)` -> `runtime.subscribe(state, fn)`

### 发布说明

- 以破坏性升级发布版本
- changelog 明确移除项与迁移示例
- README 使用 runtime-first 的最小示例更新

## 测试计划

必须新增/更新以下测试：

- action 绑定后调用签名与执行结果
- 外部无法获取写接口（类型与运行时层面）
- 插件生命周期顺序与错误链路
- computed 缓存失效与 effect 触发回归

验收标准：

- 所有 state 写入路径均通过 action
- 公共 API 不再出现 `DefultStore` / `createStore` / `Store`
- 现有核心行为（computed/effect/plugin）无回归
