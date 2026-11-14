import { Button } from '@/components/ui/button';
import { scrollToSection } from '@/hooks/use-microsite-navigation';

import { openQuote, quoteLabel,type QuoteState } from './booking-card';

/** Figma `Micrositio/Barra de reserva`: fixed at the bottom below `lg`. */
export default function BookingBar({ quote }: { quote: QuoteState }) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 py-3 lg:hidden">
            <Button
                type="button"
                variant="success"
                size="lg"
                className="w-full"
                onClick={() =>
                    quote.hasValidDateRange
                        ? openQuote(quote)
                        : scrollToSection('reserva')
                }
            >
                {quoteLabel(quote)}
            </Button>
        </div>
    );
}
