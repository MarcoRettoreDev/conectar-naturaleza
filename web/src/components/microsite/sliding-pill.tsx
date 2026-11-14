import { type RefObject, useLayoutEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Places a pill behind the item marked with `aria-current` inside a positioned nav and slides it
 * when that item changes. The pill moves straight on the DOM: measuring into state would render
 * twice per change. Only later changes animate, not the first placement.
 */
export function useSlidingPill<T extends HTMLElement>(activeKey: string) {
    const navRef = useRef<T>(null);
    const pillRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const nav = navRef.current!;
        const pill = pillRef.current!;
        const place = () => {
            const active = nav.querySelector<HTMLElement>('[aria-current]');
            pill.hidden = active === null;
            if (active !== null) {
                pill.style.translate = `${active.offsetLeft}px ${active.offsetTop}px`;
                pill.style.width = `${active.offsetWidth}px`;
                pill.style.height = `${active.offsetHeight}px`;
            }
        };

        place();
        const frame = requestAnimationFrame(() => {
            pill.dataset.animated = '';
        });
        window.addEventListener('resize', place);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', place);
        };
    }, [activeKey]);

    return { navRef, pillRef };
}

export function SlidingPill({
    ref,
    className,
}: {
    ref: RefObject<HTMLSpanElement | null>;
    className?: string;
}) {
    return (
        <span
            ref={ref}
            aria-hidden
            className={cn(
                'absolute top-0 left-0 rounded-full bg-muted data-animated:transition-[translate,width,height] data-animated:duration-300 data-animated:ease-out motion-reduce:transition-none',
                className,
            )}
        />
    );
}
