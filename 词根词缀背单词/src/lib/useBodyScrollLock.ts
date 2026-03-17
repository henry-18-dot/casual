import { useEffect } from 'react';
import { lockBodyScroll, unlockBodyScroll } from './scrollLock';

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [active]);
}
