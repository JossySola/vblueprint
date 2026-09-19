'use client'
import { useSpring } from "@react-spring/konva";
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
    gap = 0,
}: RingMenuProps) {

    const center = size / 2;
    const numItems = items.length;
    const totalAngle = numItems > 0 ? 360 / numItems : 0;
    const wedgeAngle = totalAngle - gap;

    // Share one spring so every slice opens together as a single ring.
    const menuStyle = useSpring({
        from: { scale: 0, rotation: 0, opacity: 0 },
        to: {
            scale: isOpen ? 1 : 0,
            rotation: isOpen ? 0 : -90,
            opacity: isOpen ? 1 : 0,
        },
        config: {
            tension: 900,
            friction: 80, // Controls the spring bounciness
        },
    });

    if (numItems === 0) return null;

    return (
        <Stage width={size} height={size}>
            <Layer>
                {
                    items.map((item, index) => (
                        <AnimatedRingMenuItem 
                        key={item.id}
                        item={item}
                        index={index}
                        totalAngle={totalAngle}
                        wedgeAngle={wedgeAngle}
                        gap={gap}
                        center={center}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        trailStyle={menuStyle} />
                    ))
                }
            </Layer>
        </Stage>
    )
}
