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
    let crop;

    // Canvas images use a source crop to reproduce centered object-fit: cover.
    if ((shape.type === 'brickslight' || shape.type === 'brick' || shape.type === 'asphalt' || shape.type === 'terrazzo' || shape.type === 'wood') && typeof HTMLImageElement !== 'undefined'
        && shape.image instanceof HTMLImageElement) {
        const imageWidth = shape.image.naturalWidth;
        const imageHeight = shape.image.naturalHeight;
        const targetWidth = shape.width ?? imageWidth;
        const targetHeight = shape.height ?? imageHeight;

        if (imageWidth > 0 && imageHeight > 0 && targetWidth > 0 && targetHeight > 0) {
            const scale = Math.max(targetWidth / imageWidth, targetHeight / imageHeight);
            const width = targetWidth / scale;
            const height = targetHeight / scale;
            crop = {
                x: (imageWidth - width) / 2,
                y: (imageHeight - height) / 2,
                width,
                height,
            };
        }
    }

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
        {shape.type === 'brickslight' && <Image {...shape} {...common} crop={crop} alt="Image with design texture representing a piece of furniture in the template" />}
        {shape.type === 'terrazzo' && <Image {...shape} {...common} alt="Image with design texture representing a piece of furniture in the template" />}
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
