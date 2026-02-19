import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { scrollToSection } from "./utils/scrollToSection.ts";


import kresbaAkt from "./photos/22.jpeg";
import hukvaldy1 from "./photos/75.jpeg";
import potok1 from "./photos/91.jpeg";
import zabijacka from "./photos/103.jpeg";
import milada from "./photos/milada.jpeg";
import kytice from "./photos/1351.jpeg";

const artworks = [
  {
    id: 1,
    title: "Sedící akt",
    year: "1998",
    dimensions: "100 × 70 cm",
    medium: "Uhel, papír",
    image: kresbaAkt,
    span: "md:col-span-1 md:row-span-2", // portrét
  },
  {
    id: 2,
    title: "Hukvaldy",
    year: "2007",
    dimensions: "61 × 80 cm",
    medium: "Olej, sololit",
    image: hukvaldy1,
    span: "md:col-span-2 md:row-span-1", // na šířku
  },
  {
    id: 3,
    title: "Potok",
    year: "2016",
    dimensions: "61 × 80 cm",
    medium: "Olej, sololit",
    image: potok1,
    span: "md:col-span-2 md:row-span-1", // na šířku
  },
  {
    id: 4,
    title: "Zátiší s kyticí ve váze",
    year: "Nedatováno",
    dimensions: "93 × 62 cm",
    medium: "Olej, sololit",
    image: kytice,
    span: "md:col-span-1 md:row-span-2", // portrét
  },
  {
    id: 5,
    title: "Velká zabíjačka",
    year: "1982",
    dimensions: "240 × 400 cm",
    medium: "Olej na plátně",
    image: zabijacka,
    span: "md:col-span-3 md:row-span-2", // extra široký
  },
  {
    id: 6,
    title: "Milada",
    year: "Nedatováno",
    dimensions: "65 × 50 cm",
    medium: "Olej, sololit",
    image: milada,
    span: "md:col-span-1 md:row-span-1", // čtvercový
  },
];

export function Gallery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<(typeof artworks)[0] | null>(null);

  // --- Swipe-driven animation state ---
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDir, setSwipeDir] = useState<"next" | "prev" | null>(null);

  // --- Swipe refs ---
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const touchDeltaY = useRef(0);

  // --- Focus trap refs ---
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const goToPrevious = useCallback(() => {
    if (!selectedArtwork) return;
    const currentIndex = artworks.findIndex((a) => a.id === selectedArtwork.id);
    const previousIndex = currentIndex === 0 ? artworks.length - 1 : currentIndex - 1;
    setSelectedArtwork(artworks[previousIndex]);
  }, [selectedArtwork]);

  const goToNext = useCallback(() => {
    if (!selectedArtwork) return;
    const currentIndex = artworks.findIndex((a) => a.id === selectedArtwork.id);
    const nextIndex = currentIndex === artworks.length - 1 ? 0 : currentIndex + 1;
    setSelectedArtwork(artworks[nextIndex]);
  }, [selectedArtwork]);

  // Keyboard shortcuts and focus trap for lightbox
  useEffect(() => {
    if (!selectedArtwork) return;

    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      else if (e.key === "ArrowRight") goToNext();
      else if (e.key === "Escape") setSelectedArtwork(null);

      // Focus trap - only Tab key
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedArtwork, goToPrevious, goToNext]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!selectedArtwork) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [selectedArtwork]);

  // --- Touch handlers (swipe) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches?.[0];
    if (!t) return;

    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;

    setIsDragging(true);
    setDragX(0);
    setSwipeDir(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return;

    const t = e.touches?.[0];
    if (!t) return;

    touchDeltaX.current = t.clientX - touchStartX.current;
    touchDeltaY.current = t.clientY - touchStartY.current;

    const dx = touchDeltaX.current;
    const dy = touchDeltaY.current;

    // Only treat as swipe if it's primarily horizontal (avoid breaking vertical scroll)
    if (Math.abs(dx) > Math.abs(dy) * 1.1) {
      setDragX(dx);
      setSwipeDir(dx < 0 ? "next" : "prev");
    }
  };

  const handleTouchEnd = () => {
    const dx = touchDeltaX.current;
    const dy = touchDeltaY.current;

    // reset refs
    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;

    setIsDragging(false);

    const MIN_SWIPE_X = 60;
    const HORIZONTAL_DOMINANCE = 1.2;

    const shouldSwipe =
        Math.abs(dx) >= MIN_SWIPE_X && Math.abs(dx) >= Math.abs(dy) * HORIZONTAL_DOMINANCE;

    if (!shouldSwipe) {
      setDragX(0);
      setSwipeDir(null);
      return;
    }

    const dir: "next" | "prev" = dx < 0 ? "next" : "prev";
    setSwipeDir(dir);

    // Push out in swipe direction, then switch
    const pushOut = dir === "next" ? -window.innerWidth : window.innerWidth;
    setDragX(pushOut);

    window.setTimeout(() => {
      if (dir === "next") goToNext();
      else goToPrevious();

      // prepare next card at center
      setDragX(0);

      // keep direction briefly so the new image can enter from correct side
      window.setTimeout(() => setSwipeDir(null), 60);
    }, 140);
  };

  return (
      <section id="gallery" className="py-24 md:py-32 bg-black relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-20"
          >
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="h-px bg-white mb-6"
            />
            <div>
              <span className="block uppercase tracking-[0.2em] text-sm text-gray-400 mb-6">Kolekce</span>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <h2 className="text-5xl md:text-6xl lg:text-7xl leading-tight text-white">Významná díla</h2>
                <p className="text-xl text-gray-400 max-w-xl">
                  Výběr z rozsáhlé tvorby zachycující emocionální sílu neoexpresionismu.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-4">
            {artworks.map((artwork, index) => (
                <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    className={`gallery-card group relative overflow-hidden bg-black ${artwork.span} cursor-pointer`}
                    onMouseEnter={() => setHoveredId(artwork.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedArtwork(artwork)}
                >
                  {/* Number indicator */}
                  <div className="absolute top-6 left-6 z-20 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredId === artwork.id ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-white/40 text-sm font-mono"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.div>
                  </div>

                  {/* Image wrapper */}
                  <motion.div
                      animate={{ scale: hoveredId === artwork.id ? 1.1 : 1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="w-full h-full"
                  >
                    <ImageWithFallback src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                  </motion.div>

                  {/* Gradient border reveal */}
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === artwork.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                            "linear-gradient(45deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.3) 100%)",
                        backgroundSize: "200% 200%",
                        animation: hoveredId === artwork.id ? "shimmer 2s infinite" : "none",
                      }}
                  />

                  {/* Overlay info */}
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === artwork.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none"
                  >
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      {/* Top info */}
                      <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{
                            opacity: hoveredId === artwork.id ? 1 : 0,
                            y: hoveredId === artwork.id ? 0 : -20,
                          }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="flex justify-between items-start"
                      >
                        <div className="text-white/60 text-sm font-mono">{String(index + 1).padStart(2, "0")}</div>
                        <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white/80 text-xs">
                          {artwork.year}
                        </div>
                      </motion.div>

                      {/* Bottom info */}
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: hoveredId === artwork.id ? 1 : 0,
                            y: hoveredId === artwork.id ? 0 : 20,
                          }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="text-white"
                      >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: hoveredId === artwork.id ? 64 : 0 }}
                            transition={{ duration: 0.5 }}
                            className="h-px bg-white mb-4"
                        />
                        <h3 className="text-2xl md:text-3xl mb-3 tracking-tight">{artwork.title}</h3>
                        <div className="space-y-1 text-sm text-white/70">
                          <p>{artwork.medium}</p>
                          <p>{artwork.dimensions}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
                          <span>Klikněte pro detail</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-20 text-center"
          >
            <button
                onClick={() => scrollToSection("contact")}
                className="inline-block p-10 border-2 border-white relative overflow-hidden group cursor-pointer hover:border-white/80 transition-colors"
            >
              <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <div className="relative z-10 group-hover:text-black transition-colors duration-300">
                <p className="text-lg mb-2 opacity-70 group-hover:opacity-100 transition-opacity">Zajímá vás více o dostupných dílech?</p>
                <p className="text-3xl font-light">Kontaktujte nás</p>
              </div>
            </button>
          </motion.div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {selectedArtwork && (
                <motion.div
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="artwork-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedArtwork(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[120] flex items-center justify-center p-4 sm:p-6"
                >
                  {/* Close button */}
                  <motion.button
                      ref={closeButtonRef}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => setSelectedArtwork(null)}
                      aria-label="Zavřít"
                      className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 z-10 cursor-pointer"
                  >
                    <X className="w-6 h-6" aria-hidden="true" />
                  </motion.button>

                  {/* Prev/Next buttons: hide on mobile */}
                  <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.2 }}
                      aria-label="Předchozí dílo"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSwipeDir("prev");
                        goToPrevious();
                      }}
                      className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 z-10 group cursor-pointer"
                  >
                    <ChevronLeft className="w-7 h-7 transition-transform group-hover:-translate-x-0.5" />
                  </motion.button>

                  <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: 0.2 }}
                      aria-label="Další dílo"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSwipeDir("next");
                        goToNext();
                      }}
                      className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 z-10 group cursor-pointer"
                  >
                    <ChevronRight className="w-7 h-7 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>

                  {/* Scrollable + swipeable modal content */}
                  <div
                      className="w-full max-w-7xl max-h-[85vh] overflow-y-auto overscroll-contain rounded-xl"
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                  >
                    <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-start p-4 sm:p-6">
                      {/* Image (swipe-driven) */}
                      <motion.div
                          key={selectedArtwork.id}
                          initial={{
                            opacity: 0,
                            x: swipeDir === "next" ? 80 : -80,
                          }}
                          animate={{
                            x: isDragging ? dragX : 0,
                            opacity: isDragging ? Math.max(0.4, 1 - Math.abs(dragX) / 400) : 1,
                          }}
                          exit={{
                            opacity: 0,
                            x: swipeDir === "prev" ? 120 : -120,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 30,
                          }}
                          className="relative"
                      >
                        <img
                            src={selectedArtwork.image}
                            alt={selectedArtwork.title}
                            className="w-full h-auto max-h-[70vh] lg:max-h-[80vh] object-contain"
                        />
                      </motion.div>

                      {/* Details */}
                      <motion.div
                          key={`details-${selectedArtwork.id}`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          transition={{ delay: 0.3 }}
                          className="text-white space-y-8 pb-2"
                      >
                        <div>
                          <div className="text-sm text-white/40 font-mono mb-4">
                            {String(artworks.findIndex((a) => a.id === selectedArtwork.id) + 1).padStart(2, "0")} /{" "}
                            {String(artworks.length).padStart(2, "0")}
                          </div>
                          <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: 64 }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                              className="h-px bg-white mb-6"
                          />
                          <h2 id="artwork-title" className="text-5xl md:text-6xl mb-4 tracking-tight">{selectedArtwork.title}</h2>
                          <p className="text-2xl text-white/60">{selectedArtwork.year}</p>
                        </div>

                        <div className="space-y-4 text-lg">
                          <div className="flex items-start gap-4">
                            <span className="text-white/40 min-w-[120px]">Technika</span>
                            <span>{selectedArtwork.medium}</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <span className="text-white/40 min-w-[120px]">Rozměry</span>
                            <span>{selectedArtwork.dimensions}</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <span className="text-white/40 min-w-[120px]">Rok</span>
                            <span>{selectedArtwork.year}</span>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                          <p className="text-white/70 leading-relaxed mb-6">
                            Toto dílo je součástí osobní kolekce rodiny a může být k dispozici pro výstavy nebo akvizice. Pro
                            více informací nás prosím kontaktujte.
                          </p>

                          <button
                              onClick={() => {
                                setSelectedArtwork(null);
                                scrollToSection("contact");
                              }}
                              className="px-8 py-3 bg-white text-black hover:bg-white/90 transition-colors duration-300 cursor-pointer"
                          >
                            Kontaktovat
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
            )}
          </AnimatePresence>

          <style>{`
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        </div>
      </section>
  );
}