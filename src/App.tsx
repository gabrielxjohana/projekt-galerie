import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './Header';
import { Hero } from './Hero';
import { About } from './About';
import { Gallery } from './Gallery';
import { Exhibitions } from './Exhibitions';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { BackToTop } from './Backtotop.tsx';
import { AutoScrollProvider } from './contexts/AutoScrollContext';
import './globals.css';

function AppContent() {
    const [animationKey, setAnimationKey] = useState(0);
    const [isResetting, setIsResetting] = useState(false);
    const [isHeroFullscreen, setIsHeroFullscreen] = useState(false);
    const [isReturningFromFullscreen, setIsReturningFromFullscreen] = useState(false);

    const handleLogoClick = useCallback(() => {
        // Prevence vícenásobného kliknutí
        if (isResetting) return;

        setIsResetting(true);

        // Scroll nahoru až po kompletním fade-in (po 600ms)
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, 600);

        // Změna obrázku těsně po scrollu
        setTimeout(() => {
            setAnimationKey(prev => prev + 1);
        }, 650);

        // Konec fade overlay - drÅ¾Ã­me Äernou dÃ©le, pak fade-out
        setTimeout(() => {
            setIsResetting(false);
        }, 1200);
    }, [isResetting]);

    const handleFullscreenToggle = useCallback((isFullscreen: boolean) => {
        setIsHeroFullscreen(isFullscreen);
        // Pokud se vracíme z fullscreen (false = nÃ¡vrat)
        if (!isFullscreen) {
            setIsReturningFromFullscreen(true);
            // Reset flagu po dokonÄenÃ­ animace
            setTimeout(() => {
                setIsReturningFromFullscreen(false);
            }, 600);
        }
    }, []);

    return (
        <div className="min-h-screen bg-black text-white relative">
            {/* Skip to content link for keyboard users */}
            <a
                href="#about"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
            >
                PÅ™eskoÄit na obsah
            </a>

            <Header
                animationKey={animationKey}
                onLogoClick={handleLogoClick}
                isHidden={isHeroFullscreen || isResetting}
                isReturningFromFullscreen={isReturningFromFullscreen}
            />
            <main id="main-content">
                <Hero
                    animationKey={animationKey}
                    onFullscreenToggle={handleFullscreenToggle}
                />
                <About />
                <Exhibitions />
                <Gallery />
                <Contact />
            </main>
            <Footer />
            <BackToTop />

            {/* Fade overlay */}
            <AnimatePresence>
                {isResetting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="fixed inset-0 bg-black z-[150] pointer-events-none"
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function App() {
    return (
        <AutoScrollProvider>
            <AppContent />
        </AutoScrollProvider>
    );
}

export default App;