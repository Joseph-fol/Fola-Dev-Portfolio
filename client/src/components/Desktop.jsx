import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IconBrandGithub,
  IconBriefcase,
  IconDatabase,
  IconDeviceDesktop,
  IconFileText,
  IconFlame,
  IconLock,
  IconMail,
  IconSearch,
  IconTrash,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import AboutWidget from './widgets/AboutWidget';
import ProjectsWidget from './widgets/ProjectsWidget';
import SkillsWidget from './widgets/SkillsWidget';
import ContactWidget from './widgets/ContactWidget';
import GitHubWidget from './widgets/GitHubWidget';
import SettingsWidget from './widgets/SettingsWidget';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import QuickSettings from './QuickSettings';
import Widget from './Widget';
import { useWindow } from '../context/WindowContext';
import { useNotifications } from '../context/NotificationContext';
import { useOSSettings } from '../context/OSSettingsContext';
import { getBackground } from '../config/backgrounds';

function Wallpaper({ background, isDarkMode }) {
  const ribbons = background.ribbons;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={background.style} />
      <svg className="absolute -left-52 top-1/2 z-0 h-[760px] w-[520px] -translate-y-1/2 pointer-events-none" viewBox="0 0 520 760" fill="none">
        <g transform="translate(260 380) rotate(-17)">
          <ellipse cx="0" cy="0" rx="170" ry="285" stroke={ribbons.left[0]} strokeWidth="72" strokeLinecap="round" opacity="0.42" />
          <ellipse cx="-8" cy="-6" rx="160" ry="272" stroke={ribbons.left[1]} strokeWidth="62" strokeLinecap="round" opacity="0.72" />
          <ellipse cx="12" cy="-16" rx="148" ry="258" stroke={ribbons.left[2]} strokeWidth="50" strokeLinecap="round" opacity="0.88" />
          <ellipse cx="34" cy="-34" rx="124" ry="228" stroke={ribbons.left[3]} strokeWidth="20" strokeLinecap="round" opacity="0.58" />
        </g>
      </svg>
      <svg className="absolute -right-52 top-1/2 z-0 h-[760px] w-[520px] -translate-y-1/2 pointer-events-none" viewBox="0 0 520 760" fill="none">
        <g transform="translate(260 380) rotate(17)">
          <ellipse cx="0" cy="0" rx="172" ry="286" stroke={ribbons.right[0]} strokeWidth="72" strokeLinecap="round" opacity="0.42" />
          <ellipse cx="8" cy="-6" rx="160" ry="272" stroke={ribbons.right[1]} strokeWidth="62" strokeLinecap="round" opacity="0.74" />
          <ellipse cx="-12" cy="-16" rx="148" ry="258" stroke={ribbons.right[2]} strokeWidth="50" strokeLinecap="round" opacity="0.88" />
          <ellipse cx="-34" cy="-34" rx="124" ry="228" stroke={ribbons.right[3]} strokeWidth="20" strokeLinecap="round" opacity="0.64" />
        </g>
      </svg>
      {isDarkMode && <div className="absolute inset-0 bg-[#071626]/45" />}
    </div>
  );
}

function GenericWindow({ id, children }) {
  return <Widget id={id}>{children}</Widget>;
}

function SearchContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg bg-white/55 px-3 py-3">
        <IconSearch size={20} className="text-[var(--accent-color)]" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search portfolio, projects, and apps" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {['About Me', 'Projects', 'Skills', 'Contact'].map((item) => (
          <div key={item} className="rounded-lg bg-white/35 px-3 py-3 font-medium text-[#1a3870]">{item}</div>
        ))}
      </div>
    </div>
  );
}

function ExplorerContent() {
  const folders = [
    ['About', IconUser, '#1a6ef5'],
    ['Projects', IconBriefcase, '#9050d0'],
    ['Skills', IconFlame, '#e050a0'],
    ['Contact', IconMail, '#60b8f0'],
    ['Resume.pdf', IconFileText, '#dc2626'],
    ['GitHub', IconBrandGithub, '#1a3870'],
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {folders.map(([label, Icon, color]) => (
        <div key={label} className="flex flex-col items-center gap-2 rounded-lg bg-white/35 p-4 text-center text-xs font-medium">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg text-white" style={{ background: color }}>
            <Icon size={24} />
          </div>
          {label}
        </div>
      ))}
    </div>
  );
}

function BrowserContent() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2 rounded-lg bg-white/55 px-3 py-2 text-xs text-[#587397]">
        <IconLock size={16} />
        https://portfolio.local
      </div>
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg bg-white/30 text-center">
        <IconWorld size={48} className="text-[#40c8b8]" />
        <h3 className="mt-3 text-lg font-semibold">Portfolio Browser</h3>
        <p className="mt-1 max-w-xs text-sm text-[#587397]">A local view of your work, projects, profile, and contact paths.</p>
      </div>
    </div>
  );
}

function MailContent() {
  return (
    <div className="space-y-3">
      {['Welcome to your portfolio OS', 'New project draft ready', 'Contact form connected'].map((subject, index) => (
        <div key={subject} className="rounded-lg bg-white/40 p-3">
          <div className="text-sm font-semibold">{subject}</div>
          <div className="mt-1 text-xs text-[#587397]">{index + 1} unread portfolio notification</div>
        </div>
      ))}
    </div>
  );
}

function CalendarContent() {
  return (
    <div className="grid grid-cols-7 gap-2 text-center text-sm">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => <div key={day} className="font-semibold text-[#587397]">{day}</div>)}
      {Array.from({ length: 31 }, (_, index) => (
        <div key={index} className={`rounded-lg py-2 ${index === 17 ? 'bg-[var(--accent-color)] text-white' : 'bg-white/35'}`}>{index + 1}</div>
      ))}
    </div>
  );
}

function ResumeContent() {
  return (
    <div className="space-y-3 text-sm">
      <h2 className="text-xl font-semibold">Your Name</h2>
      <p className="text-[#587397]">Full Stack Developer with a focus on clean interfaces, practical APIs, and thoughtful product experiences.</p>
      {['Frontend Engineering', 'Backend APIs', 'UI Motion', 'Database Design'].map((item) => (
        <div key={item} className="rounded-lg bg-white/35 px-3 py-2 font-medium">{item}</div>
      ))}
    </div>
  );
}

function ThisPcContent() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {['Local Disk (C:)', 'Portfolio Drive', 'Cloud Sync', 'Network'].map((item) => (
        <div key={item} className="rounded-lg bg-white/35 p-4">
          <IconDatabase size={24} className="text-[var(--accent-color)]" />
          <div className="mt-2 text-sm font-semibold">{item}</div>
          <div className="mt-2 h-2 rounded-full bg-white/60">
            <div className="h-full w-2/3 rounded-full bg-[var(--accent-color)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecycleContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <IconTrash size={60} className="text-[#6b92b8]" />
      <p className="mt-3 text-sm text-[#587397]">Recycle Bin is empty.</p>
    </div>
  );
}

const DESKTOP_ICONS = [
  { id: 'thispc', label: 'This PC', Icon: IconDeviceDesktop },
  { id: 'projects', label: 'Projects', Icon: IconBriefcase },
  { id: 'resume', label: 'Resume', Icon: IconFileText },
  { id: 'recycle', label: 'Recycle Bin', Icon: IconTrash },
];

export default function Desktop() {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const { windows, openWindow, focusWindow, desktopRef } = useWindow();
  const { notify } = useNotifications();
  const { settings, setSettings } = useOSSettings();
  const background = getBackground(settings.backgroundId);

  useEffect(() => {
    if (!settings.doNotDisturb) {
      notify('Welcome back! Click any app to get started', { duration: 4000 });
    }
  }, [notify, settings.doNotDisturb]);

  useEffect(() => {
    const handleToggleStartMenu = () => setShowStartMenu((prev) => !prev);
    window.addEventListener('toggleStartMenu', handleToggleStartMenu);
    return () => window.removeEventListener('toggleStartMenu', handleToggleStartMenu);
  }, []);

  const closeFloatingPanels = () => {
    setShowStartMenu(false);
    setShowQuickSettings(false);
    setContextMenu(null);
    setSelectedIcon(null);
  };

  const handleRightClick = (event) => {
    if (event.target.closest('[data-window], [data-taskbar], [data-startmenu], [data-contextmenu], [data-desktop-icon], [data-quicksettings]')) {
      return;
    }

    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
    setShowStartMenu(false);
    setShowQuickSettings(false);
  };

  const openFromDesktop = (id) => {
    openWindow(id);
    focusWindow(id);
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{
        cursor: 'default',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        filter: `brightness(${settings.brightness}%) ${settings.nightLight ? 'sepia(0.3) saturate(1.1)' : ''}`,
        background: settings.darkMode ? '#071626' : undefined,
      }}
      onClick={closeFloatingPanels}
      onContextMenu={handleRightClick}
    >
      <Wallpaper background={background} isDarkMode={settings.darkMode} />

      <div ref={desktopRef} className="absolute inset-x-0 top-0 bottom-16 z-10 overflow-hidden">
        <div className="absolute left-4 top-4 z-10 grid w-24 gap-4">
          {DESKTOP_ICONS.map((item) => (
            <button
              key={item.id}
              data-desktop-icon
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIcon(item.id);
              }}
              onDoubleClick={(event) => {
                event.stopPropagation();
                openFromDesktop(item.id);
              }}
              className="flex flex-col items-center gap-1 rounded-md p-1 text-center"
              style={{
                border: selectedIcon === item.id ? '1px solid rgba(26, 110, 245, 0.55)' : '1px solid transparent',
                background: selectedIcon === item.id ? 'rgba(147, 197, 253, 0.28)' : 'transparent',
                color: settings.darkMode ? '#e8f1ff' : '#1a3870',
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/45 shadow-sm">
                <item.Icon size={24} />
              </div>
              <span className="text-xs font-medium drop-shadow-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {windows.about.isOpen && <AboutWidget key="about" />}
          {windows.projects.isOpen && <ProjectsWidget key="projects" />}
          {windows.skills.isOpen && <SkillsWidget key="skills" />}
          {windows.contact.isOpen && <ContactWidget key="contact" />}
          {windows.github.isOpen && <GitHubWidget key="github" />}
          {windows.settings.isOpen && <SettingsWidget key="settings" />}
          {windows.search.isOpen && <GenericWindow key="search" id="search"><SearchContent /></GenericWindow>}
          {windows.explorer.isOpen && <GenericWindow key="explorer" id="explorer"><ExplorerContent /></GenericWindow>}
          {windows.browser.isOpen && <GenericWindow key="browser" id="browser"><BrowserContent /></GenericWindow>}
          {windows.mail.isOpen && <GenericWindow key="mail" id="mail"><MailContent /></GenericWindow>}
          {windows.calendar.isOpen && <GenericWindow key="calendar" id="calendar"><CalendarContent /></GenericWindow>}
          {windows.resume.isOpen && <GenericWindow key="resume" id="resume"><ResumeContent /></GenericWindow>}
          {windows.thispc.isOpen && <GenericWindow key="thispc" id="thispc"><ThisPcContent /></GenericWindow>}
          {windows.recycle.isOpen && <GenericWindow key="recycle" id="recycle"><RecycleContent /></GenericWindow>}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showStartMenu && (
          <StartMenu
            onClose={() => setShowStartMenu(false)}
            onShutdown={() => setIsShuttingDown(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onDarkModeToggle={() => setSettings((prev) => ({ darkMode: !prev.darkMode }))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuickSettings && <QuickSettings onClose={() => setShowQuickSettings(false)} />}
      </AnimatePresence>

      <Taskbar
        city="Lagos"
        temperature="29°C"
        showStartMenu={showStartMenu}
        onToggleStartMenu={() => setShowStartMenu((prev) => !prev)}
        onToggleQuickSettings={() => setShowQuickSettings((prev) => !prev)}
      />

      <AnimatePresence>
        {isShuttingDown && (
          <motion.div
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-black text-lg font-medium text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Shutting down...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
