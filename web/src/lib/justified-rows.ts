export interface JustifiedRow {
    /** Index of the row's first photo. */
    start: number;
    /** Index after the row's last photo. */
    end: number;
    height: number;
}

const MAX_PER_ROW = 5;
const MAX_VERTICALS_PER_ROW = 3;

/**
 * Justified rows: every photo keeps its proportion (`ratios` are width / height) and rows fill `width`. The breaks
 * are chosen over the whole list so that every row stays close to `target` height, and a row that leaves width
 * empty costs more, much more when it isn't the last one, so short rows only appear when unavoidable and at the end.
 * A row of only verticals holds at most three; with fewer, they keep the size they'd have three to a row.
 */
export function justifiedRows(
    ratios: number[],
    width: number,
    target: number,
    gap: number,
): JustifiedRow[] {
    const sum = (start: number, end: number) =>
        ratios.slice(start, end).reduce((total, ratio) => total + ratio, 0);
    const allVertical = (start: number, end: number) =>
        ratios.slice(start, end).every((ratio) => ratio < 1);
    const rowHeight = (start: number, end: number) => {
        const count = end - start;
        const height = (width - gap * (count - 1)) / sum(start, end);

        return allVertical(start, end) && count < MAX_VERTICALS_PER_ROW
            ? Math.min(
                  height,
                  (width - gap * (MAX_VERTICALS_PER_ROW - 1)) /
                      ((MAX_VERTICALS_PER_ROW * sum(start, end)) / count),
              )
            : height;
    };
    const cost = (start: number, end: number) => {
        const height = rowHeight(start, end);
        const filled =
            (height * sum(start, end) + gap * (end - start - 1)) / width;

        return (
            Math.log(height / target) ** 2 +
            0.3 * Math.max(0, 1 - filled) * (end === ratios.length ? 1 : 3)
        );
    };

    const best = [{ cost: 0, from: -1 }];
    for (let end = 1; end <= ratios.length; end++) {
        best[end] = { cost: Infinity, from: 0 };
        for (let start = Math.max(0, end - MAX_PER_ROW); start < end; start++) {
            if (
                allVertical(start, end) &&
                end - start > MAX_VERTICALS_PER_ROW
            ) {
                continue;
            }
            const total = best[start].cost + cost(start, end);
            if (total < best[end].cost) {
                best[end] = { cost: total, from: start };
            }
        }
    }

    const rows: JustifiedRow[] = [];
    for (let end = ratios.length; end > 0; end = best[end].from) {
        rows.unshift({
            start: best[end].from,
            end,
            height: rowHeight(best[end].from, end),
        });
    }

    return rows;
}
