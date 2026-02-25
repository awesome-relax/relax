import './index.scss';
import { computed, state } from '@relax-state/core';
import { DefultStore } from '@relax-state/store';
import { useRelaxValue } from '@relax-state/react';
import { useTranslation } from '../../i18n/useTranslation';

interface ModalData {
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Modal visibility state
const modalVisibleAtom = state<boolean>(false);

// Modal data state
const modalDataAtom = state<ModalData>({
  title: '',
  content: '',
  type: 'info',
});

// Computed selector for modal class names
const modalClassSelector = computed<{
  modalClass: string;
  overlayClass: string;
  contentClass: string;
}>({
  get: (get) => {
    const data = get(modalDataAtom);
    const visible = get(modalVisibleAtom);
    console.log('modalClassSelector', data, visible);
    return {
      modalClass: `modal ${visible ? 'modalVisible' : ''}`,
      overlayClass: `modalOverlay ${visible ? 'modalOverlayVisible' : ''}`,
      contentClass: `modalContent modalContent${data?.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Info'}`,
    };
  },
});

// Computed selector for modal icon
const modalIconSelector = computed<string>({
  get: (get) => {
    const data = get(modalDataAtom);
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };
    return icons[data?.type || 'info'];
  },
});

export const ModalDemo = () => {
  const t = useTranslation();
  const modalData = useRelaxValue(modalDataAtom);
  const { overlayClass, contentClass } = useRelaxValue(modalClassSelector);
  const modalIcon = useRelaxValue(modalIconSelector);

  const openModal = (type: ModalData['type']) => {
    const titleKey = `${type}Title`;
    const contentKey = `${type}Content`;
    DefultStore.set(modalDataAtom, {
      title: t(titleKey),
      content: t(contentKey),
      type,
    });
    DefultStore.set(modalVisibleAtom, true);
  };
  console.log('modalData', modalData, overlayClass, contentClass);
  const closeModal = () => {
    DefultStore.set(modalVisibleAtom, false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="modalDemo">
      <div className="modalDemoHeader">
        <h2 className="modalDemoTitle">Modal Demo</h2>
        <p className="modalDemoSubtitle">Using Relax to control modal display and data rendering</p>
      </div>

      <div className="modalDemoContent">
        <div className="modalButtons">
          <button
            type="button"
            className="modalButton modalButtonInfo"
            onClick={() => openModal('info')}
          >
            {t('infoModal')}
          </button>

          <button
            type="button"
            className="modalButton modalButtonSuccess"
            onClick={() => openModal('success')}
          >
            {t('successModal')}
          </button>

          <button
            type="button"
            className="modalButton modalButtonWarning"
            onClick={() => openModal('warning')}
          >
            {t('warningModal')}
          </button>

          <button
            type="button"
            className="modalButton modalButtonError"
            onClick={() => openModal('error')}
          >
            {t('errorModal')}
          </button>
        </div>

        <div className="modalDemoInfo">
          <h3 className="modalDemoInfoTitle">{t('features')}</h3>
          <ul className="modalDemoInfoList">
            <li>{t('feature1')}</li>
            <li>{t('feature2')}</li>
            <li>{t('feature3')}</li>
            <li>{t('feature4')}</li>
            <li>{t('feature5')}</li>
          </ul>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className={overlayClass} onClick={handleOverlayClick}>
        <div className={contentClass}>
          <div className="modalHeader">
            <div className="modalIcon">{modalIcon}</div>
            <h3 className="modalTitle">{modalData.title}</h3>
            <button
              type="button"
              className="modalCloseButton"
              onClick={closeModal}
              aria-label={t('closeModal')}
            >
              ×
            </button>
          </div>

          <div className="modalBody">
            <p className="modalContent">{modalData.content}</p>
          </div>

          <div className="modalFooter">
            <button type="button" className="modalConfirmButton" onClick={closeModal}>
              {t('confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
