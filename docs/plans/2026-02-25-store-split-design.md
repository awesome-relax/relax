# Store Split Design (Core -> Store Package)

Date: 2026-02-25
Status: Approved
Decision: Option A (new `@relax-state/store`, hard split from `@relax-state/core`)

## Background

Current `@relax-state/core` mixes two responsibilities:

- State model and action/plugin runtime (`state`, `computed`, `event`, `action`, `plugin`)
- Store runtime (`Store`, `createStore`, `DefultStore`)

This coupling makes package boundaries unclear and prevents focused evolution of store-specific behavior.

## Goals

- Extract store-related runtime into a new package: `@relax-state/store`
- Keep behavior unchanged (refactor by boundary, not by logic)
- Remove store exports from `@relax-state/core` (intentional breaking change)
- Update all first-party usages (react package, tests, demos, docs)

## Non-Goals

- Do not rename `DefultStore` in this change
- Do not redesign action/plugin architecture
- Do not introduce a shared `types` package in this iteration

## Architecture and Package Boundaries

### New package: `@relax-state/store`

Contains only:

- `Store` class
- `createStore()`
- `DefultStore`

The implementation is migrated from `packages/core/src/store.ts` with no runtime behavior changes.

### `@relax-state/core` after split

Retains:

- `state`, `computed`, `event`, `action`, `plugin`

Removes:

- `Store`, `createStore`, `DefultStore` exports from `core` entry

`action.ts` imports `Store` type from `@relax-state/store` for handler typing.

### `@relax-state/react` after split

- Provider/hooks import `Store`, `createStore`, `DefultStore` from `@relax-state/store`
- Continue importing `Action`, `State`, `Value` from `@relax-state/core`

## Dependency Direction and Constraints

Planned dependency relationship:

- `@relax-state/store` -> `@relax-state/core` (uses `RELAX_NODES`, `State`, `Value`, `ComputedFn`)
- `@relax-state/core` -> `@relax-state/store` (type usage in `action.ts`)
- `@relax-state/react` -> both packages

Constraints to limit coupling growth:

- `core` may only consume store types where required (`action.ts`)
- `core` must not re-export any store runtime API
- `store` must not depend on `action`, `plugin`, or `event`

## Data Flow (Behavior Preservation)

Runtime data flow remains unchanged:

1. `state/computed` are created in `core` and registered in `RELAX_NODES`
2. `store.get/set/effect` resolve and update data via `RELAX_NODES`
3. `action(store, payload)` executes as before; only `Store` type source changes

No algorithmic changes are introduced to computed caching, effect dispatching, or circular dependency detection.

## Migration Strategy

## Breaking change

`@relax-state/core` no longer exports:

- `Store`
- `createStore`
- `DefultStore`

### Import migration rules

- Before:
  - `import { createStore, DefultStore, type Store } from '@relax-state/core'`
- After:
  - `import { createStore, DefultStore, type Store } from '@relax-state/store'`

All other APIs (`state`, `computed`, `action`, `plugin`) stay on `@relax-state/core`.

### Affected locations

- `packages/relax-react/src/provider/index.tsx`
- `packages/core/src/action.ts` (Store type import)
- core/react tests using store APIs
- demos importing `createStore` or `DefultStore`
- package manifests and documentation

## Error Handling and Failure Modes

Expected migration failures:

- Compile errors where old imports from `@relax-state/core` remain
- Build errors if `@relax-state/store` dependency is missing in packages that consume store APIs

Mitigation:

- Provide explicit migration notes in `core` README and CHANGELOG
- Add new `store` README usage examples for common paths (react provider, tests, demos)

## Testing and Acceptance Criteria

## Required verification commands

- `pnpm -w run test:run`
- `pnpm -w run build`
- `pnpm -w run check` (if applicable for repository quality gate)

### Acceptance criteria

- `core` entry no longer exports store APIs
- New `store` package exports `Store/createStore/DefultStore`
- First-party code compiles and tests pass after import migration
- Demos run with updated imports
- Documentation and changelogs include migration guidance

## Rollout Notes

- Treat as a versioned breaking change in release notes
- Keep `DefultStore` spelling stable for now to avoid scope expansion
- Revisit deeper decoupling (`types` extraction) only if future work requires it

