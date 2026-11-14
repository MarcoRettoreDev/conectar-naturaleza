import { describe, expect, it } from "vitest";

import { quoteMessage, quoteUrl } from "./whatsapp";

const greeting = "Hola, quiero pedir una cotización para Conectar Naturaleza en Ituzaingó.";

describe("quoteMessage", () => {
	it("carries the dates, the nights and the guests the visitor chose", () => {
		expect(
			quoteMessage(greeting, {
				checkIn: "2026-12-20",
				checkOut: "2026-12-23",
				guests: { adults: 2, children: 1, infants: 1 },
			}),
		).toBe(
			[
				greeting,
				"",
				"*Llegada:* 20/12/2026",
				"*Salida:* 23/12/2026",
				"*Noches:* 3",
				"*Huéspedes:* 3 huéspedes (2 adultos · 1 niño · 1 bebé)",
			].join("\n"),
		);
	});

	it("says one night and lists only adults when nobody else travels", () => {
		expect(
			quoteMessage(greeting, {
				checkIn: "2027-01-31",
				checkOut: "2027-02-01",
				guests: { adults: 1, children: 0, infants: 0 },
			}),
		).toBe(
			[
				greeting,
				"",
				"*Llegada:* 31/01/2027",
				"*Salida:* 01/02/2027",
				"*Noches:* 1",
				"*Huéspedes:* 1 huésped",
			].join("\n"),
		);
	});
});

describe("quoteUrl", () => {
	it("opens a chat with the number, without its plus sign, and the encoded message", () => {
		expect(quoteUrl("+5493786414965", "Hola\n*Noches:* 3")).toBe(
			"https://wa.me/5493786414965?text=Hola%0A*Noches%3A*%203",
		);
	});
});
