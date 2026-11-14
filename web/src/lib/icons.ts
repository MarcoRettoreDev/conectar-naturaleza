import {
	Baby,
	Bath,
	BedDouble,
	Check,
	Cigarette,
	CigaretteOff,
	Coffee,
	CookingPot,
	Flame,
	LogIn,
	LogOut,
	type LucideIcon,
	MapPin,
	PartyPopper,
	PawPrint,
	ScrollText,
	ShieldCheck,
	Snowflake,
	SoapDispenserDroplet,
	Trees,
	Tv,
	Users,
	Utensils,
	Waves,
	Wifi,
} from "lucide-react";

/**
 * Icon keys `contents.json` can use for amenities and house rules (`icon` field).
 * Valid keys: snowflake, tv, wifi, cooking-pot, flame, soap-dispenser-droplet, utensils, coffee, waves, trees,
 * shield-check, bed-double, bath, map-pin, users, log-in, log-out, paw-print, cigarette, cigarette-off,
 * party-popper, baby, scroll-text, check.
 * An unknown key does not fail the build: it shows `check` and the build warns. To add an icon, import it from
 * `lucide-react` and add it here.
 */
export const ICONS = {
	snowflake: Snowflake,
	tv: Tv,
	wifi: Wifi,
	"cooking-pot": CookingPot,
	flame: Flame,
	"soap-dispenser-droplet": SoapDispenserDroplet,
	utensils: Utensils,
	coffee: Coffee,
	waves: Waves,
	trees: Trees,
	"shield-check": ShieldCheck,
	"bed-double": BedDouble,
	bath: Bath,
	"map-pin": MapPin,
	users: Users,
	"log-in": LogIn,
	"log-out": LogOut,
	"paw-print": PawPrint,
	cigarette: Cigarette,
	"cigarette-off": CigaretteOff,
	"party-popper": PartyPopper,
	baby: Baby,
	"scroll-text": ScrollText,
	check: Check,
} satisfies Record<string, LucideIcon>;

export const FALLBACK_ICON: LucideIcon = Check;

export function isIconKey(key: string): key is keyof typeof ICONS {
	return Object.hasOwn(ICONS, key);
}

export function iconFor(key: string): LucideIcon {
	return isIconKey(key) ? ICONS[key] : FALLBACK_ICON;
}
