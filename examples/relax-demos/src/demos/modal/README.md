# Modal Demo

A demonstration component using Relax state management to control modal display and data rendering.

## Features

- **State Management**: Uses Relax's `atom` and `selector` to manage modal display state and data
- **Multiple Types**: Supports four modal types: info, success, warning, and error
- **Responsive Design**: Adapts to different screen sizes, mobile-friendly
- **Interactive Experience**: 
  - Click overlay to close modal
  - Click close button to close modal
  - Smooth animation transitions
- **Modern UI**: Uses gradient colors and shadow effects for excellent visual experience

## Technical Implementation

### State Management

```typescript
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
```

### Computed Properties

```typescript
// Compute modal style class names
const modalClassSelector = selector({
  get: (get) => {
    const data = get(modalDataAtom);
    const visible = get(modalVisibleAtom);
    return {
      overlayClass: `modalOverlay ${visible ? 'modalOverlayVisible' : ''}`,
      contentClass: `modalContent modalContent${data?.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Info'}`,
    };
  },
});

// Compute modal icon
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
```

### Component Usage

```typescript
export const ModalDemo = () => {
  const modalData = useRelaxValue(modalDataAtom);
  const { overlayClass, contentClass } = useRelaxValue(modalClassSelector);
  const modalIcon = useRelaxValue(modalIconSelector);

  const openModal = (type: ModalData['type'], title: string, content: string) => {
    update(modalDataAtom, { title, content, type });
    update(modalVisibleAtom, true);
  };

  const closeModal = () => {
    update(modalVisibleAtom, false);
  };
  
  // ... component rendering logic
};
```

## Usage

1. Click different type buttons to open corresponding modal types
2. Modal will display corresponding icon, title and content
3. Click overlay or close button to close modal

## Style Features

- Uses CSS Grid layout for responsive button arrangement
- Gradient backgrounds and shadow effects enhance visual hierarchy
- Smooth transition animations improve user experience
- Mobile-optimized touch interactions

## File Structure

```
modal/
├── index.tsx      # Modal component main file
├── index.scss     # Style file
└── README.md      # Documentation
``` 