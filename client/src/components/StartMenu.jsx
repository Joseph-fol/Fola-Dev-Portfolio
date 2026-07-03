import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconBrandGithub,
  IconBriefcase,
  IconFileText,
  IconFlame,
  IconMail,
  IconPower,
  IconSearch,
  IconUser,
} from '@tabler/icons-react';
import { useWindow } from '../context/WindowContext';

const PINNED_APPS = [
  { id: 'about', label: 'About', Icon: IconUser, bg: '#1a6ef5' },
  { id: 'projects', label: 'Projects', Icon: IconBriefcase, bg: '#9050d0' },
  { id: 'skills', label: 'Skills', Icon: IconFlame, bg: '#e050a0' },
  { id: 'contact', label: 'Contact', Icon: IconMail, bg: '#60b8f0' },
  { id: 'github', label: 'GitHub', Icon: IconBrandGithub, bg: '#1a3870' },
  { id: 'resume', label: 'Resume', Icon: IconFileText, bg: '#dc2626' },
];

export default function StartMenu({ onClose, onShutdown }) {
  const [showPower, setShowPower] = useState(false);
  const { openWindow } = useWindow();

  const openApp = (id) => {
    openWindow(id);
    onClose();
  };

  return (
    <motion.div
      data-startmenu
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 440, damping: 34 }}
      className="fixed bottom-20 left-1/2 z-[2600] w-80 -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl"
      style={{
        background: 'var(--surface-bg-strong)',
        border: '1px solid var(--surface-border)',
        backdropFilter: 'blur(24px)',
        color: 'var(--surface-text-primary)',
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="border-b p-4" style={{ borderColor: 'var(--surface-border)' }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--surface-muted)' }}>
          <IconSearch size={16} style={{ color: 'var(--surface-text-secondary)' }} />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search apps" />
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 text-xs font-semibold uppercase" style={{ color: 'var(--surface-text-secondary)' }}>Pinned</div>
        <div className="grid grid-cols-3 gap-3">
          {PINNED_APPS.map((app) => (
            <motion.button
              key={app.id}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-2 rounded-lg p-2 hover:bg-white/35"
              style={{ cursor: 'pointer' }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: app.bg }}>
                <app.Icon size={20} />
              </div>
              <span className="text-xs font-medium">{app.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t px-4 py-3" style={{ borderColor: 'var(--surface-border)', background: 'var(--surface-accent)' }}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1a6ef5] to-[#9050d0] text-sm font-semibold text-white">
            YN
          </div>
          <span className="text-sm font-semibold">Your Name</span>
        </div>

        <button
          type="button"
          title="Power"
          onClick={() => setShowPower((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/45"
        >
          <IconPower size={18} />
        </button>

        <AnimatePresence>
          {showPower && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-14 right-4 w-36 overflow-hidden rounded-lg shadow-xl"
              style={{ background: 'var(--surface-bg-strong)' }}
            >
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-white/10" onClick={() => setShowPower(false)}>Sleep</button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-white/10" onClick={() => window.location.reload()}>Restart</button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-white/10" onClick={onShutdown}>Shut Down</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
