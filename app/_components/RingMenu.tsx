'use client'
import { useTrail } from "@react-spring/konva";
import React from "react";
import { Layer, Stage } from "react-konva";
import AnimatedRingMenuItem from "./AnimatedRingMenuItem";

export interface RingMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    iconUrl?: string;
    color?: string;
    hoverColor?: string;
    onClick: () => void;
}
interface RingMenuProps {
  items: RingMenuItem[];
  isOpen: boolean;
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
  gap?: number;
}

export default function RingMenu({ 
    items,
    isOpen,
    size = 400,
    innerRadius = 70,
    outerRadius = 180,
    gap = 3,
}: RingMenuProps) {

    const center = size / 2;
    const numItems = items.length;
    const totalAngle = numItems > 0 ? 360 / numItems : 0;
    const wedgeAngle = totalAngle - gap;

    // Staggered Spring Trail Effect for slices opening sequentially
    const trail = useTrail(numItems, {
        from: { scale: 0, rotation: -90, opacity: 0 },
        to: {
            scale: isOpen ? 1 : 0,
            rotation: isOpen ? 0 : -90,
            opacity: isOpen ? 1 : 0,
        },
        config: {
            tension: 210,
            friction: 14, // Controls the spring bounciness
        },
        reverse: !isOpen, // Reverses animation sequences when closing
    });

    if (numItems === 0) return null;

    return (
        <Stage width={size} height={size}>
            <Layer>
                {
                    trail.map((style, index) => (
                        <AnimatedRingMenuItem 
                        key={items[index].id}
                        item={items[index]}
                        index={index}
                        totalAngle={totalAngle}
                        wedgeAngle={wedgeAngle}
                        gap={gap}
                        center={center}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        trailStyle={style} />
                    ))
                }
            </Layer>
        </Stage>
    )
}
