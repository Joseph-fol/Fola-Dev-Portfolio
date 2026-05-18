import { createContext, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconBell, IconX } from '@tabler/icons-react';
import { useOSSettings } from './OSSettingsContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { settings } = useOSSettings();

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const notify = (message, options = {}) => {
    if (settings.doNotDisturb && !options.force) return;
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const notification = { id, message, type: options.type || 'info' };
    setNotifications((prev) => [...prev, notification]);

    if (options.duration !== 0) {
      window.setTimeout(() => dismissNotification(id), options.duration || 4000);
    }
  };

  const value = useMemo(() => ({ notify, dismissNotification }), [settings.doNotDisturb]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed bottom-20 right-4 z-[3000] flex w-80 flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 shadow-xl"
              style={{
                background: 'rgba(238, 247, 255, 0.86)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                color: '#1a3870',
              }}
            >
              <IconBell size={18} className="mt-0.5" />
              <p className="min-w-0 flex-1 text-sm leading-snug">{notification.message}</p>
              <button
                type="button"
                aria-label="Dismiss notification"
                className="rounded p-0.5 text-lg leading-none hover:bg-white/40"
                onClick={() => dismissNotification(notification.id)}
              >
                <IconX size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
