'use client'
import { LocationItems, SHAPE_TYPE } from "@/lib/types";
import { Circle, Group, Image, Path, Rect, Star, Text } from "react-konva";
import Position from "./Position";
import { Dispatch, SetStateAction } from "react";
import { useImage } from "react-konva-utils";

export default function Workboard({ layout, camera, floorLocations, otherLocations, setFloorLocations, setOtherLocations }: {
    layout: Array<SHAPE_TYPE>,
    camera: { x: number; y: number },
    floorLocations: LocationItems,
    otherLocations: LocationItems,
    setFloorLocations: Dispatch<SetStateAction<LocationItems>>,
    setOtherLocations: Dispatch<SetStateAction<LocationItems>>,
}) {
    const [woodImage] = useImage("/Wood.jpg");
    const [asphaltImage] = useImage("/Asphalt.jpg");
    const [brickImage] = useImage("/Brick.jpg");
    const [steelImage] = useImage("/matte-brushed-steel.webp");
    const [brickslightImage] = useImage("/BricksLight.png");
    const [terrazzoImage] = useImage("/Terrazzo.png");

    return (
        <Group x={-camera.x} y={-camera.y}>
            {
                layout && layout.map((shape, index) => {
                    switch (shape.type) {
                        case 'rect':
                            return <Rect key={`${shape.type}${shape.id}${index}`} {...shape} />
                        case 'table':
                            return <Rect key={`${shape.type}${shape.id}${index}`} {...shape} />
                        case 'wall':
                            return <Rect key={`${shape.type}${shape.id}${index}`} {...shape} />
                        case 'circle':
                            return <Circle key={`${shape.type}${shape.id}${index}`} {...shape} />
                        case 'star':
                            return <Star key={`${shape.type}${shape.id}${index}`} {...shape} />
                        case 'text':
                            return <Text key={`${shape.type}${shape.id}${index}`} {...shape} />
                        case 'path':
                            return <Path key={`${shape.type}${shape.id}${index}`} {...shape} />
                        case 'keylook':
                            return  <Position key={`${shape.type}${shape.id}${index}`} {...shape} floorLocations={floorLocations} />
                        case 'wood':
                            return woodImage ? <Image key={`${shape.type}${shape.id}${index}`} {...shape} image={woodImage} /> : null;
                        case 'asphalt':
                            return asphaltImage ? <Image key={`${shape.type}${shape.id}${index}`} {...shape} image={asphaltImage} /> : null;
                        case 'brick':
                            return brickImage ? <Image key={`${shape.type}${shape.id}${index}`} {...shape} image={brickImage} /> : null;
                        case 'steel':
                            return steelImage ? <Image key={`${shape.type}${shape.id}${index}`} {...shape} image={steelImage} /> : null;
                        case 'brickslight':
                            return brickslightImage ? <Image key={`${shape.type}${shape.id}${index}`} {...shape} image={brickslightImage} /> : null;
                        case 'terrazzo':
                            return terrazzoImage ? <Image key={`${shape.type}${shape.id}${index}`} {...shape} image={terrazzoImage} /> : null;
                        default: return <Rect key={`${shape.type}${shape.id}${index}`} {...shape} />
                    }
                })
            }
        </Group>
    )
}
