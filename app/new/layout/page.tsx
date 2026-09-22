'use client'
import DotBackground from "@/app/_components/DotBackground";
import Sandbox from "@/app/_components/Sandbox";
import { authClient } from "@/lib/auth/client";
import { useState, useTransition } from "react";
import { saveNewLayout } from "./actions";
import useSandboxCallbacks from "@/lib/custom-hooks/useSandboxCallbacks";
import useShapeMenuOptions from "@/lib/custom-hooks/useShapeMenuOptions";
import useTemplateCallbacks from "@/lib/custom-hooks/useTemplateCallbacks";
import { Button, Input } from "@heroui/react";
import { Copy, FloppyDisk, ArrowUturnCcwLeft, ArrowUturnCwRight } from '@gravity-ui/icons';

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
        floorLocations,
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
                    data: history.present,
                    floorLocations,
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
        onPointerDownCapture={event => event.currentTarget.focus({ preventScroll: true })}
        onKeyDown={handleStageKeyDown}>
            <div className="w-full absolute top-0 flex flex-col items-center gap-3 pt-3 bg-[#fcfcfc03] backdrop-blur-lg z-99">
                <Input placeholder="Enter a title" name="title" value={title} onChange={e => setTitle(e.target.value)} />
                <div className="flex gap-5 flex-wrap mb-12">
                    <Button variant="tertiary" onClick={duplicateShape} type="button" isDisabled={!canDuplicate}><Copy /> Duplicate</Button>
                    {/* Undo/Redo currently disabled as there is no implementation to also manipulate setFloorLocations */}
                    <Button variant="tertiary" onClick={undo} type="button" isDisabled={true}><ArrowUturnCcwLeft/> Undo</Button>
                    <Button variant="tertiary" onClick={redo} type="button" isDisabled={true}><ArrowUturnCwRight /> Redo</Button>
                    
                    <Button variant="primary" onClick={handleSaveLayout} type="button" isDisabled={isSaving || session.isPending || !session.data?.user}><FloppyDisk /> {isSaving ? 'Saving...' : 'Save'}</Button>
                </div>
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