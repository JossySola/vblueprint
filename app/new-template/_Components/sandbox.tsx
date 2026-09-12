'use client'
import EditableShape from "@/app/_components/EditableShape";
import useResponsiveWidth from "@/lib/custom-hooks/useResponsiveWidth";
import useSandboxCallbacks from "@/lib/custom-hooks/useSandboxCallbacks";
import { SHAPE_TYPE } from "@/lib/types";
import { Layer, Stage } from "react-konva";

export default function SandBox() {
    const { containerRef, width: displayWidth, scale } = useResponsiveWidth();
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

    const button = {
        padding: '6px 12px',
        border: '1px solid #cbd5e1',
        borderRadius: 6,
        background: '#fff',
        cursor: 'pointer',
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <button style={button} onClick={() => addShape('rect')}>Add rectangle</button>
                <button style={button} onClick={() => addShape('circle')}>Add circle</button>
                <button style={button} onClick={() => addShape('text')}>Add text</button>
                <button style={button} onClick={undo} disabled={history.past.length === 0}>Undo</button>
                <button style={button} onClick={redo} disabled={history.future.length === 0}>Redo</button>
            </div>

            {/* Konva nodes do not receive keyboard events; use their DOM wrapper. */}
            <div
                ref={containerRef}
                style={{ width: '100%', maxWidth: 760 }}
                tabIndex={0}
                role="group"
                aria-label="Design canvas. Press Delete to remove the selected shape."
                onPointerDownCapture={(event) => event.currentTarget.focus({ preventScroll: true })}
                onKeyDown={handleStageKeyDown}
            >
                <Stage
                ref={stageRef}
                width={displayWidth}
                height={420 * scale}
                scaleX={scale}
                scaleY={scale}
                style={{ background: '#f1f5f9', borderRadius: 8 }}
                onMouseDown={(e) => {
                    if (e.target === e.target.getStage()) setSelectedId(null);
                }}
                onTouchStart={(e) => {
                    if (e.target === e.target.getStage()) setSelectedId(null);
                }}
                >
                    <Layer>
                        {history.present.map((shape: SHAPE_TYPE) => (
                        <EditableShape
                            key={shape.id}
                            shape={shape}
                            selected={shape.id === selectedId}
                            onSelect={() => setSelectedId(shape.id)}
                            onCommit={updateShape}
                        />
                        ))}
                    </Layer>
                </Stage>
            </div>

            {/* Canvas pixels mean nothing to a screen reader. Mirror the document in HTML. */}
            <p style={{ marginTop: 12, marginBottom: 6 }}>Objects:</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {history.present.map((shape: SHAPE_TYPE) => (
                <button
                    key={shape.id}
                    style={{
                    ...button,
                    borderColor: shape.id === selectedId ? '#2563eb' : '#cbd5e1',
                    }}
                    aria-pressed={shape.id === selectedId}
                    onClick={() => setSelectedId(shape.id)}
                >
                    {shape.id}
                </button>
                ))}
            </div>
        </div>
    );
}
