import { useEffect, useMemo, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { IconMaximize, IconMinus, IconX } from '@tabler/icons-react';
import { useWindow } from '../context/WindowContext';

const TASKBAR_HEIGHT = 64;
const DESKTOP_GAP = 12;
const TOP_PADDING = 8;
const MIN_SIZE = { width: 300, height: 240 };

export default function Widget({
  id,
  title,
  icon,
  iconBg,
  children,
  width,
  headerActions = null,
}) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
    desktopRef,
  } = useWindow();
  const dragControls = useDragControls();
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const windowState = windows[id];

  useEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bounds = useMemo(
    () => ({
      maxX: Math.max(DESKTOP_GAP, viewport.width - (windowState?.size.width || width || 360) - DESKTOP_GAP),
      maxY: Math.max(TOP_PADDING, viewport.height - TASKBAR_HEIGHT - (windowState?.size.height || 360) - DESKTOP_GAP),
    }),
    [viewport, windowState?.size.height, windowState?.size.width, width]
  );

  if (!windowState || !windowState.isOpen) return null;
  const WindowIcon = icon || windowState.icon;

  const constrainedPosition = {
    x: Math.min(Math.max(windowState.position.x, DESKTOP_GAP), bounds.maxX),
    y: Math.min(Math.max(windowState.position.y, TOP_PADDING), bounds.maxY),
  };

  const maximizedStyle = {
    left: DESKTOP_GAP,
    top: TOP_PADDING,
    width: viewport.width - DESKTOP_GAP * 2,
    height: viewport.height - TASKBAR_HEIGHT - TOP_PADDING - DESKTOP_GAP,
  };

  const windowStyle = windowState.isMaximized
    ? maximizedStyle
    : {
        left: constrainedPosition.x,
        top: constrainedPosition.y,
        width: windowState.size.width || width || 360,
        height: windowState.size.height,
      };

  const handleDragEnd = (_, info) => {
    const next = {
      x: Math.min(Math.max(windowState.position.x + info.offset.x, DESKTOP_GAP), bounds.maxX),
      y: Math.min(Math.max(windowState.position.y + info.offset.y, TOP_PADDING), bounds.maxY),
    };
    updatePosition(id, next);
  };

  const startResize = (event) => {
    event.preventDefault();
    event.stopPropagation();
    focusWindow(id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startSize = windowState.size;

    const handlePointerMove = (moveEvent) => {
      const maxWidth = viewport.width - windowState.position.x - DESKTOP_GAP;
      const maxHeight = viewport.height - TASKBAR_HEIGHT - windowState.position.y - DESKTOP_GAP;
      updateSize(id, {
        width: Math.min(Math.max(startSize.width + moveEvent.clientX - startX, MIN_SIZE.width), maxWidth),
        height: Math.min(Math.max(startSize.height + moveEvent.clientY - startY, MIN_SIZE.height), maxHeight),
      });
    };

    const stopResize = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResize);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResize);
  };

  return (
    <motion.div
      data-window
      data-widget
      drag={!windowState.isMaximized && !windowState.isMinimized}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={desktopRef}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onPointerDown={() => focusWindow(id)}
      initial={{ scale: 0.92, opacity: 0, y: 10 }}
      animate={{
        ...windowStyle,
        scale: windowState.isMinimized ? 0 : 1,
        opacity: windowState.isMinimized ? 0 : windowState.isFocused ? 1 : 0.97,
        y: windowState.isMinimized ? 160 : 0,
      }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 430, damping: 34, mass: 0.8 }}
      className="absolute flex flex-col overflow-hidden"
      style={{
        zIndex: Math.min(Math.max(windowState.zIndex, 100), 9000),
        pointerEvents: windowState.isMinimized ? 'none' : 'auto',
        borderRadius: windowState.isMaximized ? 10 : 14,
        background: 'rgba(238, 247, 255, 0.78)',
        border: '1px solid rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(24px)',
        boxShadow: windowState.isFocused
          ? '0 8px 32px rgba(26,110,245,0.18)'
          : '0 14px 36px rgba(54, 91, 135, 0.12)',
      }}
    >
      <div
        className="flex h-11 flex-shrink-0 items-center gap-3 border-b px-3"
        style={{ borderColor: 'rgba(151, 181, 214, 0.35)', cursor: windowState.isMaximized ? 'default' : 'grab' }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          focusWindow(id);
          dragControls.start(event);
        }}
        onDoubleClick={() => maximizeWindow(id)}
      >
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white"
          style={{ background: iconBg || windowState.iconBg }}
        >
          {WindowIcon && <WindowIcon size={16} aria-hidden="true" />}
        </div>

        <div className="min-w-0 flex-1 text-sm font-semibold" style={{ color: '#1a3870' }}>
          {title || windowState.title}
        </div>

        <div className="flex items-center gap-2" onPointerDown={(event) => event.stopPropagation()}>
          {headerActions}
          <button
            type="button"
            aria-label="Minimize"
            title="Minimize"
            onClick={() => minimizeWindow(id)}
            className="window-control"
            style={{ background: '#febc2e' }}
          >
            <IconMinus size={9} stroke={3} />
          </button>
          <button
            type="button"
            aria-label="Maximize"
            title="Maximize"
            onClick={() => maximizeWindow(id)}
            className="window-control"
            style={{ background: '#28c840' }}
          >
            <IconMaximize size={9} stroke={3} />
          </button>
          <button
            type="button"
            aria-label="Close"
            title="Close"
            onClick={() => closeWindow(id)}
            className="window-control"
            style={{ background: '#ff5f57' }}
          >
            <IconX size={9} stroke={3} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4" style={{ color: '#1a3870' }}>
        {children}
      </div>

      {!windowState.isMaximized && (
        <div
          aria-hidden="true"
          className="absolute bottom-1 right-1 h-5 w-5"
          style={{
            cursor: 'nwse-resize',
            background:
              'linear-gradient(135deg, transparent 0 45%, rgba(26, 56, 112, 0.25) 46% 52%, transparent 53% 61%, rgba(26, 56, 112, 0.25) 62% 68%, transparent 69%)',
          }}
          onPointerDown={startResize}
        />
      )}
    </motion.div>
  );
}
