import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LockScreen from '../components/LockScreen';
import Desktop from '../components/Desktop';
import { WindowProvider } from '../context/WindowContext';
import { NotificationProvider } from '../context/NotificationContext';
import { OSSettingsProvider } from '../context/OSSettingsContext';

export default function Home() {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  return (
    <OSSettingsProvider>
      <WindowProvider>
        <NotificationProvider>
          <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
            <AnimatePresence>
              {isLocked && <LockScreen key="lockscreen" onUnlock={handleUnlock} />}
            </AnimatePresence>

            {!isLocked && <Desktop />}
          </div>
        </NotificationProvider>
      </WindowProvider>
    </OSSettingsProvider>
  );
}
