import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import krajina from './photos/krajina1.jpeg';
import krajina2 from './photos/krajina2.jpeg';
import krajina3 from './photos/krajina3.jpeg';
import kytice from './photos/kytice.jpeg';
import potok from './photos/potok.jpeg';
import leto from './photos/leto.jpeg';
import zapas from './photos/zapas.jpeg';
import potok2 from './photos/potok2.jpeg';

// Hero section images with titles
const heroImages = [
  { src: krajina, title: 'Krajina I' },
  { src: krajina2, title: 'Krajina II' },
  { src: krajina3, title: 'Krajina III' },
  { src: kytice, title: 'Kytice' },
  { src: potok, title: 'Potok' },
  { src: potok2, title: 'U potoka' },
  { src: leto, title: 'Léto' },
  { src: zapas, title: 'Zápas' },
];

// Preload an image and return a promise
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Resolve anyway to not block
    img.src = src;
  });
};

interface HeroProps {
  animationKey: number;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export function Hero({ animationKey, onFullscreenToggle }: HeroProps) {
  // Random image state
  const [currentImage, setCurrentImage] = useState(
      heroImages[Math.floor(Math.random() * heroImages.length)]
  );

  // Track if image is ready for smooth animation
  const [isImageReady, setIsImageReady] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Preload current image before starting animations
  useEffect(() => {
    setIsImageReady(false);

    preloadImage(currentImage.src).then(() => {
      // Small delay to ensure browser has decoded the image
      requestAnimationFrame(() => {
        setIsImageReady(true);
      });
    });
  }, [currentImage.src]);

  // Preload other hero images in background after initial load
  useEffect(() => {
    const preloadOthers = async () => {
      // Wait a bit before preloading others
      await new Promise(resolve => setTimeout(resolve, 2000));

      for (const img of heroImages) {
        if (img.src !== currentImage.src) {
          preloadImage(img.src);
        }
      }
    };

    preloadOthers();
  }, []); // Only on mount

  // Update image when animationKey changes
  useEffect(() => {
    const newImage = heroImages[Math.floor(Math.random() * heroImages.length)];
    setCurrentImage(newImage);
  }, [animationKey]);

  const handleTitleClick = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    onFullscreenToggle?.(newFullscreenState);
  };

  const exitFullscreen = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      onFullscreenToggle?.(false);
    }
  };

  // Exit fullscreen pÅ™i kliku kamkoliv
  useEffect(() => {
    if (!isFullscreen) return;

    const handleClick = (e: MouseEvent) => {
      // NeklikÃ¡me na title button
      const target = e.target as HTMLElement;
      if (target.closest('button[data-image-title]')) {
        return;
      }
      exitFullscreen();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isFullscreen]);

  // Exit fullscreen pÅ™i scrollu
  useEffect(() => {
    if (!isFullscreen) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        exitFullscreen();
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isFullscreen]);

  return (
      <section
          key={`hero-${animationKey}`}
          id="home"
          className="min-h-screen relative overflow-hidden flex items-center bg-black"
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          {/* Placeholder while image loads */}
          {!isImageReady && (
              <div className="absolute inset-0 bg-black" aria-hidden="true" />
          )}
          <motion.img
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: isImageReady ? 1 : 1.05, opacity: isImageReady ? 1 : 0 }}
              transition={{ duration: 3, delay: 0.2, ease: [0.25, 0.1, 0.25, 1]}}
              src={currentImage.src}
              alt={`Antonín Kroča - ${currentImage.title}`}
              className="w-full h-full object-cover hero-image" style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />
          <AnimatePresence mode="wait">
            {!isFullscreen && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-black/20"
                />
            )}
          </AnimatePresence>

          {/* Image title in bottom right corner - always visible and clickable */}
          <motion.button
              data-image-title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, delay: 1.4 }}
              onClick={handleTitleClick}
              className="absolute bottom-8 right-8 md:right-16 cursor-pointer hover:text-white transition-colors z-20"
          >
            <span className="text-white/60 text-sm md:text-base font-light tracking-wide">
              {currentImage.title}
            </span>
          </motion.button>
        </div>

        {/* Main content - hidden in fullscreen */}
        <AnimatePresence mode="wait">
          {!isFullscreen && (
              <motion.div
                  key="main-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    delay: 0
                  }}
                  className="relative z-10 w-full"
              >
                <div className="max-w-[1500px] mx-auto px-8 md:px-16">

                  {/* Main heading */}
                  <h1 className="text-white mb-20 leading-[0.92]">
                    <motion.div
                        key="heading-1"
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{
                          duration: 2.1,
                          delay: 1.1,
                          exit: { duration: 0.4, delay: 0 }
                        }}
                    >
                    <span className="block text-[16vw] md:text-[13vw] lg:text-[11vw] font-normal tracking-[-0.03em]">
                      GALERIE
                    </span>
                    </motion.div>

                    <motion.div
                        key="heading-2"
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{
                          duration: 2,
                          delay: 1.2,
                          exit: { duration: 0.4, delay: 0 }
                        }}
                    >
                    <span className="block text-[14vw] md:text-[11vw] lg:text-[9vw] font-light tracking-[-0.02em] text-white/70 italic">
                      Antonína Kroči
                    </span>
                    </motion.div>
                  </h1>

                  {/* Artist bio */}
                  <motion.div
                      key="bio"
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{
                        duration: 1.9,
                        delay: 1.3,
                        exit: { duration: 0.4, delay: 0 }
                      }}
                      className="max-w-xl space-y-6"
                  >
                    <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed">
                      Objevte intenzivní svět neoexpresionistického malíře,
                      jehož dílo odráží hloubku lidských emocí
                    </p>
                  </motion.div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator - hidden in fullscreen */}
        <AnimatePresence mode="wait">
          {!isFullscreen && (
              <motion.div
                  key="scroll-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut", delay: 0 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                  aria-hidden="true"
              >
                <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-light">
                  Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[1px] h-12 bg-white/20"
                />
              </motion.div>
          )}
        </AnimatePresence>
      </section>
  );
}