import { motion } from 'framer-motion';
import { IconBriefcase, IconPalette, IconRefresh, IconSettings, IconUser } from '@tabler/icons-react';
import { useWindow } from '../context/WindowContext';
import { useNotifications } from '../context/NotificationContext';

export default function ContextMenu({ x, y, onClose, onDarkModeToggle }) {
  const { openWindow } = useWindow();
  const { notify } = useNotifications();

  const menuItems = [
    {
      Icon: IconRefresh,
      label: 'Refresh',
      action: () => window.location.reload(),
    },
    {
      Icon: IconBriefcase,
      label: 'Open Projects',
      action: () => openWindow('projects'),
    },
    {
      Icon: IconUser,
      label: 'Open About Me',
      action: () => openWindow('about'),
    },
    {
      Icon: IconPalette,
      label: 'Personalize',
      action: onDarkModeToggle,
    },
    {
      Icon: IconSettings,
      label: 'Display Settings',
      action: () => notify('Display Settings is decorative for now.', { duration: 3000 }),
    },
  ];

  const width = 210;
  const height = menuItems.length * 40 + 8;
  const adjustedX = Math.min(x, window.innerWidth - width - 8);
  const adjustedY = Math.min(y, window.innerHeight - height - 72);

  return (
    <motion.div
      data-contextmenu
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.12 }}
      className="fixed z-[2700] overflow-hidden rounded-lg py-1 shadow-2xl"
      style={{
        left: adjustedX,
        top: adjustedY,
        width,
        background: 'rgba(238, 247, 255, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {menuItems.map((item) => (
        <button
          key={item.label}
          type="button"
          className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-white/45"
          style={{ color: '#1a3870', cursor: 'pointer' }}
          onClick={() => {
            item.action();
            onClose();
          }}
        >
          <item.Icon size={16} />
          <span>{item.label}</span>
        </button>
      ))}
    </motion.div>
  );
}
