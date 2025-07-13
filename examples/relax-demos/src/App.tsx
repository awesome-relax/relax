import './App.css';


import { TodoList } from './demos/todo-list';


export function App() {

  return (
    <div className="appContainer">
      <div className="appHeader">
        <h1>Relax Demos</h1>
      </div>
      <div className="appContent">
        <ul className="appDemoTitle">
          <li>Todo List</li>
        </ul>
        <div className="appDemo">
        <TodoList />
        </div>
      </div>
    </div>
  );
}

export default App;
