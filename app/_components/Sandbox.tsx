'use client'
import { Group, Layer, Line, Stage } from "react-konva";
import EditableShape from "./EditableShape";
import { CAMERA, SHAPE_TYPE, VIEWPORT } from "@/lib/types";
import { Html } from "react-konva-utils";
import { AlignmentGuide, getAlignmentGuides } from "@/lib/alignmentGuides";
import TemplateRingMenu from './TemplateRingMenu';
import { Dispatch, RefObject, SetStateAction } from "react";
import { Stage as StageType } from "konva/lib/Stage";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";

export default function Sandbox({ viewport, camera, handleWheel, alignment, setAlignment, updateShape, stageRef, history, addShape, selectedId, setSelectedId, handleShapeContextMenu }: {
    viewport: VIEWPORT,
    camera: CAMERA,
    handleWheel: (e: KonvaEventObject<WheelEvent, Node<NodeConfig>>) => void,
    alignment: { id: string, guides: AlignmentGuide[] } | null,
    setAlignment: Dispatch<SetStateAction<{
        id: string;
        guides: AlignmentGuide[];
    } | null>>,
    updateShape: (next: SHAPE_TYPE) => void,
    stageRef: RefObject<StageType | null>,
    history: { past: SHAPE_TYPE[][]; present: SHAPE_TYPE[]; future: SHAPE_TYPE[][] }
    addShape: (type:         
        "rect" 
        | "circle" 
        | "text" 
        | "table" 
        | "wall" 
        | "keylook" 
        | "wood" 
        | "asphalt" 
        | "brick" 
        | "steel"
        | "brickslight"
        | "terrazzo") => void,
    selectedId: string | null,
    setSelectedId: Dispatch<SetStateAction<string | null>>,
    handleShapeContextMenu: (event: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => void,
}) {

    // Wait for the browser measurement before creating the canvas.
    if (!viewport.width || !viewport.height) return null;

    return (
        <TemplateRingMenu camera={camera} addShape={addShape}>
            <Stage 
            ref={stageRef}
            width={viewport.width} 
            height={viewport.height} 
            onWheel={handleWheel}
            onContextMenu={handleShapeContextMenu}
            onMouseDown={(e) => {
                if (e.target === e.target.getStage()) setSelectedId(null);
            }}
            onTouchStart={(e) => {
                if (e.target === e.target.getStage()) setSelectedId(null);
            }}>
                <Layer>
                    <Group
                    x={-camera.x}
                    y={-camera.y}
                    onDragStart={(event) => {
                        if (event.target.hasName('editable-shape')) {
                            setSelectedId(event.target.id());
                            setAlignment(null);
                        }
                    }}
                    onDragMove={(event) => {
                        const node = event.target;
                        const parent = node.getParent();
                        if (!parent || !node.hasName('editable-shape')) return;
                        const others = parent.getChildren()
                            .filter((child) => child !== node && child.hasName('editable-shape') && child.isVisible())
                            .map((child) => child.getClientRect({ relativeTo: parent, skipShadow: true }));
                        setAlignment({
                            id: node.id(),
                            guides: getAlignmentGuides(node.getClientRect({ relativeTo: parent, skipShadow: true }), others),
                        });
                    }}
                    onDragEnd={() => setAlignment(null)}>
                        {/* Render furniture here using its saved world x/y coordinates.
                            The Group applies the camera offset to every child automatically. */}
                        {history.present.map((shape: SHAPE_TYPE) => (
                        <EditableShape
                        key={shape.id}
                        shape={shape}
                        selected={shape.id === selectedId}
                        onSelect={() => setSelectedId(shape.id)}
                        onCommit={updateShape}/>
                        ))}
                        {alignment && history.present.some((shape) => shape.id === alignment.id) &&
                            alignment.guides.map((guide) => (
                                <Line
                                    key={`${guide.axis}-${guide.kind}`}
                                    points={guide.points}
                                    stroke="#42a5f5"
                                    strokeWidth={2}
                                    dash={guide.kind === 'center' ? [2, 4] : [6, 4]}
                                    listening={false}
                                />
                            ))}
                        <Html>
                            {/* Canvas pixels mean nothing to a screen reader. Mirror the document in HTML. */}
                            <p style={{ marginTop: 12, marginBottom: 6 }}>Objects:</p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {history.present.map((shape: SHAPE_TYPE) => (
                                <button
                                key={shape.id}
                                style={{
                                    borderColor: shape.id === selectedId ? '#2563eb' : '#cbd5e1',
                                }}
                                aria-pressed={shape.id === selectedId}
                                onClick={() => setSelectedId(shape.id)}
                                >
                                    {shape.id}
                                </button>
                                ))}
                            </div>
                            {
                                JSON.stringify(history.present)
                            }
                        </Html>
                    </Group>
                </Layer>
            </Stage>
        </TemplateRingMenu>
    )
}