'use client'
import React, { RefObject } from "react";
import { Layer, Shape, Stage } from "react-konva";

export default function DotBackground({ children, viewport, camera, spacing, dotRadius }: { 
    children: React.ReactNode,
    viewport: { width: number, height: number },
    camera: { x: number, y: number },
    spacing: RefObject<number>,
    dotRadius: RefObject<number>,
}) {

    if (!viewport.width || !viewport.height) return null;

    return (
        <section
        tabIndex={0}
        role="group"
        aria-label="Design canvas."
        onPointerDownCapture={(event) => event.currentTarget.focus({ preventScroll: true })}>
            <Stage
            width={viewport.width} 
            height={viewport.height}>
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
                        }
                    }/>
                    { children }
                </Layer>
            </Stage>
        </section>
    )
}