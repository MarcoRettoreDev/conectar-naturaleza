import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[]): string {
    const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

    useEffect(() => {
        if (sectionIds.length === 0) {
            return;
        }

        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);

        if (elements.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (first, second) =>
                            second.intersectionRatio -
                            first.intersectionRatio,
                    );

                const mostVisible = visibleEntries[0];

                if (mostVisible?.target.id) {
                    setActiveSection(mostVisible.target.id);
                }
            },
            {
                rootMargin: '-35% 0px -45% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
        };
    }, [sectionIds]);

    return activeSection;
}

export function scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if (!element) {
        return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
