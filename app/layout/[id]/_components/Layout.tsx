'use client'
import DotBackground from "@/app/_components/DotBackground";
import useTemplateCallbacks from "@/lib/custom-hooks/useTemplateCallbacks";
import { LocationItems, SHAPE_TYPE } from "@/lib/types";
import Workboard from "./Workboard";
import { useState } from "react";
import { Input } from "@heroui/react";

export default function Layout({ storedTitle, storedLayouts, storedFloorLocations, storedOtherLocations }: {
    storedTitle: string,
    storedLayouts: Array<SHAPE_TYPE>,
    storedFloorLocations: LocationItems,
    storedOtherLocations: LocationItems,
}) {
    const {
        spacing,
        dotRadius,
        viewport,
        camera,
    } = useTemplateCallbacks();
    const [title, setTitle] = useState<string>(storedTitle);
    const [floorLocations, setFloorLocations] = useState<LocationItems>(storedFloorLocations);
    const [otherLocations, setOtherLocations] = useState<LocationItems>(storedOtherLocations);

    return (
        <>
        <Input aria-label="Layout name" placeholder="Layout name" value={title} onChange={event => setTitle(event.target.value)} />
        <DotBackground viewport={viewport} camera={camera} spacing={spacing} dotRadius={dotRadius}>
            <Workboard 
            layout={storedLayouts}
            floorLocations={floorLocations}
            otherLocations={otherLocations}
            setFloorLocations={setFloorLocations}
            setOtherLocations={setOtherLocations} />
        </DotBackground>
        </>
    )
}