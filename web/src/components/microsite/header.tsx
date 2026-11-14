import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

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

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch {
            return;
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
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

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyLink}
                    className="justify-self-end lg:col-start-3"
                >
                    {copied ? (
                        <Check className="text-success-text" />
                    ) : (
                        <Share2 />
                    )}
                    <span className="max-sm:sr-only" aria-live="polite">
                        {copied ? 'Link copiado' : 'Compartir'}
                    </span>
                </Button>
            </div>
        </header>
    );
}
