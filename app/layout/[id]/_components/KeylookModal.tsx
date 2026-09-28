'use client'
import { Html } from "react-konva-utils";
import Item from "./Item";
import { GarmentType } from "@/lib/types";
import { SetStateAction } from "react";
import { Button } from "@heroui/react";
import { CirclePlus, Xmark } from "@gravity-ui/icons";

export default function KeylookModal({ shapeId, currentItems, setIsOpen }: {
    shapeId: string,
    currentItems: GarmentType[],
    setIsOpen: (value: SetStateAction<boolean>) => void,
}) {
    return (
        <Html
        transform={false}
        groupProps={{ listening: false }}
        divProps={{
            style: {
                position: "fixed",
                inset: "auto 0 0",
                width: "100vw",
                zIndex: 50,
                pointerEvents: "none",
            },
        }}>
            <div className="flex w-full justify-center text-center">
                <section 
                role="dialog" 
                aria-modal="true" 
                aria-labelledby={`position-title-${shapeId}`}
                className="pointer-events-auto w-full max-h-[45vh] overflow-y-auto rounded-t-xl border border-gray-200 bg-white p-4 shadow-xl">
                    <header className="flex flex-row gap-5 justify-center items-center">
                        <h2 id={`position-title-${shapeId}`}>Items in this location</h2>
                        <Button isIconOnly variant="secondary" type="button" onClick={() => setIsOpen(false)} aria-label="Close location"><Xmark /></Button>
                    </header>
                    <div className="p-5">
                        {currentItems.length 
                        ? currentItems.map(item => <Item key={item.id} {...item} />) 
                        : <p>No items assigned to this location yet.</p>}
                    </div>
                    <Button>Add item <CirclePlus /></Button>
                </section>
            </div>
        </Html>
    )
}