'use client'
import { KeyboardEvent, useRef, useState } from "react";
import { SHAPE_TYPE } from "../types";
import { Stage } from "konva/lib/Stage";
import { useImage } from "react-konva-utils";

export default function useSandboxCallbacks() {
    const nextId = useRef(1);
    const stageRef = useRef<Stage | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>('headline');
    const [woodImage] = useImage("Wood.jpg");
    const [asphaltImage] = useImage("Asphalt.jpg");
    const [brickImage] = useImage("Brick.jpg");
    const [brickslight] = useImage("BricksLight.png");
    const [terrazzo] = useImage("Terrazzo.png");
    const [steelImage] = useImage("matte-brushed-steel.webp");
    const [history, setHistory] = useState<{ past: SHAPE_TYPE[][]; present: SHAPE_TYPE[]; future: SHAPE_TYPE[][] }>({
        past: [],
        present: [],
        future: [],
    });

  // One history entry per finished action — never one per pointer move.
     const commit = (nextShapes: SHAPE_TYPE[]) =>
        setHistory((current) => ({
        past: [...current.past, current.present],
        present: nextShapes,
        future: [],
    }));
    const updateShape = (next: SHAPE_TYPE) => commit(history.present.map((s) => (s.id === next.id ? next : s)));
    const handleStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'Delete' || event.repeat || selectedId === null) return;
        // Keep keyboard shortcuts scoped to the canvas, away from text inputs.
        if (event.target !== event.currentTarget) return;
        if (!history.present.some((shape) => shape.id === selectedId)) return;

        event.preventDefault();
        commit(history.present.filter((shape) => shape.id !== selectedId));
        setSelectedId(null);
    };
    const addShape = (type: 
        "rect" 
        | "circle" 
        | "text" 
        | "table" 
        | "wall" 
        | "outfit" 
        | "wood" 
        | "asphalt" 
        | "brick" 
        | "steel"
        | "brickslight"
        | "terrazzo"
    ) => {
        const id = `${type}-${nextId.current++}`;
        const offset = history.present.length * 14;
        const presets = {
            rect: { type: 'rect' as const, width: 150, height: 100, fill: '#10b981', cornerRadius: 10 },
            circle: { type: 'circle' as const, radius: 52, fill: 'gray' },
            text: { type: 'text' as const, text: 'Double-click to retype', fontSize: 24, fill: '#0f172a' },
            outfit: { type: 'outfit' as const, data: "M 0,0 V 50 M 0,25 H 200 M 200,0 V 50", stroke: 'black', strokeWidth: 5 },
            wall: { type: 'wall' as const, width: 150, height: 100, fill: '#E1E1E1', cornerRadius: 0 },
            table: { type: 'table' as const, width: 150, height: 100, fill: 'blue', cornerRadius: 10 },
            wood: { type: 'wood' as const, width: 150, height: 100, image: woodImage },
            asphalt: { type: 'asphalt' as const, width: 150, height: 100, image: asphaltImage },
            brick: { type: 'brick' as const, width: 150, height: 100, image: brickImage },
            steel: { type: 'steel' as const, width: 150, height: 100, image: steelImage },
            brickslight: { type: 'brickslight' as const, width: 150, height: 100, image: brickslight },
            terrazzo: { type: 'terrazzo' as const, width: 150, height: 100, image: terrazzo },
        };
        commit([
        ...history.present,
        { id, x: 160 + offset, y: 150 + offset, ...presets[type] },
        ]);
        setSelectedId(id);
    };
    const redo = () =>
        setHistory((c) =>
        c.future.length === 0
            ? c
            : {
                past: [...c.past, c.present],
                present: c.future[0],
                future: c.future.slice(1),
            }
    );
    const undo = () =>
        setHistory((c) =>
        c.past.length === 0
            ? c
            : {
                past: c.past.slice(0, -1),
                present: c.past[c.past.length - 1],
                future: [c.present, ...c.future],
            }
    );
    return {
        commit,
        setSelectedId,
        updateShape,
        handleStageKeyDown,
        stageRef,
        history,
        selectedId,
        addShape,
        redo,
        undo,
    }
}
