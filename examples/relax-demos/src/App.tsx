import './App.css';

import { TodoList } from './demos/todo-list';
import { InfiniteScroll } from './demos/infinite-scroll';
import { ModalDemo } from './demos/modal';
import { LanguageSwitcher } from './i18n/LanguageSwitcher';
import { useTranslation } from './i18n/useTranslation';
import { useState } from 'react';

const DEMOS = [
  {
    titleKey: 'todoListTitle',
    component: TodoList,
  },
  {
    titleKey: 'infiniteScrollTitle',
    component: InfiniteScroll,
  },
  {
    titleKey: 'modalTitle',
    component: ModalDemo,
  },
];

export function App() {
  const t = useTranslation();
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number>(0);

  return (
    <div className="appContainer">
      <div className="appHeader">
        <h1>{t('appTitle')}</h1>
        <LanguageSwitcher />
      </div>
      <div className="appContent">
        <div className="appDemoTitle">
          {DEMOS.map((demo, index) => (
            <button
              type="button"
              onClick={() => setSelectedDemoIndex(index)}
              key={`demo-${index}`}
              className={`demoButton ${selectedDemoIndex === index ? 'active' : ''}`}
            >
              {t(demo.titleKey)}
            </button>
          ))}
        </div>
        <div className="appDemo">
          {(() => {
            const DemoComponent = DEMOS[selectedDemoIndex].component;
            return <DemoComponent />;
          })()}
        </div>
      </div>
    </div>
  );
}

export default App;
