import { Star } from 'lucide-react';
import { type ReactNode } from 'react';

import type { Review } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ReviewStars({
    rating,
    className,
}: {
    rating: number;
    className?: string;
}) {
    return (
        <span
            className={cn('flex items-center gap-0.5', className)}
            role="img"
            aria-label={`${rating} de 5 estrellas`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        'size-4',
                        star <= rating
                            ? 'fill-brand-accent text-brand-accent'
                            : 'text-muted-foreground/40',
                    )}
                />
            ))}
        </span>
    );
}

/** A traveler's review: first name, month, stars and comment. `children` adds badges or actions. */
export function ReviewCard({
    review,
    children,
}: {
    review: Review;
    children?: ReactNode;
}) {
    return (
        <article className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-semibold">{review.author_name}</p>
                {review.month && (
                    <p className="text-sm text-muted-foreground">{review.month}</p>
                )}
                {children}
            </div>
            <ReviewStars rating={review.rating} />
            {review.comment && (
                <p className="text-base break-words whitespace-pre-line">
                    {review.comment}
                </p>
            )}
        </article>
    );
}
