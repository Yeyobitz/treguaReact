import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useSmoothScroll() {
  const navigate = useNavigate();

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior,
    });
  }, []);

  const smoothNavigate = useCallback((to: string) => {
    navigate(to);
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => scrollToTop(), 100);
  }, [navigate, scrollToTop]);

  return { scrollToTop, smoothNavigate };
}