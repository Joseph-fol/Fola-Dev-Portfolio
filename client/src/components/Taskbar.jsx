import { motion } from 'framer-motion';
import {
  IconBattery2,
  IconBrandGithub,
  IconBrandWindows,
  IconBriefcase,
  IconBrowser,
  IconCalendar,
  IconCloud,
  IconFlame,
  IconFolder,
  IconMail,
  IconSearch,
  IconSend,
  IconUser,
  IconVolume2,
  IconWifi,
} from '@tabler/icons-react';
import { useWindow } from '../context/WindowContext';
import { useOSSettings } from '../context/OSSettingsContext';
import useClock from '../hooks/useClock';

const APPS = [
  { type: 'start', Icon: IconBrandWindows, label: 'Start' },
  { id: 'search', Icon: IconSearch, label: 'Search' },
  { id: 'explorer', Icon: IconFolder, label: 'File Explorer' },
  { id: 'browser', Icon: IconBrowser, label: 'Browser' },
  { id: 'mail', Icon: IconMail, label: 'Mail' },
  { id: 'calendar', Icon: IconCalendar, label: 'Calendar' },
  { id: 'about', Icon: IconUser, label: 'About Me' },
  { id: 'projects', Icon: IconBriefcase, label: 'Projects' },
  { id: 'skills', Icon: IconFlame, label: 'Skills' },
  { id: 'contact', Icon: IconSend, label: 'Contact' },
  { id: 'github', Icon: IconBrandGithub, label: 'GitHub' },
];

export default function Taskbar({
  city = 'Lagos',
  temperature = '29°C',
  showStartMenu = false,
  onToggleStartMenu = () => {},
  onToggleQuickSettings = () => {},
}) {
  const { windows, handleTaskbarApp } = useWindow();
  const { settings } = useOSSettings();
  const { formattedTime, formattedDate } = useClock();

  return (
    <div
      data-taskbar
      className="fixed bottom-0 left-0 right-0 z-[9999] grid h-16 grid-cols-[220px_1fr_220px] items-center px-3"
      style={{
        background: 'rgba(219, 235, 250, 0.72)',
        borderTop: '1px solid rgba(255, 255, 255, 0.76)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 -12px 30px rgba(64, 106, 154, 0.12)',
      }}
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2 rounded-full bg-white/38 px-3 py-2 text-xs text-[#587397]">
          <IconCloud size={16} className="text-[#1a6ef5]" />
          <span>{city}</span>
          <strong className="text-[#1a3870]">{temperature}</strong>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {APPS.map((app) => {
          const { Icon } = app;
          const windowState = app.id ? windows[app.id] : null;
          const isOpen = Boolean(windowState?.isOpen);
          const isActive = isOpen && !windowState?.isMinimized;

          return (
            <motion.button
              key={app.label}
              type="button"
              title={app.label}
              whileHover={{ y: -3, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                color: '#1a3870',
                background: showStartMenu && app.type === 'start'
                  ? 'rgba(26, 110, 245, 0.18)'
                  : isActive
                    ? 'rgba(255, 255, 255, 0.62)'
                    : 'rgba(255, 255, 255, 0.32)',
                cursor: 'pointer',
              }}
              onClick={(event) => {
                event.stopPropagation();
                if (app.type === 'start') {
                  onToggleStartMenu();
                  return;
                }
                handleTaskbarApp(app.id);
              }}
            >
              <Icon size={18} />
              <span className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#1a3870] px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {app.label}
              </span>
              {isOpen && !windowState?.isMinimized && (
                <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-[#1a6ef5]" />
              )}
              {isOpen && windowState?.isMinimized && (
                <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-[#7f95b2]" />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 text-[#1a3870]">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5"
          style={{
            background: 'rgba(255,255,255,0.32)',
            color: settings.wifiOn && !settings.airplaneMode ? 'var(--accent-color)' : '#587397',
          }}
          onClick={(event) => {
            event.stopPropagation();
            onToggleQuickSettings();
          }}
          title="Quick Settings"
        >
          <IconWifi size={16} />
          <IconVolume2 size={16} />
          <IconBattery2 size={16} />
        </button>
        <div className="h-7 w-px bg-white/55" />
        <div className="min-w-20 text-right">
          <div className="text-sm font-bold leading-tight">{formattedTime}</div>
          <div className="text-[10px] leading-tight text-[#587397]">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
}
