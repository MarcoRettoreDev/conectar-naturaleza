/** Shapes the microsite components read. `contents.json` is turned into these by `lib/contents.ts`. */

export interface Bed {
	/** «2 plazas», «Cama marinera», «Sofá cama». */
	bed_type: string;
	quantity: number;
}

/** A photo with every size the gallery needs, made at build time from `src/assets/images`. */
export interface GalleryPhoto {
	id: number;
	url: string;
	medium_url: string;
	large_url: string;
	width: number;
	height: number;
	/** The point (0 to 1) that stays in view when the photo is cropped. */
	focus_x: number;
	focus_y: number;
	alt_text: string | null;
}

export interface GallerySpace {
	id: number;
	name: string;
	description: string | null;
	/** The beds of a bedroom; empty for other spaces. */
	beds: Bed[];
	shared: boolean;
	photos: GalleryPhoto[];
}

export interface PublicGallery {
	hero: GalleryPhoto[];
	spaces: GallerySpace[];
}

export interface Room {
	name: string;
	beds: Bed[];
	/** Shown when there are no beds, or instead of them. */
	text: string | null;
}

export interface Amenity {
	icon: string;
	label: string;
	shared: boolean;
}

export interface HouseRule {
	icon: string;
	text: string;
	/** `true` green, `false` red, `null` neutral (times, capacity). */
	allowed: boolean | null;
}

export interface Review {
	author_name: string;
	/** «octubre de 2025», or the platform: «Airbnb». */
	month: string | null;
	rating: number;
	comment: string;
}

export interface Rating {
	platform: string;
	score: string;
	url: string | null;
}

export interface FooterLink {
	label: string;
	url: string;
}

export interface Footer {
	slogan: string;
	links: FooterLink[];
	/** The white logo, for the dark band. */
	/** The dark logo, for the header. */
	logo_url: string;
	footer: Footer;
}

export interface Microsite {
	name: string;
	property_type: string;
	locality: string;
	province: string;
	country: string;
	max_capacity: number;
	description: string;
	includes_bed_linen: boolean | null;
	includes_towels: boolean | null;
	bedrooms: Room[];
	bathrooms: Room[];
	amenities: Amenity[];
	house_rules: { items: HouseRule[]; other: string | null };
	highlight: { title: string; text: string; ratings: Rating[] } | null;
	reviews: Review[];
	location: { latitude: number; longitude: number; text: string | null };
	gallery: PublicGallery;
	whatsapp: { phone: string; greeting: string };
	/** The dark logo, for the header. */
	logo_url: string;
	footer: Footer;
}
