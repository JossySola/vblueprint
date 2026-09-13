'use client'
import { Group, Layer, Line, Shape, Stage } from "react-konva";
import useSandboxCallbacks from "@/lib/custom-hooks/useSandboxCallbacks";
import useShapeMenuOptions from "@/lib/custom-hooks/useShapeMenuOptions";
import useCanvasPixelRatio from "@/lib/custom-hooks/useCanvasPixelRatio";
import EditableShape from "../_components/EditableShape";
import { SHAPE_TYPE } from "@/lib/types";
import { Html } from "react-konva-utils";
import { getAlignmentGuides } from "@/lib/alignmentGuides";
import useTemplateCallbacks from "@/lib/custom-hooks/useTemplateCallbacks";

export default function NewTemplate() {
    const {
        spacing,
        dotRadius,
        camera,
        viewport,
        alignment,
        setAlignment,
        handleWheel,
    } = useTemplateCallbacks();
    const {
        setSelectedId,
        updateShape,
        handleStageKeyDown,
        stageRef,
        history,
        selectedId,
        addShape,
        redo,
        undo,
        commit,
    } = useSandboxCallbacks();
    useCanvasPixelRatio(stageRef, viewport.width, viewport.height);
    const { canDuplicate, handleShapeContextMenu, duplicateShape } = useShapeMenuOptions({
        shapes: history.present,
        selectedId,
        selectShape: setSelectedId,
        commit,
    });

    // Wait for the browser measurement before creating the canvas.
    if (!viewport.width || !viewport.height) return null;

    return (
        <section
        tabIndex={0}
        role="group"
        aria-label="Design canvas. Press Delete to remove the selected shape."
        onPointerDownCapture={(event) => event.currentTarget.focus({ preventScroll: true })}
        onKeyDown={handleStageKeyDown}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <button onClick={() => addShape('wall')}>Add wall</button>
                <button onClick={() => addShape('table')}>Add table</button>
                <button onClick={() => addShape('wood')}>Add wood</button>
                <button onClick={() => addShape('asphalt')}>Add asphalt</button>
                <button onClick={() => addShape('brick')}>Add brick</button>
                <button onClick={() => addShape('outfit')}>Add outfit</button>
                <button onClick={() => addShape('brickslight')}>Add light bricks</button>
                <button onClick={() => addShape('terrazzo')}>Add terrazzo</button>
                <button onClick={duplicateShape} disabled={!canDuplicate}>Duplicate</button>
                <button onClick={undo} disabled={history.past.length === 0}>Undo</button>
                <button onClick={redo} disabled={history.future.length === 0}>Redo</button>
            </div>
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
                    <Shape
                        fill="#b0b0b0a1"
                        listening={false}
                        perfectDrawEnabled={false}
                        sceneFunc={(context, shape) => {
                            // Repeat the grid around the camera, including a one-cell margin.
                            // Negative remainders are intentional: they keep a dot just offscreen.
                            const startX = (-camera.x % spacing.current) - spacing.current;
                            const startY = (-camera.y % spacing.current) - spacing.current;
                            context.beginPath();
                            for (let x = startX; x <= viewport.width + spacing.current; x += spacing.current) {
                                for (let y = startY; y <= viewport.height + spacing.current; y += spacing.current) {
                                    context.moveTo(x + dotRadius.current, y);
                                    context.arc(x, y, dotRadius.current, 0, Math.PI * 2);
                                }
                            }
                            // One Konva node and one fill operation, regardless of scroll distance.
                            context.fillStrokeShape(shape);
                        }}
                    />
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
                        onDragEnd={() => setAlignment(null)}
                    >
                        {/* Render furniture here using its saved world x/y coordinates.
                            The Group applies the camera offset to every child automatically. */}
                        {history.present.map((shape: SHAPE_TYPE) => (
                        <EditableShape
                            key={shape.id}
                            shape={shape}
                            selected={shape.id === selectedId}
                            onSelect={() => setSelectedId(shape.id)}
                            onCommit={updateShape}
                        />
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
                        </Html>
                    </Group>
                </Layer>
            </Stage>
        </section>
    )
}
