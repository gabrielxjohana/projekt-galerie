import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, MapPin } from 'lucide-react';
import { exhibitions, Exhibition, parseCzechDate, getCalculatedStatus } from './exhibitionsData.ts';

// Calculate days remaining or until start
const getDaysInfo = (exhibition: Exhibition): string | null => {
    if (!exhibition.confirmed || !exhibition.dateFrom) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const dateFrom = parseCzechDate(exhibition.dateFrom);
    const dateTo = exhibition.dateTo ? parseCzechDate(exhibition.dateTo) : null;

    const actualStatus = getCalculatedStatus(exhibition);

    if (actualStatus === 'current' && dateTo) {
        const daysRemaining = Math.ceil((dateTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysRemaining > 0) {
            return `Zbývá ${daysRemaining} ${daysRemaining === 1 ? 'den' : daysRemaining < 5 ? 'dny' : 'dní'}`;
        }
    } else if (actualStatus === 'upcoming') {
        const daysUntil = Math.ceil((dateFrom.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil > 0) {
            return `Začíná za ${daysUntil} ${daysUntil === 1 ? 'den' : daysUntil < 5 ? 'dny' : 'dní'}`;
        }
    }

    return null;
};

const getStatusLabel = (status: Exhibition['status'], confirmed: boolean) => {
    if (!confirmed) return 'V jednání';
    switch (status) {
        case 'current': return 'Právě probíhá';
        case 'upcoming': return 'Nadcházející';
        case 'past': return 'Proběhlo';
    }
};

const getStatusColor = (status: Exhibition['status'], confirmed: boolean) => {
    if (!confirmed) return 'bg-blue-500 text-blue-400';
    switch (status) {
        case 'current': return 'bg-green-500 text-green-400';
        case 'upcoming': return 'bg-amber-500 text-amber-400';
        case 'past': return 'bg-gray-500 text-gray-400';
    }
};

// Format venue and location display
const getLocationDisplay = (exhibition: Exhibition): string => {
    if (exhibition.venue && exhibition.location) {
        return `${exhibition.venue}, ${exhibition.location}`;
    }
    if (exhibition.venue) return exhibition.venue;
    if (exhibition.location) return `${exhibition.location} (místo bude upřesněno)`;
    return 'Místo bude upřesněno';
};

// Format date display
const getDateDisplay = (exhibition: Exhibition): string => {
    if (exhibition.dateFrom && exhibition.dateTo) {
        return `${exhibition.dateFrom} — ${exhibition.dateTo}`;
    }
    if (exhibition.dateFrom) return `Od ${exhibition.dateFrom}`;
    if (exhibition.dateTentative) return exhibition.dateTentative;
    return 'Datum bude upřesněno';
};

export function Exhibitions() {
    const [selectedPoster, setSelectedPoster] = useState<{ image: string; title: string } | null>(null);

    // Refs for focus trap
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trap and keyboard handling for lightbox
    useEffect(() => {
        if (!selectedPoster) return;

        // Focus close button when modal opens
        closeButtonRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedPoster(null);
                return;
            }

            // Focus trap - only Tab key
            if (e.key === 'Tab') {
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

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPoster]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (!selectedPoster) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [selectedPoster]);

    const handleClosePoster = useCallback(() => {
        setSelectedPoster(null);
    }, []);

    return (
        <section id="exhibitions" className="py-24 md:py-32 bg-black relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
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
                    <span className="block uppercase tracking-[0.2em] text-sm text-gray-400 mb-6">
                        Události
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl leading-tight text-white">
                            Výstavy
                        </h2>
                        <p className="text-xl text-gray-400 max-w-xl">
                            Přehled aktuálních a připravovaných výstav s díly Antonína Kroči
                        </p>
                    </div>
                </motion.div>

                {/* Exhibitions List */}
                <div className="space-y-6">
                    {exhibitions.map((exhibition, index) => {
                        const actualStatus = getCalculatedStatus(exhibition);
                        const statusColors = getStatusColor(actualStatus, exhibition.confirmed);
                        const [bgColor, textColor] = statusColors.split(' ');
                        const isCurrent = actualStatus === 'current' && exhibition.confirmed;

                        return (
                            <motion.article
                                key={exhibition.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.7,
                                    delay: index * 0.1,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="hover-glow group relative border border-white/10 hover:border-white/30 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.05]"
                            >
                                <div className="p-8 md:p-10">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-12">
                                        {/* Left: Status & Number */}
                                        <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-3 lg:min-w-[140px]">
                                            <span className="text-white/30 text-sm font-mono">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${bgColor} ${isCurrent ? 'animate-pulse' : ''}`} />
                                                <span className={`text-xs uppercase tracking-wider ${textColor}`}>
                                                    {getStatusLabel(actualStatus, exhibition.confirmed)}
                                                </span>
                                            </div>
                                            {exhibition.confirmed && getDaysInfo(exhibition) && (
                                                <span className="text-xs text-white/50">
                                                    {getDaysInfo(exhibition)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Center: Main Info */}
                                        <div className="flex-1 space-y-4">
                                            <h3 className="text-2xl md:text-3xl text-white font-light tracking-tight">
                                                {exhibition.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-white/70">
                                                    <MapPin className="w-4 h-4" aria-hidden="true" />
                                                    {exhibition.mapUrl ? (
                                                        <a
                                                            href={exhibition.mapUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-white transition-colors underline underline-offset-2"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {getLocationDisplay(exhibition)}
                                                        </a>
                                                    ) : (
                                                        <span>{getLocationDisplay(exhibition)}</span>
                                                    )}
                                                </div>
                                                <span className="text-white/50">
                                                    {getDateDisplay(exhibition)}
                                                </span>
                                            </div>

                                            {/* Vernissage - only shown for upcoming confirmed exhibitions */}
                                            {exhibition.vernissage && exhibition.confirmed && actualStatus === 'upcoming' && (
                                                <p className="text-white/80">
                                                    <span className="text-gray-400">Vernisáž:</span> {exhibition.vernissage}
                                                </p>
                                            )}
                                            {/* Vernissage on the day of the event (current status, first day) */}
                                            {exhibition.vernissage && exhibition.confirmed && actualStatus === 'current' && exhibition.dateFrom && (() => {
                                                const now = new Date();
                                                now.setHours(0, 0, 0, 0);
                                                const dateFrom = parseCzechDate(exhibition.dateFrom);
                                                return now.getTime() === dateFrom.getTime();
                                            })() && (
                                                <p className="text-white/80">
                                                    <span className="text-gray-400">Vernisáž:</span> {exhibition.vernissage}
                                                </p>
                                            )}

                                            <p className="text-gray-500 leading-relaxed max-w-2xl">
                                                {exhibition.description}
                                            </p>

                                            {/* Admission - only shown for confirmed upcoming or current exhibitions */}
                                            {exhibition.admission && exhibition.confirmed && (actualStatus === 'upcoming' || actualStatus === 'current') && (
                                                <p className="text-gray-400 text-sm">
                                                    <span className="text-gray-500">Vstupné:</span> {exhibition.admission}
                                                </p>
                                            )}
                                        </div>

                                        {/* Right: Poster Thumbnail */}
                                        <div className="lg:ml-auto flex-shrink-0">
                                            {exhibition.posterImage ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedPoster({
                                                        image: exhibition.posterImage!,
                                                        title: exhibition.title
                                                    })}
                                                    className="group/poster relative w-32 h-44 md:w-36 md:h-48 lg:w-40 lg:h-56 border border-white/20 bg-white/5 overflow-hidden hover:border-white/40 transition-all duration-500 cursor-pointer"
                                                    aria-label={`Zobrazit plakát výstavy ${exhibition.title}`}
                                                >
                                                    <img
                                                        src={exhibition.posterImage}
                                                        alt={`Plakát výstavy ${exhibition.title}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/poster:scale-105"
                                                    />
                                                    {/* Hover overlay with hint */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <span className="text-white text-sm font-light tracking-wide">
                                                            Zobrazit plakát
                                                        </span>
                                                    </div>
                                                </button>
                                            ) : (
                                                <div className="w-32 h-44 md:w-36 md:h-48 lg:w-40 lg:h-56 border border-white/20 bg-white/5 overflow-hidden flex flex-col items-center justify-center text-white/30 gap-3">
                                                    <svg
                                                        className="w-8 h-8"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span className="text-xs text-center px-2">Plakát</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </motion.article>
                        );
                    })}
                </div>

            </div>

            {/* Poster Lightbox */}
            <AnimatePresence>
                {selectedPoster && (
                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="poster-title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClosePoster}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[120] flex items-center justify-center p-6 cursor-pointer"
                    >
                        {/* Close button */}
                        <motion.button
                            ref={closeButtonRef}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: 0.1 }}
                            onClick={handleClosePoster}
                            aria-label="Zavřít"
                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 z-10 cursor-pointer"
                        >
                            <X className="w-6 h-6" aria-hidden="true" />
                        </motion.button>

                        {/* Poster image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-3xl max-h-[85vh] cursor-default"
                        >
                            <img
                                src={selectedPoster.image}
                                alt={`Plakát výstavy ${selectedPoster.title}`}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                            />
                            {/* Title below poster */}
                            <motion.p
                                id="poster-title"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center text-white/60 mt-6 text-lg font-light"
                            >
                                {selectedPoster.title}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}