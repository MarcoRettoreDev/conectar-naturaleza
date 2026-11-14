import { useMemo, useState } from 'react';

import { scrollToSection, useActiveSection } from '@/hooks/use-microsite-navigation';
import { clampGuestCounts, type GuestCounts } from '@/lib/guests';
import type { Microsite } from '@/lib/types';
import { quoteMessage, quoteUrl } from '@/lib/whatsapp';

import BookingBar from './booking-bar';
import type { QuoteState } from './booking-card';
import MicrositeHeader, { MicrositeNav, type MicrositeNavSection } from './header';
import Listing from './listing';

/** The page island: header, body and phone bar share one quote state, which becomes a WhatsApp message. */
export default function MicrositePage({ site }: { site: Microsite }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState<GuestCounts>({
        adults: 2,
        children: 0,
        infants: 0,
    });

    const hasValidDateRange = checkIn !== '' && checkOut !== '' && checkOut > checkIn;
    const url = hasValidDateRange
        ? quoteUrl(
              site.whatsapp.phone,
              quoteMessage(site.whatsapp.greeting, { checkIn, checkOut, guests }),
          )
        : null;

    const quote: QuoteState = {
        checkIn,
        checkOut,
        guests,
        maxCapacity: site.max_capacity,
        hasValidDateRange,
        setCheckIn,
        setCheckOut,
        updateGuestCounts: (adults, children, infants) =>
            setGuests(clampGuestCounts(site.max_capacity, adults, children, infants)),
        url,
    };

    const sections = useMemo<MicrositeNavSection[]>(
        () =>
            [
                { id: 'fotos', label: 'Fotos' },
                site.amenities.length > 0 || site.includes_bed_linen !== null || site.includes_towels !== null
                    ? { id: 'servicios', label: 'Servicios' }
                    : null,
                site.reviews.length > 0 ? { id: 'opiniones', label: 'Opiniones' } : null,
                { id: 'ubicacion', label: 'Ubicación' },
            ].filter((section): section is MicrositeNavSection => section !== null),
        [site],
    );
    const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
    const activeSection = useActiveSection(sectionIds);

    return (
        <div className="scroll-smooth bg-background text-foreground">
            <MicrositeHeader name={site.name} logoUrl={site.logo_url}>
                <MicrositeNav
                    sections={sections}
                    activeSection={activeSection}
                    onNavigate={scrollToSection}
                />
            </MicrositeHeader>
            <Listing site={site} quote={quote} />
            <BookingBar quote={quote} />
        </div>
    );
}
