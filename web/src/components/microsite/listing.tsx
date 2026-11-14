import { Bath, BedDouble, type LucideIcon,Navigation } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { describeBed } from '@/lib/beds';
import { iconFor } from '@/lib/icons';
import type {
    GallerySpace,
    HouseRule,
    Microsite,
    Rating,
    Room,
} from '@/lib/types';

import BookingCard, { type QuoteState } from './booking-card';
import PhotoGallery from './photo-gallery';
import { ReviewCard } from './review-card';

/** Ambiente texts shown under the description before «Leer más». */
const VISIBLE_SPACE_TEXTS = 2;

function count(value: number, singular: string, plural: string): string {
    return `${value} ${value === 1 ? singular : plural}`;
}

export function joinWithAnd(items: string[]): string {
    return items.length > 1
        ? `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`
        : items.join('');
}

function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <h2 className="text-3xl leading-tight font-bold tracking-[-0.5px]">
            {children}
        </h2>
    );
}

/** Lucide has no towel: a striped one hanging from its rail, drawn with the same stroke. */
function TowelIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden
        >
            <path d="M2 4h20" />
            <path d="M2 2.5v3" />
            <path d="M22 2.5v3" />
            <path d="M6 4v15a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4" />
            <path d="M6 14h12" />
            <path d="M6 17h12" />
        </svg>
    );
}

/**
 * Bed linen and towels, apart from the other services: a guest who arrives without them has a bad stay.
 * Green when given, red when not.
 */
function LinenItem({
    given,
    icon: Icon,
    label,
    bring,
}: {
    given: boolean;
    icon: LucideIcon | typeof TowelIcon;
    label: string;
    bring: string;
}) {
    return (
        <li className="flex items-center gap-3">
            <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full ring-2 ${
                    given
                        ? 'bg-success-subtle text-success-text ring-success-text/40'
                        : 'bg-destructive-subtle text-destructive-text ring-destructive-text/40'
                }`}
            >
                <Icon className="size-5.5" />
            </span>
            <span className="flex flex-col">
                <span
                    className={`text-base font-semibold ${given ? 'text-success-text' : 'text-destructive-text'}`}
                >
                    {given ? 'Incluye' : 'No incluye'} {label}
                </span>
                {!given && (
                    <span className="text-sm text-muted-foreground">
                        {bring}
                    </span>
                )}
            </span>
        </li>
    );
}

/** A house rule as a card: what it forbids in red, what it allows in green, the times and capacity plain. */
function HouseRuleCard({ rule }: { rule: HouseRule }) {
    const Icon = iconFor(rule.icon);
    const tone =
        rule.allowed === null
            ? 'bg-muted text-icon-default'
            : rule.allowed
              ? 'bg-success-subtle text-success-text'
              : 'bg-destructive-subtle text-destructive-text';

    return (
        <li className="flex items-center gap-3 rounded-xl border border-border p-4">
            <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${tone}`}
            >
                <Icon className="size-5" />
            </span>
            <span className="text-base font-medium">{rule.text}</span>
        </li>
    );
}

/** A bedroom with its beds, or a bathroom, in «Dormitorios y baños». */
function RoomCard({
    icon: Icon,
    room,
}: {
    icon: LucideIcon;
    room: Room;
}) {
    const text = [joinWithAnd(room.beds.map(describeBed)), room.text]
        .filter(Boolean)
        .join(' · ');

    return (
        <div className="flex w-60 shrink-0 flex-col gap-2 rounded-xl border border-border p-5 md:w-auto">
            <Icon className="size-7 text-icon-default" />
            <p className="text-xl font-semibold">{room.name}</p>
            {text && <p className="text-base text-muted-foreground">{text}</p>}
        </div>
    );
}

/** Trust card: highlight text plus the rating each platform gives. */
function Highlight({
    highlight,
}: {
    highlight: NonNullable<Microsite['highlight']>;
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl bg-brand-accent/20 p-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-lg font-semibold">{highlight.title}</p>
                <p className="text-sm">{highlight.text}</p>
            </div>
            {highlight.ratings.length > 0 && (
                <ul className="flex flex-wrap gap-3">
                    {highlight.ratings.map((rating) => (
                        <RatingChip key={rating.platform} rating={rating} />
                    ))}
                </ul>
            )}
        </div>
    );
}

function RatingChip({ rating }: { rating: Rating }) {
    const content = (
        <>
            <span className="text-sm">{rating.platform}</span>
            <span className="text-lg font-semibold">{rating.score}</span>
        </>
    );
    const className =
        'flex items-baseline gap-2 rounded-xl bg-background px-4 py-2';

    return (
        <li>
            {rating.url ? (
                <a
                    href={rating.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${className} hover:underline`}
                >
                    {content}
                </a>
            ) : (
                <span className={className}>{content}</span>
            )}
        </li>
    );
}

/**
 * The description, followed by the text of each ambiente: many guests never open the gallery, where those texts
 * live. The first ambientes always show; the rest unfold.
 */
function Description({
    text,
    spaces,
}: {
    text: string;
    spaces: GallerySpace[];
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const withText = spaces.filter((space) => space.description);
    const visible = isExpanded
        ? withText
        : withText.slice(0, VISIBLE_SPACE_TEXTS);

    return (
        <section className="flex flex-col items-start gap-5">
            <SectionTitle>Descripción</SectionTitle>
            <p className="text-lg leading-relaxed whitespace-pre-line">
                {text}
            </p>
            {visible.map((space) => (
                <div key={space.id} className="flex flex-col gap-1">
                    <h3 className="font-semibold">{space.name}</h3>
                    <p className="leading-relaxed whitespace-pre-line">
                        {space.description}
                    </p>
                </div>
            ))}
            {withText.length > VISIBLE_SPACE_TEXTS && (
                <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 underline"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Leer menos' : 'Leer más'}
                </Button>
            )}
        </section>
    );
}

function Amenities({ amenities }: { amenities: Microsite['amenities'] }) {
    return (
        <ul className="grid w-full gap-4 md:grid-cols-2 md:gap-x-6">
            {amenities.map((amenity) => {
                const Icon = iconFor(amenity.icon);

                return (
                    <li key={amenity.label} className="flex items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-icon-default">
                            <Icon className="size-5.5" />
                        </span>
                        <span className="flex flex-col">
                            <span className="text-base">{amenity.label}</span>
                            {amenity.shared && (
                                <span className="text-sm text-muted-foreground">
                                    De uso compartido
                                </span>
                            )}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}

/** The page body of the microsite: gallery, facts, services, the quote card beside it, reviews and map. */
export default function Listing({
    site,
    quote,
}: {
    site: Microsite;
    quote: QuoteState;
}) {
    const bedCount = site.bedrooms.reduce(
        (total, room) =>
            total + room.beds.reduce((sum, bed) => sum + bed.quantity, 0),
        0,
    );
    const linens = [
        {
            given: site.includes_bed_linen,
            icon: BedDouble,
            label: 'ropa de cama',
            bring: 'Llevá la tuya.',
        },
        {
            given: site.includes_towels,
            icon: TowelIcon,
            label: 'toallas',
            bring: 'Llevá las tuyas.',
        },
    ].filter(
        (linen): linen is typeof linen & { given: boolean } =>
            linen.given !== null,
    );
    const { house_rules: rules } = site;
    const { latitude, longitude } = site.location;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

    const bookingCard = <BookingCard quote={quote} />;

    return (
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
            <section
                id="fotos"
                className="flex scroll-mt-30 flex-col gap-6 md:pt-8"
            >
                <h1 className="order-2 text-4xl leading-[1.2] font-bold tracking-[-0.5px] md:order-1">
                    {site.name}
                </h1>
                <div className="order-1 md:order-2">
                    <PhotoGallery
                        gallery={site.gallery}
                        accommodationName={site.name}
                    />
                </div>
            </section>

            <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-20">
                <div className="flex min-w-0 flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-2xl font-semibold">
                            {site.property_type} en {site.locality},{' '}
                            {site.province}
                        </p>
                        <p className="text-lg text-muted-foreground">
                            {[
                                count(
                                    site.max_capacity,
                                    'huésped',
                                    'huéspedes',
                                ),
                                count(
                                    site.bedrooms.length,
                                    'habitación',
                                    'habitaciones',
                                ),
                                bedCount > 0 && count(bedCount, 'cama', 'camas'),
                                site.bathrooms.length > 0 &&
                                    count(site.bathrooms.length, 'baño', 'baños'),
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                    </div>

                    {site.highlight && <Highlight highlight={site.highlight} />}

                    {site.description && (
                        <>
                            <Separator />
                            <Description
                                text={site.description}
                                spaces={site.gallery.spaces}
                            />
                        </>
                    )}

                    {(site.bedrooms.length > 0 ||
                        site.bathrooms.length > 0) && (
                        <>
                            <Separator />
                            <section className="flex flex-col gap-5">
                                <SectionTitle>Dormitorios y baños</SectionTitle>
                                <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
                                    {site.bedrooms.map((room) => (
                                        <RoomCard
                                            key={room.name}
                                            icon={BedDouble}
                                            room={room}
                                        />
                                    ))}
                                    {site.bathrooms.map((room) => (
                                        <RoomCard
                                            key={room.name}
                                            icon={Bath}
                                            room={room}
                                        />
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {(site.amenities.length > 0 || linens.length > 0) && (
                        <>
                            <Separator />
                            <section
                                id="servicios"
                                className="flex scroll-mt-30 flex-col gap-5"
                            >
                                <SectionTitle>Servicios ofrecidos</SectionTitle>
                                {linens.length > 0 && (
                                    <ul className="grid w-full gap-4 md:grid-cols-2 md:gap-x-6">
                                        {linens.map((linen) => (
                                            <LinenItem
                                                key={linen.label}
                                                {...linen}
                                            />
                                        ))}
                                    </ul>
                                )}
                                <Amenities amenities={site.amenities} />
                            </section>
                        </>
                    )}

                    {(rules.items.length > 0 || rules.other) && (
                        <>
                            <Separator />
                            <section className="flex flex-col gap-5">
                                <SectionTitle>Normas de la casa</SectionTitle>
                                <ul className="grid gap-3 sm:grid-cols-2">
                                    {rules.items.map((rule) => (
                                        <HouseRuleCard
                                            key={rule.text}
                                            rule={rule}
                                        />
                                    ))}
                                    {rules.other && (
                                        <li className="flex items-start gap-3 rounded-xl border border-border p-4 sm:col-span-2">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-icon-default">
                                                {(() => {
                                                    const Icon =
                                                        iconFor('scroll-text');

                                                    return (
                                                        <Icon className="size-5" />
                                                    );
                                                })()}
                                            </span>
                                            <p className="pt-2 text-base break-words whitespace-pre-line">
                                                {rules.other}
                                            </p>
                                        </li>
                                    )}
                                </ul>
                            </section>
                        </>
                    )}

                    {/* On a phone the quote card goes here; on a wide screen it stays beside the page. */}
                    <div
                        id="reserva"
                        className="flex scroll-mt-30 flex-col gap-4 lg:hidden"
                    >
                        {bookingCard}
                    </div>
                </div>

                <aside className="hidden lg:block">
                    <div className="sticky top-30 flex max-h-[calc(100vh-8.5rem)] flex-col gap-4 overflow-y-auto pb-2">
                        {bookingCard}
                    </div>
                </aside>
            </div>

            <div className="mt-8 flex flex-col gap-10">
                <Separator />

                {site.reviews.length > 0 && (
                    <>
                        <section
                            id="opiniones"
                            className="flex scroll-mt-30 flex-col gap-6"
                        >
                            <SectionTitle>Opiniones</SectionTitle>
                            <div className="grid gap-8 md:grid-cols-2 md:gap-x-12">
                                {site.reviews.map((review, index) => (
                                    <ReviewCard key={index} review={review} />
                                ))}
                            </div>
                        </section>

                        <Separator />
                    </>
                )}

                <section
                    id="ubicacion"
                    className="flex scroll-mt-30 flex-col items-start gap-4"
                >
                    <SectionTitle>
                        Ubicación de {site.name} en {site.locality}
                    </SectionTitle>
                    <iframe
                        title={`Mapa de ${site.name}`}
                        src={mapUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-55 w-full overflow-hidden rounded-2xl border-0 md:h-105"
                    />
                    <p className="text-lg font-semibold">
                        {site.locality}, {site.province}, {site.country}
                    </p>
                    {site.location.text && (
                        <p className="text-base text-muted-foreground">
                            {site.location.text}
                        </p>
                    )}
                    <Button asChild variant="outline">
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Navigation />
                            Cómo llegar
                        </a>
                    </Button>
                </section>
            </div>
        </main>
    );
}
