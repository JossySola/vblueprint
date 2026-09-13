'use client'
import { useEffect, type RefObject } from 'react';
import type { Stage } from 'konva/lib/Stage';

export default function useCanvasPixelRatio(
    stageRef: RefObject<Stage | null>,
    width: number,
    height: number,
) {
    useEffect(() => {
        if (!width || !height) return;
        const visualViewport = window.visualViewport;
        let frame: number | null = null;
        let resolutionQuery: MediaQueryList;

        const update = () => {
            frame = null;
            const stage = stageRef.current;
            if (!stage) return;
            // Desktop zoom changes DPR; native pinch zoom changes viewport scale.
            const desired = (window.devicePixelRatio || 1) * (visualViewport?.scale || 1);
            // Bound canvas allocations, especially on high-density phones.
            const ratio = Math.min(desired, 4, Math.sqrt(16_000_000 / (width * height)),
                8192 / width, 8192 / height);
            stage.getLayers().forEach((layer) => {
                const canvas = layer.getCanvas();
                if (Math.abs(canvas.getPixelRatio() - ratio) < 0.01) return;
                canvas.setPixelRatio(ratio);
                layer.batchDraw();
            });
        };

        const scheduleUpdate = () => {
            if (frame === null) frame = window.requestAnimationFrame(update);
        };
        const watchResolution = () => {
            resolutionQuery?.removeEventListener('change', watchResolution);
            resolutionQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
            resolutionQuery.addEventListener('change', watchResolution);
            scheduleUpdate();
        };

        watchResolution();
        window.addEventListener('resize', scheduleUpdate);
        visualViewport?.addEventListener('resize', scheduleUpdate);
        return () => {
            if (frame !== null) window.cancelAnimationFrame(frame);
            resolutionQuery.removeEventListener('change', watchResolution);
            window.removeEventListener('resize', scheduleUpdate);
            visualViewport?.removeEventListener('resize', scheduleUpdate);
        };
    }, [stageRef, width, height]);
}
