import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { useAutoScroll } from './contexts/AutoScrollContext';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { isAutoScrolling, startAutoScroll, endAutoScroll } = useAutoScroll();

    useEffect(() => {
        const toggleVisibility = () => {
            // Zobrazit tlačítko po scrollu o 500px
            setIsVisible(window.scrollY > 500);
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });

        // Initial check
        toggleVisibility();

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = useCallback(() => {
        // Signalizovat začátek programového scrollu - zamrazí banner
        startAutoScroll();

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // Počkat na dokončení scrollu a pak uvolnit banner
        // Používáme scrollend event s fallbackem na timeout
        let cleaned = false;

        const cleanup = () => {
            if (cleaned) return;
            cleaned = true;
            window.removeEventListener('scrollend', handleScrollEnd);
            // Malá prodleva před uvolněním banneru
            setTimeout(() => endAutoScroll(), 100);
        };

        const handleScrollEnd = () => cleanup();

        if ('onscrollend' in window) {
            window.addEventListener('scrollend', handleScrollEnd, { once: true });
        }

        // Fallback timeout (max 2s pro scroll nahoru)
        setTimeout(cleanup, 2000);
    }, [startAutoScroll, endAutoScroll]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={scrollToTop}
                    aria-label="Zpět nahoru"
                    className="fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer group"
                >
                    <ChevronUp className="w-6 h-6 transition-transform group-hover:-translate-y-0.5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}