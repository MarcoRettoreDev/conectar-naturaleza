import { diffDateOnlyDays } from "@/lib/date-only";
import { groupSummary,type GuestCounts } from "@/lib/guests";

export interface QuoteRequest {
	/** yyyy-MM-dd */
	checkIn: string;
	/** yyyy-MM-dd */
	checkOut: string;
	guests: GuestCounts;
}

/** yyyy-MM-dd as dd/MM/yyyy, the way the host reads dates. */
function displayDate(value: string): string {
	const [year, month, day] = value.split("-");

	return `${day}/${month}/${year}`;
}

/** The pre-filled WhatsApp text: the greeting from `contents.json`, then what the visitor chose. */
export function quoteMessage(greeting: string, { checkIn, checkOut, guests }: QuoteRequest): string {
	return [
		greeting,
		"",
		`*Llegada:* ${displayDate(checkIn)}`,
		`*Salida:* ${displayDate(checkOut)}`,
		`*Noches:* ${diffDateOnlyDays(checkIn, checkOut)}`,
		`*Huéspedes:* ${groupSummary(guests)}`,
	].join("\n");
}

/** A `wa.me` link that opens a chat with `phone` and `message` typed in. */
export function quoteUrl(phone: string, message: string): string {
	return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
