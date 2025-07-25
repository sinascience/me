"use client";
import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  const smoothScrollTo = useCallback((targetY: number, duration: number = 1000) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    const scroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startY + distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  }, []);

  const scrollToElement = useCallback((targetId: string) => {
    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      const headerOffset = 100; // Account for fixed navbar height + extra space
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      smoothScrollTo(offsetPosition, 800); // 800ms duration for smoother feel
    }
  }, [smoothScrollTo]);

  const handleSmoothClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href.startsWith('#')) {
      if (href === '#' || href === '#hero') {
        // Scroll to top for home
        smoothScrollTo(0, 800);
      } else {
        scrollToElement(href);
      }
    } else {
      // For external links, navigate normally
      window.location.href = href;
    }
  }, [scrollToElement, smoothScrollTo]);

  return { handleSmoothClick, scrollToElement };
};