/**
 * Build-time only (imported from `.astro` files, never from React): reads `src/data/contents.json`, checks it and
 * shapes it into the `Microsite` the page components take. Photos are file names in `src/assets/images`; each one is
 * optimized here into the three sizes the gallery uses.
 */
import logoBlack from "@icons/logo-black-transparent.png";
import logoWhite from "@icons/logo-white-transparent.png";
import { z } from "astro/zod";
import { getImage } from "astro:assets";

import raw from "@/data/contents.json";
import { isIconKey } from "@/lib/icons";
import type { GalleryPhoto, GallerySpace, Microsite } from "@/lib/types";

const images = import.meta.glob<{ default: ImageMetadata }>("/src/assets/images/*.{jpg,jpeg,png,webp}", {
	eager: true,
});

const imageByFile = new Map(
	Object.entries(images).map(([path, module]) => [path.split("/").pop() as string, module.default]),
);

const bed = z.object({ bed_type: z.string().min(1), quantity: z.number().int().positive() });
const photo = z.object({
	file: z.string().min(1),
	alt: z.string().optional(),
	/** The point (0 to 1) that stays in view when the photo is cropped. */
	focus: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
});
const room = z.object({
	name: z.string().min(1),
	beds: z.array(bed).default([]),
	text: z.string().nullable().default(null),
});

const schema = z.object({
	site: z.object({ name: z.string(), title: z.string(), description: z.string() }),
	whatsapp: z.object({ phone: z.string().regex(/\d{8,}/, "Debe tener el teléfono con código de país"), greeting: z.string() }),
	accommodation: z.object({
		property_type: z.string(),
		locality: z.string(),
		province: z.string(),
		country: z.string(),
		max_capacity: z.number().int().positive(),
		description: z.string(),
		includes_bed_linen: z.boolean().nullable(),
		includes_towels: z.boolean().nullable(),
	}),
	bedrooms: z.array(room),
	bathrooms: z.array(room),
	amenities: z.array(z.object({ icon: z.string(), label: z.string(), shared: z.boolean().default(false) })),
	house_rules: z.object({
		items: z.array(
			z.object({
				icon: z.string(),
				text: z.string(),
				/** `true` green, `false` red, `null` neutral. */
				allowed: z.boolean().nullable().default(null),
			}),
		),
		other: z.string().nullable().default(null),
	}),
	highlight: z
		.object({
			title: z.string(),
			text: z.string(),
			ratings: z.array(z.object({ platform: z.string(), score: z.string(), url: z.string().url().nullable().default(null) })),
		})
		.nullable(),
	reviews: z.array(
		z.object({
			author_name: z.string(),
			month: z.string().nullable().default(null),
			rating: z.number().int().min(1).max(5),
			comment: z.string(),
		}),
	),
	location: z.object({ latitude: z.number(), longitude: z.number(), text: z.string().nullable().default(null) }),
	gallery: z.object({
		hero: z.array(z.string()),
		spaces: z.array(
			z.object({
				name: z.string().min(1),
				description: z.string().nullable().default(null),
				beds: z.array(bed).default([]),
				shared: z.boolean().default(false),
				photos: z.array(photo).min(1),
			}),
		),
	}),
	footer: z.object({
		slogan: z.string(),
		links: z.array(z.object({ label: z.string(), url: z.string().url() })),
	}),
});

type Contents = z.infer<typeof schema>;

function metadataOf(file: string): ImageMetadata {
	const metadata = imageByFile.get(file);
	if (!metadata) {
		throw new Error(
			`contents.json: la foto «${file}» no existe en src/assets/images. Archivos disponibles: ${[...imageByFile.keys()].sort().join(", ")}`,
		);
	}

	return metadata;
}

/** The same file in the hero and in a space shares one id and one build. */
const photoCache = new Map<string, Promise<GalleryPhoto>>();
const fileIds = new Map<string, number>();

function buildPhoto(file: string, alt?: string, focus?: { x: number; y: number }): Promise<GalleryPhoto> {
	const key = `${file}|${alt ?? ""}|${focus?.x ?? ""}|${focus?.y ?? ""}`;
	const cached = photoCache.get(key);
	if (cached) {
		return cached;
	}

	const metadata = metadataOf(file);
	if (!fileIds.has(file)) {
		fileIds.set(file, fileIds.size + 1);
	}
	const id = fileIds.get(file) as number;
	const sized = (width: number) =>
		getImage({ src: metadata, format: "webp", width: Math.min(width, metadata.width), quality: "high" }).then((image) => image.src);

	const built = Promise.all([sized(400), sized(800), sized(1600)]).then(
		([url, medium_url, large_url]): GalleryPhoto => ({
			id,
			url,
			medium_url,
			large_url,
			// ImageMetadata already respects the EXIF orientation.
			width: metadata.width,
			height: metadata.height,
			focus_x: focus?.x ?? 0.5,
			focus_y: focus?.y ?? 0.5,
			alt_text: alt ?? null,
		}),
	);
	photoCache.set(key, built);

	return built;
}

function checkIcons(kind: string, items: { icon: string; label?: string; text?: string }[]) {
	for (const item of items) {
		if (!isIconKey(item.icon)) {
			console.warn(`contents.json: ${kind} «${item.label ?? item.text}» usa el ícono desconocido «${item.icon}»; se muestra el ícono por defecto (ver src/lib/icons.ts).`);
		}
	}
}

async function logoUrl(src: ImageMetadata, width: number): Promise<string> {
	return (await getImage({ src, format: "png", width })).src;
}

let cached: Promise<Microsite> | undefined;

/** The whole microsite, validated and with every photo resolved. Throws, naming the problem, on bad content. */
export function loadMicrosite(): Promise<Microsite> {
	cached ??= build();

	return cached;
}

async function build(): Promise<Microsite> {
	const parsed = schema.safeParse(raw);
	if (!parsed.success) {
		const problems = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
		throw new Error(`contents.json no es válido:\n${problems}`);
	}
	const contents: Contents = parsed.data;

	checkIcons("el servicio", contents.amenities);
	checkIcons("la norma", contents.house_rules.items);

	const hero = await Promise.all(contents.gallery.hero.map((file) => buildPhoto(file)));
	const spaces: GallerySpace[] = await Promise.all(
		contents.gallery.spaces.map(async (space, index) => ({
			id: index + 1,
			name: space.name,
			description: space.description,
			beds: space.beds,
			shared: space.shared,
			photos: await Promise.all(space.photos.map((item) => buildPhoto(item.file, item.alt, item.focus))),
		})),
	);

	const { accommodation } = contents;

	return {
		name: contents.site.name,
		property_type: accommodation.property_type,
		locality: accommodation.locality,
		province: accommodation.province,
		country: accommodation.country,
		max_capacity: accommodation.max_capacity,
		description: accommodation.description,
		includes_bed_linen: accommodation.includes_bed_linen,
		includes_towels: accommodation.includes_towels,
		bedrooms: contents.bedrooms,
		bathrooms: contents.bathrooms,
		amenities: contents.amenities,
		house_rules: contents.house_rules,
		highlight: contents.highlight,
		reviews: contents.reviews,
		location: contents.location,
		gallery: { hero, spaces },
		whatsapp: contents.whatsapp,
		logo_url: await logoUrl(logoBlack, 128),
		footer: { ...contents.footer, logo_url: await logoUrl(logoWhite, 256) },
	};
}

/** Title and description for `<head>`, from `contents.json`. */
export const siteMeta = {
	name: raw.site.name,
	title: raw.site.title,
	description: raw.site.description,
	/** A real photo, shared by link previews. */
	shareImage: () => metadataOf(raw.gallery.hero[0]),
};
