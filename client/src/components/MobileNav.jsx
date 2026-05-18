import { motion } from 'framer-motion';
import { IconBrandGithub, IconFolder, IconMail, IconStar, IconUser } from '@tabler/icons-react';
import { useWindow } from '../context/WindowContext';

const TABS = [
  { id: 'about', label: 'About', Icon: IconUser },
  { id: 'projects', label: 'Projects', Icon: IconFolder },
  { id: 'skills', label: 'Skills', Icon: IconStar },
  { id: 'contact', label: 'Contact', Icon: IconMail },
  { id: 'github', label: 'GitHub', Icon: IconBrandGithub },
];

export default function MobileNav() {
  const { windows, openWidget, focusWidget } = useWindow();

  const handleTabClick = (tabId) => {
    openWidget(tabId);
    focusWidget(tabId);
    
    // Scroll to top to see the widget
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-20 border-t"
      style={{
        background: 'rgba(195, 215, 238, 0.95)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {TABS.map((tab) => {
          const isActive = windows[tab.id]?.isOpen;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 transition-colors"
              style={{
                color: isActive ? '#1a6ef5' : '#6b92b8',
              }}
            >
              <tab.Icon size={18} />
              <span className="text-xs font-semibold">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-indicator"
                  className="h-0.5 w-4 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #1a6ef5 0%, #1a3870 100%)',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
