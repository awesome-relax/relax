import { action, computed, state } from '@relax-state/core';
import { useRelaxValue } from '@relax-state/react';
import {  useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import './index.scss';

interface ListItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

// 定义状态
const listAtom = state<ListItem[]>([]);
const loadingAtom = state<boolean>(false);
const pageAtom = state<number>(1);

// 计算状态：判断是否还有更多数据
const hasMoreAtom = computed<boolean>({
  get: (get) => {
    const currentPage = get(pageAtom);
    return currentPage < 5;
  },
});

// 模拟API请求
const fetchMockData = (page: number): ListItem[] => {
  return Array.from({ length: 10 }, (_, index) => {
    const id = (page - 1) * 10 + index + 1;
    return {
      id,
      title: `title ${id}`,
      description: `description ${id}`,
      image: `https://picsum.photos/300/200?random=${id}`,
    };
  });
};
const fetchList = action(({loading, hasMore}: {loading: boolean, hasMore: boolean}, store) => {
  if (loading || !hasMore) {
    return;
  }

  store.set(loadingAtom, true);
  
  setTimeout(() => {
    const currentPage = store.get(pageAtom);
    const newData = fetchMockData(currentPage);
    const currentItems = store.get(listAtom);
    store.set(listAtom, [...currentItems, ...newData]);
    store.set(pageAtom, currentPage + 1);
    store.set(loadingAtom, false);
  }, 1000);
});
const resetList = action((_:null,store) => {
  store.set(pageAtom, 1);
  store.set(listAtom, []);
}, { name: 'infinite-scroll/resetList' });
export const InfiniteScroll = () => {
  const t = useTranslation();
  const items = useRelaxValue(listAtom);
  const loading = useRelaxValue(loadingAtom);
  const hasMore = useRelaxValue(hasMoreAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

 

  useEffect(() => {
    if (items.length === 0 && !loading) {
      fetchList({loading: false, hasMore: true});
    }
  }, [items.length, loading]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        fetchList({loading: false, hasMore: true});
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading,]);

  return (
    <div className="infiniteScroll">
      <div className="infiniteScrollHeader">
        <h2 className="infiniteScrollTitle">{t('title')}</h2>
        <p className="infiniteScrollSubtitle">{t('subtitle')}</p>
        <button type="button" className="resetButton" onClick={() => resetList(null)}>
          {t('resetButton')}
        </button>
      </div>

      <div className="infiniteScrollContent">
        <div className="listContainer">
          {items.map((item: ListItem) => (
            <div key={item.id} className="listItem">
              <div className="itemImage">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="itemContent">
                <h3 className="itemTitle">{item.title}</h3>
                <p className="itemDescription">{item.description}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="loadingIndicator">
              <div className="loadingSpinner"></div>
              <span className="loadingText">{t('loading')}</span>
            </div>
          )}

          {!hasMore && items.length > 0 && (
            <div className="endIndicator">
              <span className="endText">{t('noMoreData')}</span>
            </div>
          )}

          <div ref={containerRef} className="observerTarget"></div>
        </div>
      </div>
    </div>
  );
};
