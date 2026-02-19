// Shared exhibitions data used by both Exhibitions.tsx and Header.tsx

// Importy plakátů
import hukvaldy2026 from './photos/exhibitions/hukvaldy unor 2026.jpg';
import mlejn2026 from './photos/exhibitions/Mlejn brezen 2026.jpeg';


export interface Exhibition {
    id: number;
    title: string;
    venue?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    dateTentative?: string;
    description?: string;
    status: 'current' | 'upcoming' | 'past';
    confirmed: boolean;
    posterImage?: string;
    admission?: string;
    vernissage?: string;
    mapUrl?: string;
}

export const exhibitions: Exhibition[] = [
    {
        id: 1,
        title: 'Obrazové Střípky Antonína Kroči',
        venue: 'Obřadní Síň v Hukvaldském Dvoře',
        location: 'Hukvaldy',
        dateFrom: '2. 2. 2026',
        dateTo: '20. 2. 2026',
        description: 'Vzpomínková Výstava ze Soukromých Sbírek',
        status: 'upcoming',
        confirmed: true,
        posterImage: hukvaldy2026,
        admission: 'Dobrovolné',
        vernissage: '2. 2. 2026 v 17:00',
        mapUrl: 'https://maps.app.goo.gl/qo5HYYGQPBxtGgBw9',
    },
    {
        id: 2,
        title: 'Vernisáž Výstavy Akademického Malíře Antonína Kroči',
        venue: 'Galerie Mlejn',
        location: 'Moravská Ostrava, Nádražní 3136/138A',
        dateTentative: "Březen 2026",
        status: 'upcoming',
        confirmed: false,
        posterImage: mlejn2026,
        admission: 'Dobrovolné',
        vernissage: '2. 2. 2026 v 17:00',
        mapUrl: 'https://maps.app.goo.gl/bxLCUVzv69Uzc8Y1A',
    },
    // Add more exhibitions here
];

// Parse Czech date format "15. 1. 2024" to Date object
export const parseCzechDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('. ').map(s => parseInt(s.trim()));
    return new Date(year, month - 1, day);
};

// Calculate actual status based on dates
export const getCalculatedStatus = (exhibition: Exhibition): Exhibition['status'] => {
    if (!exhibition.confirmed || !exhibition.dateFrom) {
        return exhibition.status;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const dateFrom = parseCzechDate(exhibition.dateFrom);
    const dateTo = exhibition.dateTo ? parseCzechDate(exhibition.dateTo) : null;

    if (now < dateFrom) return 'upcoming';
    if (dateTo && now > dateTo) return 'past';
    return 'current';
};

// Get active exhibitions (current and upcoming) sorted by status and date
export const getActiveExhibitions = () => {
    return exhibitions
        .filter(ex => ex.confirmed)
        .map(ex => ({ ...ex, calculatedStatus: getCalculatedStatus(ex) }))
        .filter(ex => ex.calculatedStatus !== 'past')
        .sort((a, b) => {
            // Current exhibitions first
            if (a.calculatedStatus === 'current' && b.calculatedStatus !== 'current') return -1;
            if (a.calculatedStatus !== 'current' && b.calculatedStatus === 'current') return 1;
            // Then sort by date
            if (a.dateFrom && b.dateFrom) {
                return parseCzechDate(a.dateFrom).getTime() - parseCzechDate(b.dateFrom).getTime();
            }
            return 0;
        });
};