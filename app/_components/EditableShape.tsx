'use client'
import { Circle, Image, Path, Rect, Star, Text, Transformer } from "react-konva";
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
        {shape.type === 'table' && <Rect {...shape} {...common} />}
        {shape.type === 'wall' && <Rect {...shape} {...common} />}
        {shape.type === 'circle' && <Circle {...shape} {...common} />}
        {shape.type === 'star' && <Star {...shape} {...common} />}
        {shape.type === 'text' && <Text {...shape} {...common} />}
        {shape.type === 'path' && <Path {...shape} {...common} />}
        {shape.type === 'outfit' && <Path {...shape} {...common} />}
        {shape.type === 'wood' && <Image {...shape} {...common} alt="Image with design texture representing a piece of furniture in the template" />}
        {shape.type === 'asphalt' && <Image {...shape} {...common} alt="Image with design texture representing a piece of furniture in the template" />}
        {shape.type === 'brick' && <Image {...shape} {...common} alt="Image with design texture representing a piece of furniture in the template" />}
        {shape.type === 'steel' && <Image {...shape} {...common} alt="Image with design texture representing a piece of furniture in the template" />}
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
