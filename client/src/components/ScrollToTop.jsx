import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      // Reset scroll position on all scrollable elements in the page
      try {
        const scrollableElements = document.querySelectorAll('*');
        scrollableElements.forEach(el => {
          if (el.scrollTop > 0) {
            el.scrollTop = 0;
          }
        });
      } catch (e) {
        console.error('ScrollToTop reset error:', e);
      }
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If element is not in DOM yet (due to dynamic React rendering),
        // try again after a brief timeout.
        const timer = setTimeout(() => {
          const delayedElement = document.getElementById(id);
          if (delayedElement) {
            delayedElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
