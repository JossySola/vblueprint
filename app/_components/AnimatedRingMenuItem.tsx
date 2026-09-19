'use client'
import { useImage } from "react-konva-utils";
import { RingMenuItem } from "./RingMenu";
import { useState } from "react";
import { animated, config, SpringValue, useSpring } from "@react-spring/konva";
import { Group, Image, Text, Arc } from "react-konva";
import type { ReactNode } from "react";
import type { GroupConfig } from "konva/lib/Group";
import type { ArcConfig } from "konva/lib/shapes/Arc";
import type { KonvaNodeEvents } from "react-konva";

interface AnimatedRingItemProps {
    item: RingMenuItem;
    index: number;
    totalAngle: number;
    wedgeAngle: number;
    gap: number;
    center: number;
    innerRadius: number;
    outerRadius: number;
    trailStyle: {
        scale: SpringValue<number>,
        rotation: SpringValue<number>,
        opacity: SpringValue<number>,
    };
}

// Limit spring's recursive prop mapping to the attributes this menu uses.
type MenuGroupProps = Pick<GroupConfig, 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'opacity' | 'offset'> & {
    children?: ReactNode;
};
type MenuArcProps = Pick<ArcConfig, 'x' | 'y' | 'outerRadius' | 'angle' | 'rotation' | 'fill' | 'stroke' | 'strokeWidth'> &
    Pick<KonvaNodeEvents, 'onClick' | 'onTap' | 'onMouseEnter' | 'onMouseLeave'> & { innerRadius: number };

const AnimatedGroup = animated(function MenuGroup(props: MenuGroupProps) {
    return <Group {...props} />;
});
const AnimatedArc = animated(function MenuArc(props: MenuArcProps) {
    return <Arc {...props} />;
});

export default function AnimatedRingMenuItem({
    item,
    index,
    totalAngle,
    wedgeAngle,
    gap,
    center,
    innerRadius,
    outerRadius,
    trailStyle
}: AnimatedRingItemProps) {
    const [image] = useImage(item.iconUrl || '');
    const [isHovered, setIsHovered] = useState(false);

    // Hover Spring Animation (Subtle scale and radius expansion)
    const hoverSpring = useSpring({
        outerRadius: isHovered ? outerRadius + 8 : outerRadius,
        innerRadius: isHovered ? innerRadius - 2 : innerRadius,
        config: config.wobbly, // Extra bouncy on hover
    });

    // Angle computations
    const startAngle = index * totalAngle + gap / 2 - 90;
    const midAngle = startAngle + wedgeAngle / 2;

    //Center coordinate math for placing label/icon
    const labelRadius = (innerRadius + outerRadius) / 2;
    const midAngleRad = (midAngle * Math.PI) / 180;
    const centerX = center + labelRadius * Math.cos(midAngleRad);
    const centerY = center + labelRadius * Math.sin(midAngleRad);

    const iconSize = 24;
    const spacing = 4;

    return (
        // Shared menu spring handles scale, rotation, and fade for all slices.
        <AnimatedGroup
        x={center}
        y={center}
        scaleX={trailStyle.scale}
        scaleY={trailStyle.scale}
        rotation={trailStyle.rotation}
        opacity={trailStyle.opacity}
        offset={{ x: center, y: center }}>
            <AnimatedArc
            x={center}
            y={center}
            outerRadius={hoverSpring.outerRadius}
            innerRadius={hoverSpring.innerRadius}
            angle={wedgeAngle}
            rotation={startAngle}
            fill={isHovered ? item.hoverColor || '#3b82f6' : item.color || '#1e293b'}
            stroke="#0f172a"
            strokeWidth={1}
            onClick={item.onClick}
            onTap={item.onClick}
            onMouseEnter={e => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'pointer';
                setIsHovered(true);
            }}
            onMouseLeave={e => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
                setIsHovered(false);
            }} />

            {/* Content Container (Icon + Text) */}
            <Group x={centerX} y={centerY} listening={false}>
                {
                    image && (
                        <Image
                        image={image}
                        width={iconSize}
                        height={iconSize}
                        offsetX={iconSize / 2}
                        offsetY={item.label ? iconSize + spacing / 2 : iconSize / 2}
                        alt="Icon representing the menu option" />
                    )
                }
                {
                    item.label && (
                        <Text 
                        text={item.label}
                        fontSize={12}
                        fontStyle="bold"
                        fill="#ffffff"
                        align="center"
                        width={80}
                        offsetX={40}
                        offsetY={image ? -spacing / 2 : 6}/>
                    )
                }
            </Group>
        </AnimatedGroup>
    )
}

