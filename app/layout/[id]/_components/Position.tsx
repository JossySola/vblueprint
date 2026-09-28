'use client'
import { LocationItems } from "@/lib/types";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { Group, Path } from "react-konva";
import { Html } from "react-konva-utils";
import Item from "./Item";

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
            {isOpen && <Html>
                <div 
                role="presentation" 
                onMouseDown={event => { if (event.target === event.currentTarget) setIsOpen(false); }} 
                className="w-full flex flex-row justify-center items-center text-center ">
                    <section 
                    role="dialog" 
                    aria-modal="true" 
                    aria-labelledby={`position-title-${shapeId}`}>
                        <header>
                            <h2 id={`position-title-${shapeId}`}>Items in this location</h2>
                            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close location">Close</button>
                        </header>
                        <div>
                            {currentItems.length 
                            ? currentItems.map(item => <Item key={item.id} {...item} />) 
                            : <p>No items assigned to this location yet.</p>}
                        </div>
                    </section>
                </div>
            </Html>}
        </Group>
    )
}
