import { motion } from 'framer-motion';
import {
  IconAccessible,
  IconBluetooth,
  IconMoon,
  IconPlane,
  IconSettings,
  IconSun,
  IconVolume2,
  IconWifi,
  IconWifiOff,
  IconBellOff,
} from '@tabler/icons-react';
import { useOSSettings } from '../context/OSSettingsContext';
import { useWindow } from '../context/WindowContext';

function Tile({ Icon, label, sublabel, active, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex min-h-[74px] flex-col items-start justify-between rounded-xl p-3 text-left transition"
      style={{
        background: active ? 'var(--accent-color)' : 'var(--surface-muted)',
        color: active ? '#fff' : 'var(--surface-text-primary)',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <Icon size={20} />
      <span>
        <span className="block text-xs font-semibold">{label}</span>
        {sublabel && <span className="block text-[10px] opacity-80">{sublabel}</span>}
      </span>
    </button>
  );
}

export default function QuickSettings({ onClose }) {
  const { settings, setSettings } = useOSSettings();
  const { openWindow } = useWindow();
  const wifiDisabled = settings.airplaneMode;

  return (
    <motion.div
      data-quicksettings
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 430, damping: 32 }}
      className="fixed bottom-20 right-4 z-[9998] w-80 overflow-hidden rounded-2xl p-4 shadow-2xl"
      style={{
        background: 'var(--surface-bg-strong)',
        border: '1px solid var(--surface-border)',
        backdropFilter: 'blur(24px)',
        color: 'var(--surface-text-primary)',
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="grid grid-cols-3 gap-2">
        <Tile
          Icon={settings.wifiOn && !wifiDisabled ? IconWifi : IconWifiOff}
          label="WiFi"
          sublabel={settings.wifiOn && !wifiDisabled ? 'Connected' : 'Off'}
          active={settings.wifiOn && !wifiDisabled}
          disabled={wifiDisabled}
          onClick={() => setSettings({ wifiOn: !settings.wifiOn })}
        />
        <Tile
          Icon={IconBluetooth}
          label="Bluetooth"
          sublabel={settings.bluetoothOn && !wifiDisabled ? 'On' : 'Off'}
          active={settings.bluetoothOn && !wifiDisabled}
          disabled={wifiDisabled}
          onClick={() => setSettings({ bluetoothOn: !settings.bluetoothOn })}
        />
        <Tile
          Icon={IconPlane}
          label="Airplane"
          sublabel={settings.airplaneMode ? 'On' : 'Off'}
          active={settings.airplaneMode}
          onClick={() => setSettings({ airplaneMode: !settings.airplaneMode })}
        />
        <Tile
          Icon={IconMoon}
          label="Night Light"
          sublabel={settings.nightLight ? 'Warm' : 'Off'}
          active={settings.nightLight}
          onClick={() => setSettings({ nightLight: !settings.nightLight })}
        />
        <Tile
          Icon={IconBellOff}
          label="DND"
          sublabel={settings.doNotDisturb ? 'On' : 'Off'}
          active={settings.doNotDisturb}
          onClick={() => setSettings({ doNotDisturb: !settings.doNotDisturb })}
        />
        <Tile Icon={IconAccessible} label="Access" sublabel="Ready" active={false} onClick={() => {}} />
      </div>

      <div className="mt-4 space-y-3 rounded-xl p-3" style={{ background: 'var(--surface-accent)' }}>
        <label className="flex items-center gap-3">
          <IconSun size={18} />
          <input
            type="range"
            min="0"
            max="100"
            value={settings.brightness}
            onChange={(event) => setSettings({ brightness: Number(event.target.value) })}
            className="flex-1 accent-[var(--accent-color)]"
          />
        </label>
        <label className="flex items-center gap-3">
          <IconVolume2 size={18} />
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(event) => setSettings({ volume: Number(event.target.value) })}
            className="flex-1 accent-[var(--accent-color)]"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div>
          <div className="font-semibold">87% battery</div>
          <div style={{ color: 'var(--surface-text-secondary)' }}>{settings.wifiOn && !wifiDisabled ? 'Portfolio_Network' : 'No network'}</div>
        </div>
        <button
          type="button"
          className="rounded-lg bg-white/45 p-2"
          onClick={() => {
            openWindow('settings');
            onClose();
          }}
          title="Open Settings"
        >
          <IconSettings size={18} />
        </button>
      </div>
    </motion.div>
  );
}
