'use client'
import { useEffect, useRef, useState } from "react";

export default function useResponsiveWidth(maxWidth: number = 760) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () =>
      setWidth(Math.max(1, Math.min(maxWidth, container.clientWidth)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [maxWidth]);

  return { containerRef, width, scale: width / maxWidth };
}