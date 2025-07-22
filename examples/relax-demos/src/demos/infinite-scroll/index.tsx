import { useEffect, useRef, useCallback } from "react";
import { atom, selector, update, get } from "@relax/core";
import { useRelaxValue } from "@relax/react";
import { useTranslation } from "../../i18n/useTranslation";
import "./index.scss";

interface ListItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

// 定义状态
const listAtom = atom<ListItem[]>({
  defaultValue: [],
});

const loadingAtom = atom<boolean>({
  defaultValue: false,
});

const hasMoreAtom = atom<boolean>({
  defaultValue: true,
});

const pageAtom = atom<number>({
  defaultValue: 1,
});

// 选择器
const listLengthSelector = selector({
  get: (get) => get(listAtom)?.length || 0,
});



export const InfiniteScroll = () => {
  const t = useTranslation();
  const list = useRelaxValue(listAtom);
  const loading = useRelaxValue(loadingAtom);
  const hasMore = useRelaxValue(hasMoreAtom);
  const listLength = useRelaxValue(listLengthSelector);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 模拟API请求
  const fetchList = useCallback(async () => {
    const currentLoading = get(loadingAtom);
    const currentHasMore = get(hasMoreAtom);
    
    if (currentLoading || !currentHasMore) {
      return;
    }

    update(loadingAtom, true);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentPage = get(pageAtom) || 1;
    const currentList = get(listAtom) || [];
    
    // 模拟API数据
    const mockData: ListItem[] = Array.from({ length: 10 }, (_, index) => {
      const id = (currentPage - 1) * 10 + index + 1;
      return {
        id,
        title: `${t('itemTitle')} ${id}`,
        description: t('itemDescription', { id }),
        image: `https://picsum.photos/300/200?random=${id}`,
      };
    });

    update(listAtom, [...currentList, ...mockData]);
    update(pageAtom, currentPage + 1);
    
    // 模拟数据结束条件
    if (currentPage >= 5) {
      update(hasMoreAtom, false);
    }
    
    update(loadingAtom, false);
  }, [t]);

  // 重置列表
  const resetList = () => {
    update(listAtom, []);
    update(pageAtom, 1);
    update(hasMoreAtom, true);
    fetchList();
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
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
        <button 
          type="button"
          className="resetButton"
          onClick={resetList}
        >
          {t('resetButton')}
        </button>
      </div>

      <div className="infiniteScrollContent">
        <div className="listContainer">
          {list.map((item: ListItem) => (
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
          
          {!hasMore && listLength > 0 && (
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