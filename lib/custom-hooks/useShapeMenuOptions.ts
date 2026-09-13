'use client'
import { useState } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { SHAPE_TYPE } from '@/lib/types';

interface ShapeMenuOptions {
    shapes: SHAPE_TYPE[];
    selectedId: string | null;
    selectShape: (id: string) => void;
    commit: (shapes: SHAPE_TYPE[]) => void;
}

export default function useShapeMenuOptions({ shapes, selectedId, selectShape, commit }: ShapeMenuOptions) {
    const [targetId, setTargetId] = useState<string | null>(null);
    const target = shapes.find((shape) => shape.id === targetId);
    const canDuplicate = target !== undefined && selectedId === targetId;

    const handleShapeContextMenu = (event: KonvaEventObject<PointerEvent>) => {
        const node = event.target;
        if (!node.hasName('editable-shape') || !shapes.some((shape) => shape.id === node.id())) {
            setTargetId(null);
            return;
        }
        event.evt.preventDefault();
        setTargetId(node.id());
        selectShape(node.id());
    };

    const duplicateShape = () => {
        if (!canDuplicate || !target) return;
        // Keep image references and path attributes intact; offset the copy so it is visible.
        const duplicate: SHAPE_TYPE = {
            ...target,
            id: `${target.type}-${crypto.randomUUID()}`,
            x: target.x + 20,
            y: target.y + 20,
        };
        commit([...shapes, duplicate]);
        selectShape(duplicate.id);
        setTargetId(null);
    };

    return { canDuplicate, handleShapeContextMenu, duplicateShape };
}
