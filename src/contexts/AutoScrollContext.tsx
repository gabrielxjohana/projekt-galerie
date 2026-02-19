// contexts/AutoScrollContext.tsx
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface AutoScrollContextType {
  isAutoScrolling: boolean;
  startAutoScroll: () => void;
  endAutoScroll: () => void;
}

const AutoScrollContext = createContext<AutoScrollContextType | null>(null);

// Custom event names for cross-component communication
const AUTO_SCROLL_START_EVENT = 'autoscroll:start';
const AUTO_SCROLL_END_EVENT = 'autoscroll:end';

/**
 * Dispatch auto-scroll events from anywhere (including non-React code)
 */
export function dispatchAutoScrollStart() {
  window.dispatchEvent(new CustomEvent(AUTO_SCROLL_START_EVENT));
}

export function dispatchAutoScrollEnd() {
  window.dispatchEvent(new CustomEvent(AUTO_SCROLL_END_EVENT));
}

interface AutoScrollProviderProps {
  children: ReactNode;
}

export function AutoScrollProvider({ children }: AutoScrollProviderProps) {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const startAutoScroll = useCallback(() => {
    setIsAutoScrolling(true);
  }, []);

  const endAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
  }, []);

  // Listen for custom events from scrollToSection utility
  useEffect(() => {
    const handleStart = () => setIsAutoScrolling(true);
    const handleEnd = () => setIsAutoScrolling(false);

    window.addEventListener(AUTO_SCROLL_START_EVENT, handleStart);
    window.addEventListener(AUTO_SCROLL_END_EVENT, handleEnd);

    return () => {
      window.removeEventListener(AUTO_SCROLL_START_EVENT, handleStart);
      window.removeEventListener(AUTO_SCROLL_END_EVENT, handleEnd);
    };
  }, []);

  return (
    <AutoScrollContext.Provider value={{ isAutoScrolling, startAutoScroll, endAutoScroll }}>
      {children}
    </AutoScrollContext.Provider>
  );
}

export function useAutoScroll(): AutoScrollContextType {
  const context = useContext(AutoScrollContext);
  if (!context) {
    throw new Error('useAutoScroll must be used within an AutoScrollProvider');
  }
  return context;
}
