import type { GalleryPhoto } from "@/lib/types";

/**
 * The CSS `object-position` that keeps the focus in view when a photo of `width`×`height` fills a box of
 * `boxRatio` (width / height) with `object-fit: cover`.
 */
export function focusPosition(photo: GalleryPhoto, boxRatio: number): string {
    const ratio = photo.width / photo.height;
    const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);

    if (ratio > boxRatio) {
        const visible = boxRatio / ratio;
        const start = clamp(photo.focus_x - visible / 2, 0, 1 - visible);

        return `${(start / (1 - visible)) * 100}% 50%`;
    }

    const visible = ratio / boxRatio;
    if (visible >= 1) {
        return '50% 50%';
    }
    const start = clamp(photo.focus_y - visible / 2, 0, 1 - visible);

    return `50% ${(start / (1 - visible)) * 100}%`;
}
