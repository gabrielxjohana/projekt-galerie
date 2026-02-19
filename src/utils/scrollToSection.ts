// utils/scrollToSection.ts
import { dispatchAutoScrollStart, dispatchAutoScrollEnd } from '../contexts/AutoScrollContext';

/**
 * Scrolluje na sekci s daným ID.
 * 
 * - Používá nativní scrollIntoView s CSS scroll-margin-top pro offset
 * - Signalizuje start/end auto-scrollu přes custom events
 * - Header.tsx poslouchá tyto eventy a zamrazí změny výšky banneru během scrollu
 */
export function scrollToSection(id: string): void {
  const element = document.getElementById(id);

  if (!element) {
    console.warn(`[scrollToSection] Element with id="${id}" not found`);
    return;
  }

  // Signal start of programmatic scroll
  dispatchAutoScrollStart();

  // Track cleanup state to prevent multiple calls
  let cleanedUp = false;
  let stabilityInterval: ReturnType<typeof setInterval> | null = null;
  let maxTimeout: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;

    if (stabilityInterval) {
      clearInterval(stabilityInterval);
      stabilityInterval = null;
    }
    if (maxTimeout) {
      clearTimeout(maxTimeout);
      maxTimeout = null;
    }
    window.removeEventListener('scrollend', handleScrollEnd);
    
    // Delay before re-enabling banner changes to let layout fully settle
    // This prevents the banner from changing immediately after scroll ends
    setTimeout(() => {
      dispatchAutoScrollEnd();
    }, 250);
  };

  // Modern browsers: use scrollend event
  const handleScrollEnd = () => {
    cleanup();
  };

  // Fallback: poll for scroll position stability
  let lastScrollY = window.scrollY;
  let stabilityCount = 0;
  const STABILITY_THRESHOLD = 5; // Need 5 consecutive stable readings (~250ms)
  
  const checkStability = () => {
    if (cleanedUp) return;
    
    const currentScrollY = window.scrollY;
    
    if (Math.abs(currentScrollY - lastScrollY) < 1) {
      stabilityCount++;
      if (stabilityCount >= STABILITY_THRESHOLD) {
        cleanup();
      }
    } else {
      stabilityCount = 0;
      lastScrollY = currentScrollY;
    }
  };

  // Setup scroll end detection
  if ('onscrollend' in window) {
    // Modern browsers - use scrollend event with fallback
    window.addEventListener('scrollend', handleScrollEnd, { once: true });
  }
  
  // Always poll as backup (scrollend might not fire if already at position)
  stabilityInterval = setInterval(checkStability, 50);

  // Maximum timeout to ensure we always clean up (3 seconds should be enough for any scroll)
  maxTimeout = setTimeout(() => {
    cleanup();
  }, 3000);

  // Perform the scroll - CSS scroll-margin-top handles the offset
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
