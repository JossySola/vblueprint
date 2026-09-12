'use client'
import type { Shape } from "konva/lib/Shape";
import type { Transformer } from "konva/lib/shapes/Transformer";
import { useCallback, useEffect, useRef } from "react";
import type { SHAPE_TYPE } from "../types";
import type { KonvaEventObject } from "konva/lib/Node";

export default function useEditableShapeCallbacks(
    shape: SHAPE_TYPE,
    selected: boolean,
    onSelect: () => void,
    onCommit: (next: SHAPE_TYPE) => void
) {
    const shapeRef = useRef<Shape | null>(null);
    const transformerRef = useRef<Transformer | null>(null);

    useEffect(() => {
        if (selected && shapeRef.current && transformerRef.current) {
            transformerRef.current.nodes([shapeRef.current]);
            transformerRef.current.getLayer()!.batchDraw();
        }
    }, [selected]);

    const setShapeRef = useCallback((node: Shape | null) => {
        shapeRef.current = node;
    }, []);

    // Paths retain scale because their geometry comes from path data.
    // Other shapes fold the Transformer scale into their size properties.
    const handleTransformEnd = () => {
        const node = shapeRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const base = { x: node.x(), y: node.y(), rotation: node.rotation() };

        if (shape.type === 'outfit' || shape.type === 'path') {
            onCommit({ ...shape, ...base, scaleX, scaleY });
            return;
        }

        const average = (scaleX + scaleY) / 2;
        node.scaleX(1);
        node.scaleY(1);

        if (shape.type === 'rect'
            || shape.type === 'table'
            || shape.type === 'wall'
            || shape.type === 'wood'
            || shape.type === 'asphalt'
            || shape.type === 'brick'
            || shape.type === 'steel'
            || shape.type === 'brickslight'
        ) {
            onCommit({
                ...shape,
                ...base,
                width: Math.max(20, node.width() * scaleX),
                height: Math.max(20, node.height() * scaleY),
            });
        } else if (shape.type === 'circle' || shape.type === 'ring') {
            onCommit({ ...shape, ...base, radius: Math.max(10, shape.radius * average) });
        } else if (shape.type === 'star') {
            onCommit({
                ...shape,
                ...base,
                innerRadius: Math.max(6, shape.innerRadius * average),
                outerRadius: Math.max(12, shape.outerRadius * average),
            });
        } else {
            onCommit({ ...shape, ...base, fontSize: Math.max(8, shape.fontSize * average) });
        }
    };

    const common = {
        ref: setShapeRef,
        draggable: true,
        onClick: onSelect,
        onTap: onSelect,
        onDragEnd: (event: KonvaEventObject<DragEvent>) =>
            onCommit({ ...shape, x: event.target.x(), y: event.target.y() }),
        onTransformEnd: handleTransformEnd,
    };

    return { common, transformerRef };
}
