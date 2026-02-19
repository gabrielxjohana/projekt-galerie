import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";

import podpis from "./photos/podpis bily.png";
import { getActiveExhibitions } from "./exhibitionsData.ts";
import { scrollToSection as scrollToSectionUtil } from "./utils/scrollToSection";
import { useAutoScroll } from "./contexts/AutoScrollContext";

const MARQUEE_HOLD_START_MS = 1800;
const MARQUEE_SCROLL_LEFT_MS = 7500; // odpovídá duration 7.5s
const MARQUEE_GAP_MS = 250;
const MARQUEE_SLIDE_IN_MS = 3000; // odpovídá duration 3.0s
const MARQUEE_HOLD_END_MS = 1600;

const MARQUEE_CYCLE_MS =
    MARQUEE_HOLD_START_MS +
    MARQUEE_SCROLL_LEFT_MS +
    MARQUEE_GAP_MS +
    MARQUEE_SLIDE_IN_MS +
    MARQUEE_HOLD_END_MS;

// malá rezerva, aby se to nikdy nepřepnulo "v půlce" kvůli setTimeout driftu
const ROTATE_BUFFER_MS = 300;

interface HeaderProps {
  animationKey: number;
  onLogoClick: () => void;
  isHidden?: boolean;
  isReturningFromFullscreen?: boolean;
}

export function Header({
                         animationKey,
                         onLogoClick,
                         isHidden,
                         isReturningFromFullscreen,
                       }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentExhibitionIndex, setCurrentExhibitionIndex] = useState(0);

  // Ruční skrývač banneru (zůstane skryté do refresh nebo do dalšího kliknutí na šipku)
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Auto-scroll context - for menu close behavior during programmatic scroll
  const { isAutoScrolling } = useAutoScroll();

  const headerRef = useRef<HTMLDivElement | null>(null);

  // Flag to prevent scroll listener from interfering during programmatic navigation
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (!headerRef.current) return;

    const el = headerRef.current;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-offset", `${Math.ceil(h) + 16}px`);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // Mobile marquee (banner text animation)
  const mobileMarqueeControls = useAnimation();
  const mobileMarqueeWrapRef = useRef<HTMLDivElement | null>(null);

  // Get active exhibitions from shared data
  const activeExhibitions = getActiveExhibitions();

  // Auto-rotate through exhibitions (sync with marquee cycle)
  useEffect(() => {
    if (activeExhibitions.length <= 1) return;

    let timeoutId: number | null = null;

    const scheduleNext = () => {
      timeoutId = window.setTimeout(() => {
        setCurrentExhibitionIndex((prev) => (prev + 1) % activeExhibitions.length);
        scheduleNext();
      }, MARQUEE_CYCLE_MS + ROTATE_BUFFER_MS);
    };

    scheduleNext();

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [activeExhibitions.length]);

  // Optimalizace scroll handleru s throttling pomocí requestAnimationFrame
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / viewportHeight, 1);
        setScrollProgress(progress);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    if (!isMenuOpen) return;

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Close menu when scrolling - kombinováno s debounce
  // IMPORTANT: Ignores programmatic scroll (from menu navigation)
  useEffect(() => {
    if (!isMenuOpen) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      // Skip if this is a programmatic scroll from menu navigation
      if (isNavigatingRef.current || isAutoScrolling) return;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsMenuOpen(false), 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isMenuOpen, isAutoScrolling]);

  const handleLogoClick = useCallback(() => {
    setScrollProgress(0);
    onLogoClick();
  }, [onLogoClick]);

  // Scroll to section - uses the utility function
  // Only waits for menu close animation on mobile (when menu is open)
  const scrollToSection = useCallback((id: string) => {
    // Set flag to prevent scroll listener from interfering
    isNavigatingRef.current = true;

    const menuWasOpen = isMenuOpen;

    // Close menu if open
    if (menuWasOpen) {
      setIsMenuOpen(false);
    }

    // Function to perform scroll and reset flag
    const performScroll = () => {
      scrollToSectionUtil(id);

      // Reset flag after scroll completes (utility function handles ~3s max)
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 3500);
    };

    if (menuWasOpen) {
      // Mobile: Wait for menu exit animation (300ms) + small buffer
      setTimeout(performScroll, 350);
    } else {
      // Desktop: Scroll immediately
      performScroll();
    }
  }, [isMenuOpen]);

  // Memoizace vypočtených hodnot
  const headerStyles: React.CSSProperties = {
    backgroundColor: `rgba(0, 0, 0, ${0.15 + scrollProgress * 0.45})`,
    backdropFilter: `blur(${4 + scrollProgress * 12}px)`,
    borderBottom: `1px solid rgba(255, 255, 255, ${0.1 + scrollProgress * 0.2})`,
  };

  const menuBackgroundStyles: React.CSSProperties = {
    backgroundColor: `rgba(0, 0, 0, ${0.05 - scrollProgress * 0.1})`,
    backdropFilter: String(headerStyles.backdropFilter ?? "blur(4px)"),
    borderTop: String(headerStyles.borderBottom ?? "1px solid rgba(255,255,255,0.1)"),
  };

  const menuItems = [
    { label: "O umělci", id: "about" },
    { label: "Výstavy", id: "exhibitions" },
    { label: "Díla", id: "gallery" },
    { label: "Kontakt", id: "contact" },
  ];

  // Určení delay a duration podle kontextu
  const getAnimationParams = () => {
    if (isReturningFromFullscreen) return { duration: 0.4, delay: 0 };
    if (isHidden) return { duration: 0.4, delay: 0 }; // Rychlý odjezd nahoru při resetu
    return { duration: 2, delay: 1.2 }; // Pomalejší příjezd po resetu
  };

  const animParams = getAnimationParams();

  // Current exhibition for banner
  const currentExhibition = activeExhibitions[currentExhibitionIndex];
  const hasExhibitions = activeExhibitions.length > 0;
  // Banner se zobrazuje pouze na základě ručního dismiss - ne automaticky
  const shouldShowBanner = !isBannerDismissed;

  // Mobile marquee: "start left -> pause -> scroll left until gone -> pause -> slide in from left -> pause -> repeat"
  useEffect(() => {
    if (!shouldShowBanner || !currentExhibition) return;

    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const run = async () => {
      await mobileMarqueeControls.set({ x: 0 });
      if (cancelled) return;

      await sleep(MARQUEE_HOLD_START_MS);
      if (cancelled) return;

      await mobileMarqueeControls.start({
        x: "-110%",
        transition: { duration: MARQUEE_SCROLL_LEFT_MS / 1000, ease: "linear" },
      });
      if (cancelled) return;

      await sleep(MARQUEE_GAP_MS);
      if (cancelled) return;

      // ensure off-screen on the left before "entering"
      await mobileMarqueeControls.set({ x: "-110%" });
      if (cancelled) return;

      await mobileMarqueeControls.start({
        x: 0,
        transition: { duration: MARQUEE_SLIDE_IN_MS / 1000, ease: "easeInOut" },
      });
      if (cancelled) return;

      await sleep(MARQUEE_HOLD_END_MS);
      if (cancelled) return;

      run();
    };

    run();

    return () => {
      cancelled = true;
      mobileMarqueeControls.stop();
    };
  }, [currentExhibition?.id, shouldShowBanner, mobileMarqueeControls]);

  return (
      <motion.header
          ref={headerRef}
          key={`header-${animationKey}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: isHidden ? -100 : 0, opacity: isHidden ? 0 : 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: animParams.duration,
            delay: animParams.delay,
            ease: "easeInOut",
          }}
          className="fixed top-0 left-0 right-0 z-[110] shadow-lg shadow-black/5"
          style={headerStyles}
      >
        {/* Main header content */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-5 md:py-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <button
                onClick={handleLogoClick}
                className="group relative"
                aria-label="Zpět nahoru"
                type="button"
            >
              <img
                  src={podpis}
                  alt="Kroča podpis"
                  className="h-12 w-auto transition-opacity group-hover:opacity-70"
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-10 items-center">
              <button
                  type="button"
                  onClick={() => scrollToSection("about")}
                  className="relative group transition-colors hover:opacity-60 text-white"
              >
                O Umělci
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
              </button>

              <button
                  type="button"
                  onClick={() => scrollToSection("exhibitions")}
                  className="relative group transition-colors hover:opacity-60 text-white"
              >
                Výstavy
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
              </button>

              <button
                  type="button"
                  onClick={() => scrollToSection("gallery")}
                  className="relative group transition-colors hover:opacity-60 text-white"
              >
                Díla
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
              </button>

              <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Kontakt
              </button>

              {/* Banner toggle button (desktop) */}
              <button
                  type="button"
                  aria-label={isBannerDismissed ? "Zobrazit banner" : "Skrýt banner"}
                  className="ml-2 p-2 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  onClick={() => setIsBannerDismissed((prev) => !prev)}
              >
                <ChevronDown
                    className="w-4 h-4"
                    style={{
                      transform: isBannerDismissed ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                    }}
                />
              </button>
            </nav>

            {/* Right side on mobile: banner toggle + menu */}
            <div className="md:hidden flex items-center gap-2">
              {/* Banner toggle button (mobile) */}
              <button
                  type="button"
                  aria-label={isBannerDismissed ? "Zobrazit banner" : "Skrýt banner"}
                  className="p-2 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  onClick={() => setIsBannerDismissed((prev) => !prev)}
              >
                <ChevronDown
                    className="w-5 h-5"
                    style={{
                      transform: isBannerDismissed ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                    }}
                />
              </button>

              {/* Mobile Menu Button */}
              <button
                  type="button"
                  className="text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? "Zavřít menu" : "Otevřít menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Exhibition Banner */}
        <AnimatePresence>
          {hasExhibitions && currentExhibition && shouldShowBanner && (
              <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: { height: { duration: 0.4, ease: "easeInOut" }, opacity: { duration: 0.3, delay: 0.1 } },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: { height: { duration: 0.4, ease: "easeInOut" }, opacity: { duration: 0.3 } },
                  }}
                  className="border-t border-white/10 cursor-pointer hover:bg-white/5 transition-colors overflow-hidden"
                  onClick={() => scrollToSection("exhibitions")}
              >
                <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-2">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Status indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                  <span className="relative flex items-center justify-center">
                    <span
                        className={[
                          "w-2 h-2 rounded-full",
                          currentExhibition.calculatedStatus === "current" ? "bg-green-500" : "bg-amber-500",
                        ].join(" ")}
                    />
                    {currentExhibition.calculatedStatus === "current" && (
                        <span className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    )}
                  </span>

                      <span
                          className={[
                            "text-xs uppercase tracking-wider hidden sm:inline",
                            currentExhibition.calculatedStatus === "current" ? "text-green-400" : "text-amber-400",
                          ].join(" ")}
                      >
                    {currentExhibition.calculatedStatus === "current" ? "Právě probíhá" : "Nadcházející"}
                  </span>
                    </div>

                    {/* Center: Exhibition info */}
                    <div className="flex-1 overflow-hidden min-w-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                            key={currentExhibition.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="min-w-0"
                        >
                          {/* Mobile marquee */}
                          <div className="sm:hidden overflow-hidden" ref={mobileMarqueeWrapRef}>
                            <motion.div
                                className="whitespace-nowrap text-white text-xs font-medium will-change-transform"
                                animate={mobileMarqueeControls}
                                initial={{ x: 0 }}
                            >
                              {currentExhibition.title}
                              {" • "}
                              {currentExhibition.venue}
                              {currentExhibition.location ? `, ${currentExhibition.location}` : ""}
                              {" • "}
                              {currentExhibition.dateFrom}
                              {currentExhibition.dateTo ? ` — ${currentExhibition.dateTo}` : ""}
                            </motion.div>
                          </div>

                          {/* Desktop/tablet layout */}
                          <div className="hidden sm:flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                        <span className="text-white text-sm font-medium truncate">
                          {currentExhibition.title}
                        </span>
                            <span className="text-white/30 hidden sm:inline">—</span>
                            <span className="text-white text-xs sm:text-sm truncate hidden lg:inline">
                          {currentExhibition.venue}
                              {currentExhibition.location ? `, ${currentExhibition.location}` : ""}
                        </span>
                            <span className="text-white/30 hidden lg:inline">—</span>
                            <span className="text-white text-xs font-medium truncate hidden sm:inline">
                          {currentExhibition.dateFrom}
                              {currentExhibition.dateTo ? ` — ${currentExhibition.dateTo}` : ""}
                        </span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Right: Counter */}
                    <div className="flex items-center gap-3 shrink-0">
                      {activeExhibitions.length > 1 && (
                          <span className="text-gray-500 text-xs">
                      {currentExhibitionIndex + 1}/{activeExhibitions.length}
                    </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
              <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: { height: { duration: 0.6, ease: "easeOut" }, opacity: { duration: 0.2 } },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: { height: { duration: 0.3, ease: "easeIn" }, opacity: { duration: 0.2 } },
                  }}
                  className="md:hidden overflow-hidden"
                  style={menuBackgroundStyles}
              >
                <nav className="flex flex-col gap-6 px-6 py-8">
                  {menuItems.map((item, index) => (
                      <motion.div
                          key={item.id}
                          initial={{ y: -15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -15, opacity: 0 }}
                          transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                          className="relative z-[200]"
                      >
                        <button
                            type="button"
                            onClick={() => scrollToSection(item.id)}
                            className="text-left hover:opacity-60 transition-opacity text-white w-full"
                        >
                          {item.label}
                        </button>
                      </motion.div>
                  ))}
                </nav>
              </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
  );
}