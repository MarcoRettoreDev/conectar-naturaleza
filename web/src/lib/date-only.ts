/**
 * Helpers for calendar dates stored as yyyy-MM-dd strings.
 * Avoid `new Date('yyyy-MM-dd')`: it parses as UTC and shifts the day in negative offsets.
 */

export function parseDateOnly(value: string): Date {
	const [year, month, day] = value.split("-").map(Number);

	return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function formatDateOnly(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export function diffDateOnlyDays(start: string, end: string): number {
	const startDate = parseDateOnly(start);
	const endDate = parseDateOnly(end);

	return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}
