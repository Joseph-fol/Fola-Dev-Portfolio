import { useEffect } from 'react';
import { useWindow } from '../context/WindowContext';

export default function usePageTitle(widgetId, title) {
  const { windows } = useWindow();
  
  useEffect(() => {
    const widgetState = windows[widgetId];
    
    if (widgetState?.isFocused) {
      document.title = `${title} | Developer Portfolio`;
    }
  }, [widgetId, title, windows]);
}
