import { useState } from 'react';
import './index.scss';
import { atom, selector } from '@relax/core';
import { useRelaxState, useRelaxValue } from '@relax/react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const todoListAtom = atom<Todo[]>([]); 

const completedCountSelector = selector((get) => get(todoListAtom)?.filter(todo => todo.completed).length);
const pendingCountSelector = selector((get) => get(todoListAtom)?.filter(todo => !todo.completed).length);

export const TodoList = () => {
  const [todos, setTodos] = useRelaxState(todoListAtom);
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
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todoList">
      <div className="todoListHeader">
        <h2 className="todoListTitle">待办事项</h2>
        <p className="todoListSubtitle">管理你的任务清单</p>
      </div>
      
      <div className="todoListInput">
        <input
          type="text"
          className="todoInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入新的待办事项..."
        />
        <button 
          type="button"
          className="addButton"
          onClick={addTodo}
          disabled={!inputValue.trim()}
        >
          添加
        </button>
      </div>

      <div className="todoListContent">
        {todos.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">📝</div>
            <p className="emptyText">暂无待办事项</p>
            <p className="emptySubtext">添加一些任务开始你的计划吧！</p>
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
                    aria-label={todo.completed ? '标记为未完成' : '标记为已完成'}
                  >
                    {todo.completed && <span className="checkmark">✓</span>}
                  </button>
                  <span 
                    className="todoText"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  type="button"
                  className="deleteButton"
                  onClick={() => removeTodo(todo.id)}
                  aria-label="删除任务"
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
            <span className="totalCount">总计: {todos.length}</span>
            <span className="completedCount">已完成: {completedCount}</span>
            <span className="pendingCount">待完成: {pendingCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};