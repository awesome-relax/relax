import { useState } from 'react';
import './index.scss';
import { atom, get, selector, update } from '@relax/core';
import { useRelaxValue } from '@relax/react';
import { useTranslation } from '../../i18n/useTranslation';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Fix: Use new atom API with object parameter format
const todoListAtom = atom<Todo[]>({
  defaultValue: [],
});
update(todoListAtom, []);

// Fix: Use new selector API with object parameter format
const completedCountSelector = selector({
  get: (get) => get(todoListAtom)?.filter((todo) => todo.completed).length || 0,
});

const pendingCountSelector = selector({
  get: (get) => get(todoListAtom)?.filter((todo) => !todo.completed).length || 0,
});

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

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
    };

    const currentTodos = get(todoListAtom) || [];
    update(todoListAtom, [...currentTodos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    const currentTodos = get(todoListAtom) || [];
    update(
      todoListAtom,
      currentTodos.map((todo: Todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    const currentTodos = get(todoListAtom) || [];
    update(
      todoListAtom,
      currentTodos.filter((todo: Todo) => todo.id !== id)
    );
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
