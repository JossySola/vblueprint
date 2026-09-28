'use client'
import { LocationItems } from "@/lib/types";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { Group, Path } from "react-konva";
import KeylookModal from "./KeylookModal";

type PositionProps = ComponentProps<typeof Path> & {
    floorLocations: LocationItems;
};

export default function Position({
    floorLocations,
    ...props
}: PositionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const shapeId = props.id;
    const currentItems = useMemo(() => {
        if (shapeId) return floorLocations.get(shapeId) ?? [];
        return [];
    }, [shapeId, floorLocations]);

    useEffect(() => {
        if (!isOpen) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [isOpen]);

    return (
        <Group>
            <Path {...props} onClick={() => setIsOpen(true)} />
            {isOpen && <KeylookModal shapeId={shapeId!} currentItems={currentItems} setIsOpen={setIsOpen} />}
        </Group>
    )
}
