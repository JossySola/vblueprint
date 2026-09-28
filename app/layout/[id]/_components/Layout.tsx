'use client'
import DotBackground from "@/app/_components/DotBackground";
import useTemplateCallbacks from "@/lib/custom-hooks/useTemplateCallbacks";
import { GarmentType, LocationItems, ProductCategory, SHAPE_TYPE } from "@/lib/types";
import Workboard from "./Workboard";
import { useState } from "react";
import { Input } from "@heroui/react";
import NewItemModal from "./NewItemModal";

export default function Layout({ layoutId, storedLabels, storedTitle, storedLayouts, storedFloorLocations, storedOtherLocations, storedProducts }: {
    layoutId: string,
    storedLabels: Array<ProductCategory>,
    storedTitle: string,
    storedLayouts: Array<SHAPE_TYPE>,
    storedFloorLocations: LocationItems,
    storedOtherLocations: LocationItems,
    storedProducts: GarmentType[],
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
    const [products, setProducts] = useState(storedProducts);

    return (
        <>
        <div className="w-full absolute top-0 flex flex-col items-center gap-3 pt-3 bg-[#fcfcfc03] backdrop-blur-sm z-99">
            <Input name="Layout name" aria-label="Layout name" placeholder="Layout name" value={title} onChange={event => setTitle(event.target.value)} />
            <NewItemModal layoutId={layoutId} storedLabels={storedLabels} products={products} setProducts={setProducts} />
        </div>

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
