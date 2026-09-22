'use client'
import { LocationItems } from "@/lib/types";
import { Modal, useOverlayState } from "@heroui/react";
import { ComponentProps, useMemo } from "react";
import { Path } from "react-konva";
import { Html } from "react-konva-utils";
import Item from "./Item";

type PositionProps = ComponentProps<typeof Path>;

export default function Position(
    props: PositionProps, 
    floorLocations: LocationItems 
) {
    const state = useOverlayState();
    const shapeId = props.id;
    const currentItems = useMemo(() => {
        if (shapeId) return floorLocations.get(shapeId);
    }, [shapeId, floorLocations]);

    return (
        <>
        <Path {...props} onClick={() => state.open()}/>
        <Html>
            <Modal.Backdrop variant="transparent" isOpen={state.isOpen} onOpenChange={state.setOpen}>
                <Modal.Container placement="bottom" size="cover" scroll="inside">
                    <Modal.Dialog className="w-full">
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading></Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                        {
                            currentItems && currentItems.map(item => (
                                <Item 
                                key={item.id}
                                id={item.id}
                                icon={item.icon}
                                garment={item.garment}
                                material={item.material}
                                prevLocation={item.prevLocation}
                                currentLocation={item.currentLocation}
                                nextLocation={item.nextLocation}
                                collection={item.collection} />
                            ))
                        }
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Html>
        </>
    )
}