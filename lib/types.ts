import type { CircleConfig } from "konva/lib/shapes/Circle";
import type { RectConfig } from "konva/lib/shapes/Rect";
import type { StarConfig } from "konva/lib/shapes/Star";
import type { TextConfig } from "konva/lib/shapes/Text";

// Saved attributes are data, separate from live Konva node instances.
interface ShapeData {
    id: string;
    x: number;
    y: number;
}
interface Rect extends RectConfig {
    type: "rect";
    width: number;
    height: number;
}
interface Circle extends CircleConfig {
    type: "circle";
    radius: number;
}
interface Star extends StarConfig {
    type: "star";
}
interface Text extends TextConfig {
    type: "text";
    text: string;
    fontSize: number;
}
export type SHAPE_TYPE = ShapeData & (Rect | Circle | Star | Text);
