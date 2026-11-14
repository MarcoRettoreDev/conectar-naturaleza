import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { es } from 'react-day-picker/locale';

import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from '@/components/ui/popover';
import { formatDateOnly, parseDateOnly } from '@/lib/date-only';
import { cn } from '@/lib/utils';

const CALENDAR_FORMATTERS = {
    formatCaption: (month: Date) => {
        const caption = format(month, 'LLLL yyyy', { locale: es });

        return caption.charAt(0).toUpperCase() + caption.slice(1);
    },
    formatWeekdayName: (day: Date) =>
        format(day, 'EEEEE', { locale: es }).toUpperCase(),
};

interface DateRangePickerProps {
    /** yyyy-MM-dd, or '' */
    checkIn: string;
    /** yyyy-MM-dd, or '' */
    checkOut: string;
    onCheckInChange: (date: string) => void;
    onCheckOutChange: (date: string) => void;
}

/**
 * «Llegada» and «Salida» fields that open one calendar popover. There is no availability data: only past days are
 * disabled, and «today» is read in the browser when the calendar opens.
 */
export default function DateRangePicker({
    checkIn,
    checkOut,
    onCheckInChange,
    onCheckOutChange,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
        if (range?.from) {
            onCheckInChange(formatDateOnly(range.from));
            onCheckOutChange(range.to ? formatDateOnly(range.to) : '');
        }
    };

    const dateField = (label: string, value: string) => (
        <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-sm font-medium">{label}</span>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                    'flex h-11 w-full items-center gap-2 rounded-md border border-input px-3 text-left text-base transition-colors hover:border-foreground',
                    !value && 'text-muted-foreground',
                )}
            >
                <CalendarIcon className="size-5 shrink-0 text-icon-default" />
                {value
                    ? format(parseDateOnly(value), 'd MMM', { locale: es })
                    : 'Elegí la fecha'}
            </button>
        </div>
    );

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverAnchor asChild>
                <div className="flex flex-col gap-3 md:flex-row">
                    {dateField('Llegada', checkIn)}
                    {dateField('Salida', checkOut)}
                </div>
            </PopoverAnchor>
            <PopoverContent className="w-auto p-0" align="start">
                {isOpen && (
                    <>
                        <Calendar
                            formatters={CALENDAR_FORMATTERS}
                            mode="range"
                            // At least one night: picking the check-in again never makes a 0-night stay.
                            min={1}
                            selected={{
                                from: checkIn
                                    ? parseDateOnly(checkIn)
                                    : undefined,
                                to: checkOut
                                    ? parseDateOnly(checkOut)
                                    : undefined,
                            }}
                            onSelect={handleSelect}
                            numberOfMonths={1}
                            disabled={(date) =>
                                formatDateOnly(date) <
                                formatDateOnly(new Date())
                            }
                        />
                        {(checkIn || checkOut) && (
                            <div className="border-t border-border p-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onCheckInChange('');
                                        onCheckOutChange('');
                                    }}
                                    className="w-full text-sm text-muted-foreground underline hover:text-foreground"
                                >
                                    Limpiar fechas
                                </button>
                            </div>
                        )}
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}
