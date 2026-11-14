import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { describeBed } from '@/lib/beds';
import { focusPosition } from '@/lib/gallery';
import { justifiedRows } from '@/lib/justified-rows';
import type { GalleryPhoto, GallerySpace, PublicGallery } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PhotoGalleryProps {
    gallery: PublicGallery;
    accommodationName: string;
}

/** A photo in gallery order: ambiente by ambiente, each in its own order. */
interface OrderedPhoto {
    photo: GalleryPhoto;
    space: GallerySpace;
    /** Position inside its ambiente, from 0. */
    index: number;
}

/** Every hero slot (desktop grid and phone carousel) is about this wide for its height. */
const HERO_RATIO = 1.3;
const GAP = 12;
/** Below this width the gallery is one column; from it, justified rows. */
const ROWS_FROM = 720;
const DESKTOP_FROM = 1024;

const scrollBehavior = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth';

const altOf = (photo: GalleryPhoto, space: GallerySpace, name: string) =>
    photo.alt_text ?? `${name} – ${space.name}`;

/**
 * Figma «Grilla de fotos» (2053:1967) on desktop and «Carrusel de fotos» (2053:2494) on mobile, cropped by each
 * photo's focus. The photo opens the gallery at its ambiente.
 */
function PhotoHero({
    hero,
    carousel,
    accommodationName,
    onOpen,
}: {
    hero: GalleryPhoto[];
    carousel: GalleryPhoto[];
    accommodationName: string;
    onOpen: (photo?: GalleryPhoto) => void;
}) {
    const [visibleIndex, setVisibleIndex] = useState(0);

    if (hero.length === 0) {
        return (
            <div className="flex h-75 items-center justify-center rounded-2xl bg-muted text-muted-foreground md:h-120">
                Todavía no hay fotos
            </div>
        );
    }

    const heroImage = (photo: GalleryPhoto, index: number) => (
        <img
            src={photo.large_url}
            alt={photo.alt_text ?? `${accommodationName} ${index + 1}`}
            loading={index === 0 ? undefined : 'lazy'}
            style={{ objectPosition: focusPosition(photo, HERO_RATIO) }}
            className="h-full w-full object-cover transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
        />
    );
    const [primaryPhoto, ...gridPhotos] = hero;

    return (
        <>
            <div className="relative -mx-4 md:hidden">
                <div
                    className="flex h-75 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
                    onScroll={(event) =>
                        setVisibleIndex(
                            Math.round(
                                event.currentTarget.scrollLeft /
                                    event.currentTarget.clientWidth,
                            ),
                        )
                    }
                >
                    {carousel.map((photo, index) => (
                        <button
                            key={photo.id}
                            type="button"
                            onClick={() => onOpen(photo)}
                            className="h-full w-full shrink-0 snap-center"
                        >
                            {heroImage(photo, index)}
                        </button>
                    ))}
                </div>
                <span className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-[rgb(28_38_31/0.75)] px-3 py-1 text-sm font-medium text-white">
                    {visibleIndex + 1} / {carousel.length}
                </span>
            </div>

            <div className="relative hidden h-120 gap-3 md:flex">
                <button
                    type="button"
                    onClick={() => onOpen(primaryPhoto)}
                    className="flex-1 overflow-hidden rounded-2xl"
                >
                    {heroImage(primaryPhoto, 0)}
                </button>
                {gridPhotos.length > 0 && (
                    <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3">
                        {gridPhotos.map((photo, index) => (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={() => onOpen(photo)}
                                className="overflow-hidden rounded-2xl"
                            >
                                {heroImage(photo, index + 1)}
                            </button>
                        ))}
                    </div>
                )}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen()}
                    className="absolute right-4 bottom-4 hover:bg-background hover:bg-[image:linear-gradient(var(--accent),var(--accent))]"
                >
                    <Images />
                    Ver las {carousel.length} fotos
                </Button>
            </div>
        </>
    );
}

/**
 * The ambiente's photos in justified rows, uncropped; on a phone, one column with each photo at most 80 % of the
 * screen high.
 */
function SpacePhotos({
    space,
    accommodationName,
    onOpen,
}: {
    space: GallerySpace;
    accommodationName: string;
    onOpen: (photo: GalleryPhoto) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [frame, setFrame] = useState<{
        width: number;
        viewportWidth: number;
        viewportHeight: number;
    } | null>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        const observer = new ResizeObserver(() =>
            setFrame({
                width: element.clientWidth,
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
            }),
        );
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const ratios = space.photos.map((photo) => photo.width / photo.height);
    const rows = !frame
        ? []
        : frame.viewportWidth < ROWS_FROM
          ? space.photos.map((_, index) => ({
                start: index,
                end: index + 1,
                height: Math.min(
                    frame.width / ratios[index],
                    frame.viewportHeight * 0.8,
                ),
            }))
          : justifiedRows(
                ratios,
                frame.width,
                frame.viewportWidth < DESKTOP_FROM ? 260 : 300,
                GAP,
            );

    return (
        <div ref={ref} className="flex min-w-0 flex-col gap-3">
            {rows.map((row) => (
                <div
                    key={row.start}
                    className="flex gap-3 max-[719px]:justify-center"
                >
                    {space.photos
                        .slice(row.start, row.end)
                        .map((photo, offset) => (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={() => onOpen(photo)}
                                aria-label={`Ampliar: ${altOf(photo, space, accommodationName)}`}
                                style={{
                                    width: Math.floor(
                                        row.height * ratios[row.start + offset],
                                    ),
                                    height: Math.floor(row.height),
                                }}
                                className="shrink-0 cursor-zoom-in overflow-hidden rounded-2xl bg-muted"
                            >
                                <img
                                    src={photo.medium_url}
                                    alt={altOf(photo, space, accommodationName)}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                </div>
            ))}
        </div>
    );
}

function Lightbox({
    photos,
    index,
    accommodationName,
    onMove,
    onClose,
}: {
    photos: OrderedPhoto[];
    index: number;
    accommodationName: string;
    onMove: (step: number) => void;
    onClose: () => void;
}) {
    const touchStart = useRef<number | null>(null);
    const { photo, space, index: spaceIndex } = photos[index];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                onMove(event.key === 'ArrowRight' ? 1 : -1);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onMove]);

    const navButton =
        'absolute top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:block';

    return (
        <div
            className="fixed inset-0 z-60 flex flex-col bg-[#0f1411] text-white"
            role="dialog"
            aria-modal="true"
            aria-label="Foto ampliada"
            onTouchStart={(event) => {
                touchStart.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
                const distance =
                    event.changedTouches[0].clientX - (touchStart.current ?? 0);
                if (Math.abs(distance) > 50) {
                    onMove(distance < 0 ? 1 : -1);
                }
                touchStart.current = null;
            }}
        >
            <div className="flex items-center gap-3 px-4 py-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-white/10"
                    aria-label="Cerrar foto"
                >
                    <X className="h-6 w-6" />
                </button>
                <p className="font-semibold">
                    {space.name}{' '}
                    <span className="font-normal text-white/70 tabular-nums">
                        · {spaceIndex + 1} de {space.photos.length}
                    </span>
                </p>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 pb-8 md:px-20">
                <img
                    src={photo.large_url}
                    alt={altOf(photo, space, accommodationName)}
                    className="max-h-full max-w-full rounded-xl object-contain"
                />
                {photos.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => onMove(-1)}
                            className={cn(navButton, 'left-4')}
                            aria-label="Foto anterior"
                        >
                            <ChevronLeft className="h-7 w-7" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onMove(1)}
                            className={cn(navButton, 'right-4')}
                            aria-label="Foto siguiente"
                        >
                            <ChevronRight className="h-7 w-7" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

/**
 * The hero, and the gallery it opens: every ambiente in one scroll, with a bar to jump between them, its text and
 * beds beside its photos, and the photos in justified rows (decided 1 Nov 2026).
 */
export default function PhotoGallery({
    gallery,
    accommodationName,
}: PhotoGalleryProps) {
    const [open, setOpen] = useState(false);
    const [startSpaceId, setStartSpaceId] = useState<number | null>(null);
    const [activeSpaceId, setActiveSpaceId] = useState<number | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef(new Map<number, HTMLElement>());
    const chipRefs = useRef(new Map<number, HTMLButtonElement>());

    const ordered = useMemo<OrderedPhoto[]>(
        () =>
            gallery.spaces.flatMap((space) =>
                space.photos.map((photo, index) => ({ photo, space, index })),
            ),
        [gallery],
    );
    const carousel = useMemo(
        () => [
            ...gallery.hero,
            ...ordered
                .map(({ photo }) => photo)
                .filter(
                    (photo) =>
                        !gallery.hero.some((hero) => hero.id === photo.id),
                ),
        ],
        [gallery.hero, ordered],
    );

    const scrollToSpace = useCallback(
        (spaceId: number, behavior: ScrollBehavior) => {
            const container = scrollRef.current;
            const section = sectionRefs.current.get(spaceId);
            if (!container || !section) {
                return;
            }
            container.scrollTo({
                top:
                    section.offsetTop -
                    (headerRef.current?.offsetHeight ?? 0) -
                    16,
                behavior,
            });
            setActiveSpaceId(spaceId);
        },
        [],
    );

    useEffect(() => {
        if (!open) {
            return;
        }
        const frame = requestAnimationFrame(() => {
            if (startSpaceId === null) {
                scrollRef.current?.scrollTo({ top: 0 });
                setActiveSpaceId(gallery.spaces[0]?.id ?? null);
            } else {
                scrollToSpace(startSpaceId, 'auto');
            }
        });

        return () => cancelAnimationFrame(frame);
    }, [open, startSpaceId, gallery.spaces, scrollToSpace]);

    useEffect(() => {
        if (activeSpaceId !== null) {
            chipRefs.current
                .get(activeSpaceId)
                ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }, [activeSpaceId]);

    const followScroll = () => {
        const container = scrollRef.current;
        if (!container) {
            return;
        }
        if (
            container.scrollTop + container.clientHeight >=
            container.scrollHeight - 4
        ) {
            setActiveSpaceId(gallery.spaces[gallery.spaces.length - 1].id);

            return;
        }
        const line =
            container.scrollTop + (headerRef.current?.offsetHeight ?? 0) + 24;
        const current = gallery.spaces
            .filter(
                (space) =>
                    (sectionRefs.current.get(space.id)?.offsetTop ?? 0) <= line,
            )
            .at(-1);
        setActiveSpaceId((current ?? gallery.spaces[0]).id);
    };

    const openGallery = (photo?: GalleryPhoto) => {
        setLightboxIndex(null);
        setStartSpaceId(
            ordered.find((item) => item.photo.id === photo?.id)?.space.id ??
                null,
        );
        setOpen(true);
    };

    const moveLightbox = useCallback(
        (step: number) =>
            setLightboxIndex((current) =>
                current === null
                    ? null
                    : (current + step + ordered.length) % ordered.length,
            ),
        [ordered.length],
    );

    return (
        <>
            <Sheet
                open={open}
                onOpenChange={(next) => {
                    setLightboxIndex(null);
                    setOpen(next);
                }}
            >
                <SheetContent
                    side="bottom"
                    aria-describedby={undefined}
                    className="inset-0 h-full w-full max-w-none gap-0 border-0 p-0 sm:max-w-none [&>button]:hidden"
                    onEscapeKeyDown={(event) => {
                        if (lightboxIndex !== null) {
                            event.preventDefault();
                            setLightboxIndex(null);
                        }
                    }}
                >
                    <div
                        ref={scrollRef}
                        onScroll={followScroll}
                        className="relative h-full overflow-y-auto overscroll-contain bg-background"
                    >
                        <div
                            ref={headerRef}
                            className="sticky top-0 z-10 border-b border-border bg-background"
                        >
                            <div className="mx-auto flex max-w-310 flex-col gap-2 px-4 pt-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="rounded-full p-2 hover:bg-muted"
                                        aria-label="Cerrar las fotos"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <SheetTitle className="text-lg font-semibold">
                                        {accommodationName}
                                    </SheetTitle>
                                    <span className="text-muted-foreground tabular-nums">
                                        {ordered.length} fotos
                                    </span>
                                </div>
                                <nav
                                    aria-label="Ambientes"
                                    className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none]"
                                >
                                    {gallery.spaces.map((space) => (
                                        <button
                                            key={space.id}
                                            ref={(element) => {
                                                if (element) {
                                                    chipRefs.current.set(
                                                        space.id,
                                                        element,
                                                    );
                                                } else {
                                                    chipRefs.current.delete(
                                                        space.id,
                                                    );
                                                }
                                            }}
                                            type="button"
                                            aria-current={
                                                space.id === activeSpaceId
                                            }
                                            onClick={() =>
                                                scrollToSpace(
                                                    space.id,
                                                    scrollBehavior(),
                                                )
                                            }
                                            className={cn(
                                                'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap',
                                                space.id === activeSpaceId
                                                    ? 'border-foreground bg-foreground text-background'
                                                    : 'border-border bg-background hover:bg-muted',
                                            )}
                                        >
                                            {space.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        <div className="mx-auto flex max-w-310 flex-col gap-14 px-4 pt-7 pb-24 max-md:gap-10">
                            {gallery.spaces.map((space) => (
                                <section
                                    key={space.id}
                                    ref={(element) => {
                                        if (element) {
                                            sectionRefs.current.set(
                                                space.id,
                                                element,
                                            );
                                        } else {
                                            sectionRefs.current.delete(
                                                space.id,
                                            );
                                        }
                                    }}
                                    aria-labelledby={`ambiente-${space.id}`}
                                    className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10"
                                >
                                    <div className="flex flex-col gap-2 self-start lg:sticky lg:top-32">
                                        <h3
                                            id={`ambiente-${space.id}`}
                                            className="text-2xl font-bold"
                                        >
                                            {space.name}
                                        </h3>
                                        {space.shared && (
                                            <p className="text-sm font-medium">
                                                Compartido con otros huéspedes
                                            </p>
                                        )}
                                        {space.beds.length > 0 && (
                                            <p className="font-semibold">
                                                {space.beds
                                                    .map(describeBed)
                                                    .join(' · ')}
                                            </p>
                                        )}
                                        {space.description && (
                                            <p className="text-muted-foreground">
                                                {space.description}
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground tabular-nums">
                                            {space.photos.length === 1
                                                ? '1 foto'
                                                : `${space.photos.length} fotos`}
                                        </p>
                                    </div>
                                    <SpacePhotos
                                        space={space}
                                        accommodationName={accommodationName}
                                        onOpen={(photo) =>
                                            setLightboxIndex(
                                                ordered.findIndex(
                                                    (item) =>
                                                        item.photo.id ===
                                                        photo.id,
                                                ),
                                            )
                                        }
                                    />
                                </section>
                            ))}
                        </div>
                    </div>

                    {lightboxIndex !== null && (
                        <Lightbox
                            photos={ordered}
                            index={lightboxIndex}
                            accommodationName={accommodationName}
                            onMove={moveLightbox}
                            onClose={() => setLightboxIndex(null)}
                        />
                    )}
                </SheetContent>
            </Sheet>

            <PhotoHero
                hero={gallery.hero}
                carousel={carousel}
                accommodationName={accommodationName}
                onOpen={openGallery}
            />
        </>
    );
}
