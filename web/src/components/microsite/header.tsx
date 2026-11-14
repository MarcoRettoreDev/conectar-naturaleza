import {
    Check,
    Facebook,
    Instagram,
    Link as LinkIcon,
    MessageCircle,
    Share2,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { SlidingPill, useSlidingPill } from './sliding-pill';

export interface MicrositeNavSection {
    id: string;
    label: string;
}

/** The microsite's sections, in the header on desktop; the active one has the sliding pill. */
export function MicrositeNav({
    sections,
    activeSection,
    onNavigate,
}: {
    sections: MicrositeNavSection[];
    activeSection: string;
    onNavigate: (sectionId: string) => void;
}) {
    const { navRef, pillRef } = useSlidingPill<HTMLElement>(activeSection);

    return (
        <nav ref={navRef} className="relative hidden gap-2 lg:flex">
            <SlidingPill ref={pillRef} />
            {sections.map((section) => (
                <button
                    key={section.id}
                    type="button"
                    onClick={() => onNavigate(section.id)}
                    aria-current={
                        activeSection === section.id ? 'location' : undefined
                    }
                    className="relative cursor-pointer rounded-full px-4 py-1.5 text-base"
                >
                    {section.label}
                </button>
            ))}
        </nav>
    );
}

/** Logo and name on the left, the sections in the middle, «Compartir» on the right. */
export default function MicrositeHeader({
    name,
    logoUrl,
    children,
}: {
    name: string;
    logoUrl: string;
    children?: React.ReactNode;
}) {
    const [copied, setCopied] = useState(false);
    const [instagramHint, setInstagramHint] = useState(false);

    const copyLink = async (): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch {
            return false;
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2500);

        return true;
    };

    // Read at click time: the header is also rendered at build time, where there is no `window`.
    const openShare = (build: (url: string) => string) => () =>
        window.open(
            build(window.location.href),
            '_blank',
            'noopener,noreferrer',
        );
    const options = [
        {
            label: 'WhatsApp',
            icon: MessageCircle,
            share: openShare(
                (url) =>
                    `https://wa.me/?text=${encodeURIComponent(`${name}: ${url}`)}`,
            ),
        },
        {
            label: 'Facebook',
            icon: Facebook,
            share: openShare(
                (url) =>
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            ),
        },
    ];

    // Instagram has no web link to share a URL: copy it so it can be pasted in a story, post or message.
    const shareOnInstagram = async () => {
        await copyLink();
        setInstagramHint(true);
        setTimeout(() => setInstagramHint(false), 4000);
        window.open('https://www.instagram.com/', '_blank', 'noopener');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
                <a
                    href="/"
                    className="flex shrink-0 items-center gap-3 justify-self-start text-base font-semibold"
                >
                    <img
                        src={logoUrl}
                        alt=""
                        width={64}
                        height={64}
                        className="size-16"
                    />
                    {name}
                </a>

                {children}

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="justify-self-end lg:col-start-3"
                        >
                            <Share2 />
                            <span className="max-sm:sr-only">Compartir</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-64 p-2">
                        <ul className="flex flex-col">
                            {options.map(({ label, icon: Icon, share }) => (
                                <li key={label}>
                                    <button
                                        type="button"
                                        onClick={share}
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-base hover:bg-muted"
                                    >
                                        <Icon className="size-5 text-icon-default" />
                                        {label}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    type="button"
                                    onClick={shareOnInstagram}
                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-base hover:bg-muted"
                                >
                                    <Instagram className="size-5 text-icon-default" />
                                    Instagram
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={copyLink}
                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-base hover:bg-muted"
                                >
                                    {copied ? (
                                        <Check className="size-5 text-success-text" />
                                    ) : (
                                        <LinkIcon className="size-5 text-icon-default" />
                                    )}
                                    {copied ? 'Enlace copiado' : 'Copiar enlace'}
                                </button>
                            </li>
                        </ul>
                        <p
                            aria-live="polite"
                            className="px-3 pt-1 text-sm text-muted-foreground empty:hidden"
                        >
                            {instagramHint
                                ? 'Enlace copiado: pegalo en Instagram.'
                                : ''}
                        </p>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}
