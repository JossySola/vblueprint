'use client'
import { Circle, Rect, Star, Text, Transformer } from "react-konva";
import type { SHAPE_TYPE } from "@/lib/types";
import useEditableShapeCallbacks from "@/lib/custom-hooks/useEditableShapeCallbacks";

export default function EditableShape({ shape, selected, onSelect, onCommit } : {
    shape: SHAPE_TYPE,
    selected: boolean,
    onSelect: () => void,
    onCommit: (next: SHAPE_TYPE) => void,
}) {
    const { common, transformerRef } = useEditableShapeCallbacks(shape, selected, onSelect, onCommit);
    return (
        <>
        {shape.type === 'rect' && <Rect {...shape} {...common} />}
        {shape.type === 'circle' && <Circle {...shape} {...common} />}
        {shape.type === 'star' && <Star {...shape} {...common} />}
        {shape.type === 'text' && <Text {...shape} {...common} />}
        {selected && (
            <Transformer
            ref={transformerRef}
            rotateAnchorOffset={26}
            anchorStroke="#2563eb"
            borderStroke="#2563eb"
            anchorSize={9}
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) =>
                newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
            }
            />
        )}
        </>
    );
}
