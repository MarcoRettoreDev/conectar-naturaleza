/** Logical cap of infants per quote request; infants never occupy capacity. */
export const MAX_INFANTS = 5;

export type GuestCounts = {
	adults: number;
	children: number;
	infants: number;
};

/**
 * Keeps adults and children within the accommodation capacity and infants within
 * the logical cap. Infants never reduce the room left for adults and children.
 */
export function clampGuestCounts(
	maxCapacity: number,
	nextAdults: number,
	nextChildren: number,
	nextInfants: number,
): GuestCounts {
	const adults = Math.max(1, Math.min(nextAdults, maxCapacity));
	const children = Math.max(0, Math.min(nextChildren, maxCapacity - adults));
	const infants = Math.max(0, Math.min(nextInfants, MAX_INFANTS));

	return { adults, children, infants };
}

function plural(count: number, singular: string, pluralForm: string): string {
	return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** «2 adultos · 1 niño · 1 bebé». */
export function guestSummary({ adults, children, infants }: GuestCounts): string {
	return [
		plural(adults, "adulto", "adultos"),
		children > 0 ? plural(children, "niño", "niños") : null,
		infants > 0 ? plural(infants, "bebé", "bebés") : null,
	]
		.filter(Boolean)
		.join(" · ");
}

/**
 * «4 huéspedes (2 adultos · 2 niños · 1 bebé)»: infants do not count as guests, and the
 * composition only shows when someone other than adults travels.
 */
export function groupSummary(guests: GuestCounts): string {
	const total = plural(guests.adults + guests.children, "huésped", "huéspedes");

	return guests.children + guests.infants === 0 ? total : `${total} (${guestSummary(guests)})`;
}
