import { ImageConfig } from "konva/lib/shapes/Image";
import type { CircleConfig } from "konva/lib/shapes/Circle";
import { PathConfig } from "konva/lib/shapes/Path";
import type { RectConfig } from "konva/lib/shapes/Rect";
import { RingConfig } from "konva/lib/shapes/Ring";
import type { StarConfig } from "konva/lib/shapes/Star";
import type { TextConfig } from "konva/lib/shapes/Text";

// Saved attributes are data, separate from live Konva node instances.
interface ShapeData {
    id: string;
    x: number;
    y: number;
};
interface Rect extends RectConfig {
    type: "rect" | "table" | "wall";
    width: number;
    height: number;
    fill: string;
    cornerRadius: number;
};
interface Circle extends CircleConfig {
    type: "circle";
    radius: number;
};
interface Star extends StarConfig {
    type: "star";
};
interface Text extends TextConfig {
    type: "text";
    text: string;
    fontSize: number;
};
interface Ring extends RingConfig {
    type: "ring";
    innerRadius: number;
    outerRadius: number;
};
interface Path extends PathConfig {
    type: "path" | "keylook";
    data: string;
    stroke: string;
};
interface Wood extends ImageConfig {
    type: "wood";
    image: CanvasImageSource | undefined;
};
interface Asphalt extends ImageConfig {
    type: "asphalt";
    image: CanvasImageSource | undefined;
};
interface Brick extends ImageConfig {
    type: "brick";
    image: CanvasImageSource | undefined;
};
interface Steel extends ImageConfig {
    type: "steel";
    image: CanvasImageSource | undefined;
};
interface BricksLight extends ImageConfig {
    type: "brickslight";
    image: CanvasImageSource | undefined;
};
interface Terrazzo extends ImageConfig {
    type: "terrazzo";
    image: CanvasImageSource | undefined;
};
export type SHAPE_TYPE = ShapeData & (
    Rect 
    | Circle 
    | Star 
    | Text 
    | Ring 
    | Path 
    | Wood 
    | Asphalt 
    | Brick 
    | Steel
    | BricksLight
    | Terrazzo
);
export interface CAMERA {
    x: number;
    y: number;
};
export interface VIEWPORT {
    width: number;
    height: number;
};
export type GarmentType = {
    id: string,
    icon: string,
    garment: string,
    material: string,
    prevLocation: string,
    currentLocation: string,
    nextLocation: string,
    collection?: string,
};
export type LocationItems = Map<string, Array<GarmentType>>;
export type LocationItemsJSON = Array<[string, GarmentType[]]>;
type DashboardQueryRow = {
    id: string,
    title: string,
};
export type DashboardQueryResponse = DashboardQueryRow[];