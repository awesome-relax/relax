import './App.css';


import { TodoList } from './demos/todo-list';
import { InfiniteScroll } from './demos/infinite-scroll';
import { ModalDemo } from './demos/modal';
import { useState } from 'react';


const DEMOS = [
  {
    title: 'Todo List',
    component: TodoList,
  },
  {
    title: 'Infinite Scroll',
    component: InfiniteScroll,
  },
  {
    title: 'Modal Demo',
    component: ModalDemo,
  },
]

export function App() {
  const [selectedDemo, setSelectedDemo] = useState<typeof DEMOS[number] | null>(()=>DEMOS[0]);
  return (
    <div className="appContainer">
      <div className="appHeader">
        <h1>Relax Demos</h1>
      </div>
      <div className="appContent">
        <div className="appDemoTitle">
          {DEMOS.map((demo) => (
            <button 
              type="button"
              onClick={() => setSelectedDemo(demo)} 
              key={demo.title}
              className="demoButton"
            >
              {demo.title}
            </button>
          ))}
        </div>
        <div className="appDemo">
          {selectedDemo && <selectedDemo.component />}
        </div>
      </div>
    </div>
  );
}

export default App;
