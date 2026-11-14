import type { Bed as BedDetail } from '@/lib/types';

/** «1 cama de 2 plazas», «2 camas marineras», «1 sofá cama». */
export function describeBed({ bed_type: type, quantity }: BedDetail): string {
    const beds = quantity === 1 ? 'cama' : 'camas';

    if (/^\d/.test(type)) {
        return `${quantity} ${beds} de ${type}`;
    }

    if (type.startsWith('Cama ')) {
        return `${quantity} ${beds} ${type.slice(5)}`;
    }

    if (type.startsWith('Sofá cama')) {
        return `${quantity} ${quantity === 1 ? 'sofá cama' : 'sofás cama'}${type.slice(9)}`;
    }

    return `${quantity} ${beds} ${type}`;
}
