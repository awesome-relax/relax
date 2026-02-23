# relax

A modern front-end MVC framework with reactive state management, modular design, and first-class TypeScript support.

---

## ✨ Packages

### [`@relax/core`](./packages/core)

- **Lightweight, reactive state management**
- Atomic state (`atom`), derived state (`selector`)
- Side effect system (`effect`)
- Event system (`createEvent`)
- No external dependencies, fully typed

See [`packages/core/README.md`](./packages/core/README.md) for full API and usage.

---

### [`@relax-state/react`](./packages/relax-react)

- **React hooks for Relax state**
- `useRelaxState` – use and update Relax state in React
- `useRelaxValue` – read-only subscription to Relax state
- TypeScript-first, minimal API

See [`packages/relax-react/README.md`](./packages/relax-react/README.md) for details.

---

## 🧑‍💻 Example Projects

### [`examples/relax-demos`](./examples/relax-demos)

- Vite + React + TypeScript template
- Includes a modern TodoList demo using Relax state and hooks
- Ready for rapid prototyping and testing

### [`examples/basic-actions`](./examples/basic-actions)

- Complete demonstration of the Action system
- Shows plugin usage for logging and analytics
- Standalone TypeScript example

---

## 🚀 Getting Started

1. **Install dependencies** (use pnpm for workspace support):

   ```bash
   pnpm install
   ```

2. **Build all packages**:

   ```bash
   pnpm run build
   ```

3. **Run the example project**:

   ```bash
   cd examples/relax-demos
   pnpm run dev
   ```

---

## 🏗️ Development

- All packages are TypeScript-first and designed for composability.
- You can use and extend the core state system in any framework.
- React integration is provided via hooks in `@relax/react`.

---

## 📚 Documentation

- [@relax-state/core README](./packages/core/README.md)
- [@relax-state/react README](./packages/relax-react/README.md)
- Example usage in [`examples/relax-demos`](./examples/relax-demos)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to submit a PR or open an issue.

---
