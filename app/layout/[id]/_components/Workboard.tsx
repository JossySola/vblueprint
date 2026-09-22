'use client'
import { LocationItems, SHAPE_TYPE } from "@/lib/types";
import { Circle, Group, Image, Path, Rect, Star, Text } from "react-konva";
import Position from "./Position";
import { Dispatch, SetStateAction } from "react";

export default function Workboard({ layout, floorLocations, otherLocations, setFloorLocations, setOtherLocations }: {
    layout: Array<SHAPE_TYPE>,
    floorLocations: LocationItems,
    otherLocations: LocationItems,
    setFloorLocations: Dispatch<SetStateAction<LocationItems>>,
    setOtherLocations: Dispatch<SetStateAction<LocationItems>>,
}) {
    return (
        <Group>
            {
                layout && layout.map(shape => {
                    switch (shape.type) {
                        case 'rect':
                            return <Rect key={`${shape.type}${shape.name}`} {...shape} />
                        case 'table':
                            return <Rect key={`${shape.type}${shape.name}`} {...shape} />
                        case 'wall':
                            return <Rect key={`${shape.type}${shape.name}`} {...shape} />
                        case 'circle':
                            return <Circle key={`${shape.type}${shape.name}`} {...shape} />
                        case 'star':
                            return <Star key={`${shape.type}${shape.name}`} {...shape} />
                        case 'text':
                            return <Text key={`${shape.type}${shape.name}`} {...shape} />
                        case 'path':
                            return <Path key={`${shape.type}${shape.name}`} {...shape} />
                        case 'keylook':
                            return  <Position key={`${shape.type}${shape.name}`} {...shape} floorLocations={floorLocations} />
                        case 'wood':
                            return <Image key={`${shape.type}${shape.name}`} {...shape} alt="Image with design texture representing a piece of furniture in the template" />
                        case 'asphalt':
                            return <Image key={`${shape.type}${shape.name}`} {...shape} alt="Image with design texture representing a piece of furniture in the template" />
                        case 'brick':
                            return <Image key={`${shape.type}${shape.name}`} {...shape} alt="Image with design texture representing a piece of furniture in the template" />
                        case 'steel':
                            return <Image key={`${shape.type}${shape.name}`} {...shape} alt="Image with design texture representing a piece of furniture in the template" />
                        case 'brickslight':
                            return <Image key={`${shape.type}${shape.name}`} {...shape} alt="Image with design texture representing a piece of furniture in the template" />
                        case 'terrazzo':
                            return <Image key={`${shape.type}${shape.name}`} {...shape} alt="Image with design texture representing a piece of furniture in the template" />
                        default: return <Rect key={`${shape.type}${shape.name}`} {...shape} />          
                    }
                })
            }
        </Group>
    )
}