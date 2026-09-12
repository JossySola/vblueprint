'use client'
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Group, Layer, Shape, Stage } from "react-konva";
import useSandboxCallbacks from "@/lib/custom-hooks/useSandboxCallbacks";
import EditableShape from "../_components/EditableShape";
import { SHAPE_TYPE } from "@/lib/types";
import { Html } from "react-konva-utils";

const spacing = 40;
const dotRadius = 1;
const wheelLineHeight = 16; // Approximate pixels per line for line-mode mouse wheels.

export default function NewTemplate() {
    // Camera coordinates describe the world position at the viewport's top-left.
    // Scrolling changes these coordinates, never the size or scale of the Stage.
    const [camera, setCamera] = useState({ x: 0, y: 0 });
    const pendingScroll = useRef({ x: 0, y: 0 });
    const scrollFrame = useRef<number | null>(null);
    // Start with the same dimensions on the server and during hydration.
    const [viewport, setViewport] = useState({ width: 0, height: 0 });
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
    } = useSandboxCallbacks();

    useEffect(() => {
        // Effects only run in the browser, where `window` is available.
        const updateViewport = () => setViewport({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        const frame = window.requestAnimationFrame(updateViewport);
        window.addEventListener('resize', updateViewport);
        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('resize', updateViewport);
            if (scrollFrame.current !== null) {
                window.cancelAnimationFrame(scrollFrame.current);
                scrollFrame.current = null;
            }
        };
    }, []);

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const { deltaMode, shiftKey } = e.evt;
        let { deltaX, deltaY } = e.evt;
        // Shift + wheel pans horizontally; trackpad horizontal input works directly.
        if (shiftKey && deltaX === 0) {
            deltaX = deltaY;
            deltaY = 0;
        }
        // Wheel deltas may be pixels (0), lines (1), or pages (2).
        const unitX = deltaMode === 1 ? wheelLineHeight : deltaMode === 2 ? viewport.width : 1;
        const unitY = deltaMode === 1 ? wheelLineHeight : deltaMode === 2 ? viewport.height : 1;
        pendingScroll.current.x += deltaX * unitX;
        pendingScroll.current.y += deltaY * unitY;

        // Accumulate every event, but update React at most once per animation frame.
        if (scrollFrame.current !== null) return;
        scrollFrame.current = window.requestAnimationFrame(() => {
            const delta = pendingScroll.current;
            pendingScroll.current = { x: 0, y: 0 };
            scrollFrame.current = null;
            setCamera(current => ({ x: current.x + delta.x, y: current.y + delta.y }));
        });
    };

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
                <button onClick={() => addShape('rect')}>Add rectangle</button>
                <button onClick={() => addShape('circle')}>Add circle</button>
                <button onClick={() => addShape('text')}>Add text</button>
                <button onClick={undo} disabled={history.past.length === 0}>Undo</button>
                <button onClick={redo} disabled={history.future.length === 0}>Redo</button>
            </div>
            <Stage 
            ref={stageRef}
            width={viewport.width} 
            height={viewport.height} 
            onWheel={handleWheel}
            onMouseDown={(e) => {
                if (e.target === e.target.getStage()) setSelectedId(null);
            }}
            onTouchStart={(e) => {
                if (e.target === e.target.getStage()) setSelectedId(null);
            }}>
                <Layer>
                    <Shape
                        fill="#ccc"
                        listening={false}
                        perfectDrawEnabled={false}
                        sceneFunc={(context, shape) => {
                            // Repeat the grid around the camera, including a one-cell margin.
                            // Negative remainders are intentional: they keep a dot just offscreen.
                            const startX = (-camera.x % spacing) - spacing;
                            const startY = (-camera.y % spacing) - spacing;
                            context.beginPath();
                            for (let x = startX; x <= viewport.width + spacing; x += spacing) {
                                for (let y = startY; y <= viewport.height + spacing; y += spacing) {
                                    context.moveTo(x + dotRadius, y);
                                    context.arc(x, y, dotRadius, 0, Math.PI * 2);
                                }
                            }
                            // One Konva node and one fill operation, regardless of scroll distance.
                            context.fillStrokeShape(shape);
                        }}
                    />
                    <Group x={-camera.x} y={-camera.y} >
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
