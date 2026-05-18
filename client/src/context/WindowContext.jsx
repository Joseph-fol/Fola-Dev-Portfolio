import { createContext, useContext, useRef, useState } from 'react';
import {
  IconBrandGithub,
  IconBriefcase,
  IconBrowser,
  IconCalendar,
  IconDeviceDesktop,
  IconFileText,
  IconFlame,
  IconFolder,
  IconMail,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';

export const WindowContext = createContext();

const makeWindow = (id, position, size, title, icon, iconBg) => ({
  id,
  title,
  icon,
  iconBg,
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  isFocused: false,
  position,
  restorePosition: position,
  size,
  restoreSize: size,
  zIndex: 10,
});

const INITIAL_WINDOWS = {
  search: makeWindow('search', { x: 360, y: 90 }, { width: 420, height: 300 }, 'Search', IconSearch, '#1a6ef5'),
  explorer: makeWindow('explorer', { x: 160, y: 90 }, { width: 560, height: 400 }, 'File Explorer', IconFolder, '#f5b642'),
  browser: makeWindow('browser', { x: 220, y: 80 }, { width: 620, height: 430 }, 'Browser', IconBrowser, '#40c8b8'),
  mail: makeWindow('mail', { x: 260, y: 120 }, { width: 440, height: 380 }, 'Mail', IconMail, '#60b8f0'),
  calendar: makeWindow('calendar', { x: 310, y: 110 }, { width: 420, height: 360 }, 'Calendar', IconCalendar, '#9050d0'),
  about: makeWindow('about', { x: 70, y: 70 }, { width: 380, height: 430 }, 'About Me', IconUser, '#1a6ef5'),
  projects: makeWindow('projects', { x: 470, y: 70 }, { width: 460, height: 520 }, 'Projects', IconBriefcase, '#9050d0'),
  skills: makeWindow('skills', { x: 170, y: 150 }, { width: 430, height: 410 }, 'Skills', IconFlame, '#e050a0'),
  contact: makeWindow('contact', { x: 640, y: 120 }, { width: 420, height: 500 }, 'Contact', IconMail, '#60b8f0'),
  github: makeWindow('github', { x: 520, y: 90 }, { width: 430, height: 510 }, 'GitHub', IconBrandGithub, '#1a3870'),
  resume: makeWindow('resume', { x: 390, y: 100 }, { width: 420, height: 440 }, 'Resume', IconFileText, '#dc2626'),
  thispc: makeWindow('thispc', { x: 180, y: 100 }, { width: 520, height: 360 }, 'This PC', IconDeviceDesktop, '#1a6ef5'),
  recycle: makeWindow('recycle', { x: 280, y: 130 }, { width: 360, height: 300 }, 'Recycle Bin', IconTrash, '#6b92b8'),
  settings: makeWindow('settings', { x: 210, y: 70 }, { width: 760, height: 560 }, 'Settings', IconSettings, '#1a6ef5'),
};

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const zIndexCounter = useRef(20);
  const desktopRef = useRef(null);

  const nextZIndex = () => {
    zIndexCounter.current = Math.min(zIndexCounter.current + 1, 9000);
    return zIndexCounter.current;
  };

  const focusWindow = (id) => {
    const zIndex = nextZIndex();
    setWindows((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, windowState]) => [
          key,
          {
            ...windowState,
            isFocused: key === id,
            zIndex: key === id ? zIndex : windowState.zIndex,
          },
        ])
      )
    );
  };

  const openWindow = (id) => {
    const zIndex = nextZIndex();
    setWindows((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, windowState]) => [
          key,
          key === id
            ? { ...windowState, isOpen: true, isMinimized: false, isFocused: true, zIndex }
            : { ...windowState, isFocused: false },
        ])
      )
    );
  };

  const closeWindow = (id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        isFocused: false,
      },
    }));
  };

  const minimizeWindow = (id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true, isFocused: false },
    }));
  };

  const maximizeWindow = (id) => {
    const zIndex = nextZIndex();
    setWindows((prev) => {
      const current = prev[id];
      const isMaximized = !current.isMaximized;

      return Object.fromEntries(
        Object.entries(prev).map(([key, windowState]) => {
          if (key !== id) return [key, { ...windowState, isFocused: false }];

          return [
            key,
            {
              ...windowState,
              isMaximized,
              isMinimized: false,
              isFocused: true,
              zIndex,
              restorePosition: isMaximized ? windowState.position : windowState.restorePosition,
              restoreSize: isMaximized ? windowState.size : windowState.restoreSize,
            },
          ];
        })
      );
    });
  };

  const updatePosition = (id, position) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position,
        restorePosition: prev[id].isMaximized ? prev[id].restorePosition : position,
      },
    }));
  };

  const updateSize = (id, size) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
        restoreSize: prev[id].isMaximized ? prev[id].restoreSize : size,
      },
    }));
  };

  const handleTaskbarApp = (id) => {
    const app = windows[id];
    if (!app?.isOpen) {
      openWindow(id);
      return;
    }

    if (app.isMinimized) {
      openWindow(id);
      return;
    }

    if (app.isFocused) {
      minimizeWindow(id);
      return;
    }

    focusWindow(id);
  };

  const value = {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
    handleTaskbarApp,
    desktopRef,
    openWidget: openWindow,
    closeWidget: closeWindow,
    focusWidget: focusWindow,
  };

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}

export function useWindow() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindow must be used within WindowProvider');
  }
  return context;
}
