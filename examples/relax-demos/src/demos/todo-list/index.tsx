import { useState } from 'react';
import './index.scss';
import { action, addPlugin, computed, type Plugin, state } from '@relax-state/core';
import { createStore } from '@relax-state/store';
import { useRelaxValue } from '@relax-state/react';
import { useTranslation } from '../../i18n/useTranslation';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// 创建一个全局日志插件
const loggerPlugin: Plugin = {
  name: 'todo-logger',
  onBefore: (ctx) => {
    console.log(`[Action] ${ctx.name}`, ctx.payload);
  },
  onAfter: (ctx) => {
    console.log(`[Action] ${ctx.name} completed`);
  },
};

addPlugin(loggerPlugin);

const todoStore = createStore();

// 状态定义
const todoListAtom = state<Todo[]>([]);

const completedCountSelector = computed<number>({
  get: (get) => get(todoListAtom)?.filter((todo) => todo.completed).length || 0,
});

const pendingCountSelector = computed<number>({
  get: (get) => get(todoListAtom)?.filter((todo) => !todo.completed).length || 0,
});

// Actions
const addTodoAction = action(
  (store, payload: { text: string }) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: payload.text,
      completed: false,
    };
    const currentTodos = store.get(todoListAtom) || [];
    store.set(todoListAtom, [...currentTodos, newTodo]);
    return newTodo;
  },
  { name: 'todos/add' }
);

const toggleTodoAction = action(
  (store, payload: { id: string }) => {
    const currentTodos = store.get(todoListAtom) || [];
    const updated = currentTodos.map((todo: Todo) =>
      todo.id === payload.id ? { ...todo, completed: !todo.completed } : todo
    );
    store.set(todoListAtom, updated);
  },
  { name: 'todos/toggle' }
);

const removeTodoAction = action(
  (store, payload: { id: string }) => {
    const currentTodos = store.get(todoListAtom) || [];
    store.set(
      todoListAtom,
      currentTodos.filter((todo: Todo) => todo.id !== payload.id)
    );
  },
  { name: 'todos/remove' }
);

export const TodoList = () => {
  const t = useTranslation();
  const todos = useRelaxValue(todoListAtom);
  const completedCount = useRelaxValue(completedCountSelector);
  const pendingCount = useRelaxValue(pendingCountSelector);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (!inputValue.trim()) {
      return;
    }

    addTodoAction(todoStore, { text: inputValue.trim() });
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    toggleTodoAction(todoStore, { id });
  };

  const removeTodo = (id: string) => {
    removeTodoAction(todoStore, { id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todoList">
      <div className="todoListHeader">
        <h2 className="todoListTitle">{t('title')}</h2>
        <p className="todoListSubtitle">{t('subtitle')}</p>
      </div>

      <div className="todoListInput">
        <input
          type="text"
          className="todoInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('inputPlaceholder')}
        />
        <button type="button" className="addButton" onClick={addTodo} disabled={!inputValue.trim()}>
          {t('addButton')}
        </button>
      </div>

      <div className="todoListContent">
        {todos.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">📝</div>
            <p className="emptyText">{t('emptyTitle')}</p>
            <p className="emptySubtext">{t('emptySubtitle')}</p>
          </div>
        ) : (
          <ul className="todoItems">
            {todos.map((todo) => (
              <li key={todo.id} className={`todoItem ${todo.completed ? 'completed' : ''}`}>
                <div className="todoItemContent">
                  <button
                    type="button"
                    className="todoCheckbox"
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={todo.completed ? t('markIncomplete') : t('markCompleted')}
                  >
                    {todo.completed && <span className="checkmark">✓</span>}
                  </button>
                  <button
                    type="button"
                    className="todoText"
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={todo.completed ? t('markIncomplete') : t('markCompleted')}
                  >
                    {todo.text}
                  </button>
                </div>
                <button
                  type="button"
                  className="deleteButton"
                  onClick={() => removeTodo(todo.id)}
                  aria-label={t('deleteTask')}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {todos.length > 0 && (
        <div className="todoListFooter">
          <div className="todoStats">
            <span className="totalCount">
              {t('totalCount')}: {todos.length}
            </span>
            <span className="completedCount">
              {t('completedCount')}: {completedCount}
            </span>
            <span className="pendingCount">
              {t('pendingCount')}: {pendingCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
