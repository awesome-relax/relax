import { computed, state } from '@relax-state/core';
import { useRelaxValue } from '@relax-state/react';
import { DefultStore } from '@relax-state/store';
import { useCallback, useEffect, useRef } from 'react';
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

export const InfiniteScroll = () => {
  const t = useTranslation();
  const items = useRelaxValue(listAtom);
  const loading = useRelaxValue(loadingAtom);
  const hasMore = useRelaxValue(hasMoreAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 模拟API请求
  const fetchList = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }

    DefultStore.set(loadingAtom, true);

    // 模拟网络延迟
    setTimeout(() => {
      const currentPage = DefultStore.get(pageAtom);
      const newData = fetchMockData(currentPage);
      const currentItems = DefultStore.get(listAtom);
      DefultStore.set(listAtom, [...currentItems, ...newData]);
      DefultStore.set(pageAtom, currentPage + 1);
      DefultStore.set(loadingAtom, false);
    }, 1000);
  }, [loading, hasMore]);

  // 重置列表
  const resetList = () => {
    DefultStore.set(pageAtom, 1);
    DefultStore.set(listAtom, []);
  };

  useEffect(() => {
    if (items.length === 0 && !loading) {
      fetchList();
    }
  }, [items.length, loading, fetchList]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        fetchList();
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
  }, [hasMore, loading, fetchList]);

  return (
    <div className="infiniteScroll">
      <div className="infiniteScrollHeader">
        <h2 className="infiniteScrollTitle">{t('title')}</h2>
        <p className="infiniteScrollSubtitle">{t('subtitle')}</p>
        <button type="button" className="resetButton" onClick={resetList}>
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
