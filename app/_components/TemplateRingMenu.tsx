'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import RingMenu from './RingMenu';
import { Html } from 'react-konva-utils';

// Template ring dimensions: overall size and center-hole radius.
const MENU_SIZE = 320;
const INNER_RADIUS_RATIO = 0.15;
const OUTER_RADIUS_RATIO = 0.45;

const options = [
    ['wall', 'Add wall'], ['table', 'Add table'], ['wood', 'Add wood'],
    ['asphalt', 'Add asphalt'], ['brick', 'Add brick'], ['keylook', 'Add keylook\n(ironwork)'],
    ['brickslight', 'Add light brick'], ['terrazzo', 'Add terrazzo'],
] as const;
type ShapeOption = typeof options[number][0];

export default function TemplateRingMenu({ children, camera, addShape }: {
    children: ReactNode;
    camera: { x: number; y: number };
    addShape: (type: ShapeOption, position?: { x: number; y: number }) => void;
}) {
    const container = useRef<HTMLDivElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const origin = useRef({ x: 0, y: 0 });
    const [menu, setMenu] = useState<{ x: number; y: number; world: { x: number; y: number }; size: number } | null>(null);
    const [submenu, setSubmenu] = useState(false);
    const cancelHold = () => {
        if (timer.current !== null) clearTimeout(timer.current);
        timer.current = null;
    };
    useEffect(() => () => {
        if (timer.current !== null) clearTimeout(timer.current);
    }, []);
    useEffect(() => {
        if (!menu) return;
        const dismiss = () => setMenu(null);
        const key = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss(); };
        window.addEventListener('keydown', key);
        window.addEventListener('resize', dismiss);
        window.addEventListener('scroll', dismiss, true);
        return () => {
            window.removeEventListener('keydown', key);
            window.removeEventListener('resize', dismiss);
            window.removeEventListener('scroll', dismiss, true);
        };
    }, [menu]);

    const open = (x: number, y: number) => {
        const bounds = container.current?.getBoundingClientRect();
        if (!bounds) return;
        const size = Math.min(MENU_SIZE, window.innerWidth - 16, window.innerHeight - 16);
        setSubmenu(false);
        setMenu({
            x: Math.max(8, Math.min(x - size / 2, window.innerWidth - size - 8)),
            y: Math.max(8, Math.min(y - size / 2, window.innerHeight - size - 8)),
            world: { x: x - bounds.left + camera.x, y: y - bounds.top + camera.y }, size,
        });
    };

    const items = submenu ? options.map(([type, label]) => ({
        id: type, label, onClick: () => {
            if (menu) addShape(type, menu.world);
            setMenu(null);
        },
    })) : [{ id: 'shapes', label: 'Add shapes', onClick: () => setSubmenu(true) }];

    return (
        <Html>
            <div ref={container}
                onContextMenu={(event) => {
                    if (!(event.target instanceof HTMLCanvasElement)) return;
                    event.preventDefault();
                    cancelHold();
                    open(event.clientX, event.clientY);
                }}
                onPointerDownCapture={(event) => {
                    cancelHold();
                    if (event.pointerType !== 'touch' || !event.isPrimary || !(event.target instanceof HTMLCanvasElement)) return;
                    origin.current = { x: event.clientX, y: event.clientY };
                    timer.current = setTimeout(() => {
                        timer.current = null;
                        open(origin.current.x, origin.current.y);
                    }, 550);
                }}
                onPointerMoveCapture={(event) => {
                    if (Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y) > 10) cancelHold();
                }}
                onPointerUpCapture={cancelHold}
                onPointerCancelCapture={cancelHold}
            >{children}</div>
            {menu && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
                    onPointerDown={(event) => { if (event.target === event.currentTarget) setMenu(null); }}
                    onContextMenu={(event) => event.preventDefault()}>
                    <div role="dialog" aria-label={submenu ? 'Add shapes' : 'Template menu'}
                        style={{ position: 'absolute', left: menu.x, top: menu.y, width: menu.size, height: menu.size }}>
                        <RingMenu key={submenu ? 'shapes' : 'root'} items={items} isOpen size={menu.size}
                            innerRadius={menu.size * INNER_RADIUS_RATIO} outerRadius={menu.size * OUTER_RADIUS_RATIO} />
                        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'grid', gap: 8 }}>
                            {submenu && <button onClick={() => setSubmenu(false)}>Back</button>}
                            <button onClick={() => setMenu(null)}>Close</button>
                        </div>
                        <div className="sr-only">
                            {items.map((item) => <button key={item.id} onClick={item.onClick}>{item.label}</button>)}
                        </div>
                    </div>
                </div>, document.body)}
        </Html>
    )
}
