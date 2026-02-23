# @relax-state/core

## 0.0.3

### Patch Changes

- feat(core): add Action system with plugin support

  - Add Plugin interface with onBefore/onAfter/onError lifecycle hooks
  - Add Action type and action factory for creating dispatchable actions
  - Extend Store to support plugins via constructor and use() method
  - Add dispatch function to execute actions with plugin hooks

## 0.0.2

### Patch Changes

- 7143a3a: This is the initial release. Future versions may include:
  - Enhanced circular dependency error messages with dependency paths
  - Configurable dependency tracking options
  - Performance optimizations for large state trees
  - Additional React utilities and hooks
