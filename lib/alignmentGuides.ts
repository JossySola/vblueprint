export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface AlignmentGuide {
    axis: 'x' | 'y';
    kind: 'alignment' | 'center';
    points: number[];
}

// Compare the visible edges and centers, including rotated/scaled bounds.
export function getAlignmentGuides(moving: Bounds, others: Bounds[], tolerance = 6): AlignmentGuide[] {
    const guides: AlignmentGuide[] = [];
    for (const axis of ['x', 'y'] as const) {
        const cross = axis === 'x' ? 'y' : 'x';
        const size = axis === 'x' ? 'width' : 'height';
        const crossSize = axis === 'x' ? 'height' : 'width';
        let best: { distance: number; position: number; start: number; end: number } | undefined;
        let bestCenter: typeof best;
        for (const other of others) {
            const gap = Math.max(other[cross] - moving[cross] - moving[crossSize],
                moving[cross] - other[cross] - other[crossSize], 0);
            if (gap > 300) continue;
            const center = other[axis] + other[size] / 2;
            const centerDistance = Math.abs(moving[axis] + moving[size] / 2 - center);
            if (centerDistance <= tolerance && (!bestCenter || centerDistance < bestCenter.distance)) {
                bestCenter = {
                    distance: centerDistance,
                    position: center,
                    start: Math.min(moving[cross], other[cross]) - 16,
                    end: Math.max(moving[cross] + moving[crossSize], other[cross] + other[crossSize]) + 16,
                };
            }
            for (const from of [0, 0.5, 1]) {
                for (const to of [0, 0.5, 1]) {
                    const position = other[axis] + other[size] * to;
                    const distance = Math.abs(moving[axis] + moving[size] * from - position);
                    if (distance > tolerance || (best && distance >= best.distance)) continue;
                    best = {
                        distance, position,
                        start: Math.min(moving[cross], other[cross]) - 16,
                        end: Math.max(moving[cross] + moving[crossSize], other[cross] + other[crossSize]) + 16,
                    };
                }
            }
        }
        if (best && (!bestCenter || best.position !== bestCenter.position)) guides.push({ axis, kind: 'alignment', points: axis === 'x'
            ? [best.position, best.start, best.position, best.end]
            : [best.start, best.position, best.end, best.position] });
        // Keep center-to-center matches even when an edge is closer.
        if (bestCenter) guides.push({ axis, kind: 'center', points: axis === 'x'
            ? [bestCenter.position, bestCenter.start, bestCenter.position, bestCenter.end]
            : [bestCenter.start, bestCenter.position, bestCenter.end, bestCenter.position] });
    }
    return guides;
}
