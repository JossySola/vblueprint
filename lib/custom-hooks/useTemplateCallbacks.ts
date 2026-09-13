'use client'
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { AlignmentGuide } from "../alignmentGuides";

export default function useTemplateCallbacks() {
    // Camera coordinates describe the world position at the viewport's top-left.
    // Scrolling changes these coordinates, never the size or scale of the Stage.
    const [camera, setCamera] = useState({ x: 0, y: 0 });
    const [alignment, setAlignment] = useState<{ id: string; guides: AlignmentGuide[] } | null>(null);
    const pendingScroll = useRef({ x: 0, y: 0 });
    const scrollFrame = useRef<number | null>(null);
    const spacing = useRef(40);
    const dotRadius = useRef(1.5);
    const wheelLineHeight = useRef(16);
    // Start with the same dimensions on the server and during hydration.
    const [viewport, setViewport] = useState({ width: 0, height: 0 });

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
        const unitX = deltaMode === 1 ? wheelLineHeight.current : deltaMode === 2 ? viewport.width : 1;
        const unitY = deltaMode === 1 ? wheelLineHeight.current : deltaMode === 2 ? viewport.height : 1;
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

    return {
        spacing,
        dotRadius,
        camera,
        viewport,
        alignment,
        setAlignment,
        handleWheel,
    }
}