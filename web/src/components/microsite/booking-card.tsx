import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type GuestCounts,MAX_INFANTS } from '@/lib/guests';

import DateRangePicker from './date-range-picker';
import GuestSelector from './guest-selector';

export interface QuoteState {
    checkIn: string;
    checkOut: string;
    guests: GuestCounts;
    maxCapacity: number;
    hasValidDateRange: boolean;
    setCheckIn: (value: string) => void;
    setCheckOut: (value: string) => void;
    updateGuestCounts: (
        adults: number,
        children: number,
        infants: number,
    ) => void;
    /** The WhatsApp link with what the visitor chose; null until both dates are set. */
    url: string | null;
}

/** The label of the main button on the card and on the phone bar. */
export function quoteLabel(quote: QuoteState): string {
    return quote.hasValidDateRange ? 'Pedir cotización' : 'Elegí las fechas';
}

/** Opens the WhatsApp chat, in a new tab, with the quote typed in. */
export function openQuote(quote: QuoteState): void {
    if (quote.url) {
        window.open(quote.url, '_blank', 'noopener,noreferrer');
    }
}

/** Figma `Micrositio/Reserva`, without price or availability: dates and guests become a WhatsApp message. */
export default function BookingCard({ quote }: { quote: QuoteState }) {
    const { adults, children, infants } = quote.guests;

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-[0_8px_12px_rgb(38_54_43/0.12)]">
            <p className="text-xl font-semibold">
                Consultá disponibilidad y tarifa
            </p>

            <DateRangePicker
                checkIn={quote.checkIn}
                checkOut={quote.checkOut}
                onCheckInChange={quote.setCheckIn}
                onCheckOutChange={quote.setCheckOut}
            />

            <GuestSelector
                adults={adults}
                children={children}
                infants={infants}
                maxAdults={quote.maxCapacity - children}
                maxChildren={quote.maxCapacity - adults}
                maxInfants={MAX_INFANTS}
                maxCapacity={quote.maxCapacity}
                onUpdateGuestCounts={quote.updateGuestCounts}
            />

            <Button
                type="button"
                variant="success"
                size="lg"
                className="w-full"
                disabled={!quote.hasValidDateRange}
                onClick={() => openQuote(quote)}
            >
                {quoteLabel(quote)}
            </Button>

            <p className="flex items-start justify-center gap-2 text-center text-sm text-muted-foreground">
                <MessageCircle className="mt-0.5 size-4 shrink-0" />
                Te respondemos por WhatsApp con la disponibilidad y la tarifa.
            </p>
        </div>
    );
}
