import './index.scss';
import { atom, selector, update } from '@relax/core';
import { useRelaxValue } from '@relax/react';

interface ModalData {
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Modal visibility state
const modalVisibleAtom = atom<boolean>({
  defaultValue: false,
});

// Modal data state
const modalDataAtom = atom<ModalData>({
  defaultValue: {
    title: '',
    content: '',
    type: 'info',
  },
});

// Computed selector for modal class names
const modalClassSelector = selector({
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
const modalIconSelector = selector({
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
  const modalData = useRelaxValue(modalDataAtom);
  const { overlayClass, contentClass } = useRelaxValue(modalClassSelector);
  const modalIcon = useRelaxValue(modalIconSelector);

  const openModal = (type: ModalData['type'], title: string, content: string) => {
    console.log('openModal', type, title, content);
    update(modalDataAtom, { title, content, type });
    update(modalVisibleAtom, true);
  };
  console.log('modalData', modalData,overlayClass,contentClass);
  const closeModal = () => {
    update(modalVisibleAtom, false);
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
            onClick={() => openModal('info', 'Information', 'This is an information modal for displaying general information.')}
          >
            Info Modal
          </button>
          
          <button
            type="button"
            className="modalButton modalButtonSuccess"
            onClick={() => openModal('success', 'Success', 'Congratulations! Your operation has been completed successfully.')}
          >
            Success Modal
          </button>
          
          <button
            type="button"
            className="modalButton modalButtonWarning"
            onClick={() => openModal('warning', 'Warning', 'Please note that this operation may have some side effects.')}
          >
            Warning Modal
          </button>
          
          <button
            type="button"
            className="modalButton modalButtonError"
            onClick={() => openModal('error', 'Error', 'Sorry, the operation failed. Please try again later.')}
          >
            Error Modal
          </button>
        </div>

        <div className="modalDemoInfo">
          <h3 className="modalDemoInfoTitle">Features</h3>
          <ul className="modalDemoInfoList">
            <li>Use Relax state management to control modal display</li>
            <li>Support multiple modal types (info, success, warning, error)</li>
            <li>Click overlay or press ESC to close modal</li>
            <li>Responsive design, adapts to different screen sizes</li>
            <li>Use Selector to compute modal styles and icons</li>
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
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          <div className="modalBody">
            <p className="modalContent">{modalData.content}</p>
          </div>
          
          <div className="modalFooter">
            <button
              type="button"
              className="modalConfirmButton"
              onClick={closeModal}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 