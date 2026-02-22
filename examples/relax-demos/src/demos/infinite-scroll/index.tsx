import { atom, get, selector, update } from '@relaxjs/core';
import { useRelaxValue } from '@relaxjs/react';
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
const listAtom = selector<{ items: ListItem[]; hasMore: boolean }>({
  get: async (get, prev) => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentPage = get(pageAtom) ?? 0;
    if (currentPage === 0) {
      return {
        items: [],
        hasMore: true,
      };
    }
    // 模拟API数据
    const mockData: ListItem[] = Array.from({ length: 10 }, (_, index) => {
      const id = (currentPage - 1) * 10 + index + 1;
      return {
        id,
        title: `title ${id}`,
        description: `description ${id}`,
        image: `https://picsum.photos/300/200?random=${id}`,
      };
    });
    return {
      items: [...(prev?.items || []), ...mockData],
      hasMore: currentPage < 5,
    };
  },
});

const loadingAtom = atom<boolean>({
  defaultValue: false,
});

const pageAtom = atom<number>({
  defaultValue: 1,
});

export const InfiniteScroll = () => {
  const t = useTranslation();
  const { items, hasMore } = useRelaxValue(listAtom);
  const loading = useRelaxValue(loadingAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 模拟API请求
  const fetchList = useCallback(async () => {
    const currentLoading = get(loadingAtom);

    if (currentLoading || !hasMore) {
      return;
    }

    update(pageAtom, (prev) => (prev ?? 0) + 1);
  }, [hasMore]);

  // 重置列表
  const resetList = () => {
    update(pageAtom, 0);
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

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
