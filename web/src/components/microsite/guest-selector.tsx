import { Minus, Plus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { guestSummary } from '@/lib/guests';

interface GuestSelectorProps {
    adults: number;
    children: number;
    infants: number;
    maxAdults: number;
    maxChildren: number;
    maxInfants: number;
    /** Adults and children; infants do not count. */
    maxCapacity: number;
    onUpdateGuestCounts: (
        adults: number,
        children: number,
        infants: number,
    ) => void;
}

export function GuestCounter({
    label,
    hint,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    hint: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-6">
            <div>
                <div className="text-base font-medium">{label}</div>
                <div className="text-sm text-muted-foreground">{hint}</div>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label={`Quitar ${label.toLowerCase()}`}
                    onClick={() => onChange(value - 1)}
                    disabled={value <= min}
                >
                    <Minus />
                </Button>
                <span className="w-5 text-center text-base">{value}</span>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label={`Sumar ${label.toLowerCase()}`}
                    onClick={() => onChange(value + 1)}
                    disabled={value >= max}
                >
                    <Plus />
                </Button>
            </div>
        </div>
    );
}

export default function GuestSelector({
    adults,
    children,
    infants,
    maxAdults,
    maxChildren,
    maxInfants,
    maxCapacity,
    onUpdateGuestCounts,
}: GuestSelectorProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Huéspedes</span>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="flex h-11 w-full items-center gap-2 rounded-md border border-input px-3 text-left text-base transition-colors hover:border-foreground"
                    >
                        <Users className="size-5 shrink-0 text-icon-default" />
                        {guestSummary({ adults, children, infants })}
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-80 space-y-5 p-5">
                    <GuestCounter
                        label="Adultos"
                        hint="13 años o más"
                        value={adults}
                        min={1}
                        max={maxAdults}
                        onChange={(value) =>
                            onUpdateGuestCounts(value, children, infants)
                        }
                    />
                    <GuestCounter
                        label="Niños"
                        hint="De 2 a 12 años"
                        value={children}
                        min={0}
                        max={maxChildren}
                        onChange={(value) =>
                            onUpdateGuestCounts(adults, value, infants)
                        }
                    />
                    <GuestCounter
                        label="Bebés"
                        hint="Menos de 2 años"
                        value={infants}
                        min={0}
                        max={maxInfants}
                        onChange={(value) =>
                            onUpdateGuestCounts(adults, children, value)
                        }
                    />
                    {adults + children >= maxCapacity && (
                        <p className="text-sm text-muted-foreground">
                            Máximo {maxCapacity}{' '}
                            {maxCapacity === 1 ? 'huésped' : 'huéspedes'}, sin
                            contar bebés.
                        </p>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
}
