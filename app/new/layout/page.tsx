'use client'
import DotBackground from "@/app/_components/DotBackground";
import Sandbox from "@/app/_components/Sandbox";
import { authClient } from "@/lib/auth/client";
import { useState, useTransition } from "react";
import { saveNewLayout } from "./actions";
import useSandboxCallbacks from "@/lib/custom-hooks/useSandboxCallbacks";
import useShapeMenuOptions from "@/lib/custom-hooks/useShapeMenuOptions";
import useTemplateCallbacks from "@/lib/custom-hooks/useTemplateCallbacks";

export default function NewTemplate() {
    const session = authClient.useSession();
    const [title, setTitle] = useState<string>('Untitled');
    const [isSaving, startSaving] = useTransition();

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

    const {
        spacing,
        dotRadius,
        viewport,
        camera,
        alignment,
        setAlignment,
        handleWheel,
    } = useTemplateCallbacks();

    const { canDuplicate, handleShapeContextMenu, duplicateShape } = useShapeMenuOptions({
        shapes: history.present,
        selectedId,
        selectShape: setSelectedId,
        commit,
    });

    const handleSaveLayout = () => {
        startSaving(async () => {
            try {
                await saveNewLayout({
                    title,
                    data: history.present
                });
            } catch (e: unknown) {
                console.error(e);
            }
        });
    }

    return (
        <section
        tabIndex={0}
        role="group"
        aria-label="Design canvas. Press Delete to remove the selected shape."
        onPointerDownCapture={(event) => event.currentTarget.focus({ preventScroll: true })}
        onKeyDown={handleStageKeyDown}>
            <input placeholder="Enter a title" name="title" value={title} onChange={e => setTitle(e.target.value)} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <button onClick={duplicateShape} type="button" disabled={!canDuplicate}>Duplicate</button>
                <button onClick={undo} type="button" disabled={history.past.length === 0}>Undo</button>
                <button onClick={redo} type="button" disabled={history.future.length === 0}>Redo</button>
                <button onClick={handleSaveLayout} type="button" disabled={isSaving || session.isPending || !session.data?.user}>{isSaving ? 'Saving...' : 'Save'}</button>
            </div>
            <DotBackground viewport={viewport} camera={camera} spacing={spacing} dotRadius={dotRadius}>
                <Sandbox
                viewport={viewport}
                camera={camera}
                handleWheel={handleWheel}
                alignment={alignment}
                setAlignment={setAlignment}
                updateShape={updateShape}
                stageRef={stageRef}
                history={history}
                addShape={addShape}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                handleShapeContextMenu={handleShapeContextMenu} />
            </DotBackground>
        </section>
    )
}