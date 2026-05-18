import { useState } from 'react';
import {
  IconAdjustments,
  IconClock,
  IconDeviceDesktop,
  IconInfoCircle,
  IconPalette,
  IconSettings,
} from '@tabler/icons-react';
import Widget from '../Widget';
import { BACKGROUNDS } from '../../config/backgrounds';
import { useOSSettings } from '../../context/OSSettingsContext';
import { useNotifications } from '../../context/NotificationContext';

const ACCENTS = ['#1a6ef5', '#e050a0', '#40c8b8', '#9050d0', '#f97316', '#22c55e', '#ef4444', '#0ea5e9'];

const CATEGORIES = [
  { id: 'personalization', label: 'Personalization', Icon: IconPalette },
  { id: 'display', label: 'Display', Icon: IconDeviceDesktop },
  { id: 'datetime', label: 'Date & Time', Icon: IconClock },
  { id: 'about', label: 'About', Icon: IconInfoCircle },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative h-6 w-11 rounded-full transition-colors"
      style={{ background: checked ? 'var(--accent-color)' : 'rgba(88, 115, 151, 0.28)' }}
    >
      <span
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform"
        style={{ left: checked ? 22 : 4 }}
      />
    </button>
  );
}

export default function SettingsWidget() {
  const [active, setActive] = useState('personalization');
  const { settings, setSettings } = useOSSettings();
  const { notify } = useNotifications();

  return (
    <Widget id="settings" title="Settings" icon={IconSettings} iconBg="#1a6ef5">
      <div className="flex h-full min-h-[460px] overflow-hidden rounded-lg bg-white/25">
        <aside className="w-52 flex-shrink-0 border-r border-white/45 p-3">
          <div className="mb-4 text-lg font-semibold text-[#1a3870]">Settings</div>
          <div className="space-y-1">
            {CATEGORIES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium"
                style={{
                  background: active === id ? 'rgba(26, 110, 245, 0.16)' : 'transparent',
                  color: active === id ? 'var(--accent-color)' : '#1a3870',
                }}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0 flex-1 overflow-auto p-5">
          {active === 'personalization' && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-xl font-semibold">Background</h2>
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                  {BACKGROUNDS.map((background) => (
                    <button
                      key={background.id}
                      type="button"
                      onClick={() => setSettings({ backgroundId: background.id })}
                      className="rounded-lg border p-2 text-left"
                      style={{
                        borderColor: settings.backgroundId === background.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.55)',
                        background: 'rgba(255,255,255,0.28)',
                      }}
                    >
                      <div className="h-16 rounded-md" style={{ background: background.thumbnail }} />
                      <div className="mt-2 text-xs font-semibold">{background.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">Accent Color</h2>
                <div className="flex flex-wrap gap-3">
                  {ACCENTS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={color}
                      onClick={() => setSettings({ accentColor: color })}
                      className="h-9 w-9 rounded-full border-2"
                      style={{
                        background: color,
                        borderColor: settings.accentColor === color ? '#fff' : 'rgba(255,255,255,0.35)',
                        boxShadow: settings.accentColor === color ? `0 0 0 2px ${color}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/35 p-4">
                <div>
                  <div className="font-semibold">Dark Mode</div>
                  <div className="text-xs text-[#587397]">Switch the desktop to a dark navy theme.</div>
                </div>
                <Toggle checked={settings.darkMode} onChange={(darkMode) => setSettings({ darkMode })} />
              </div>
            </div>
          )}

          {active === 'display' && (
            <div className="space-y-6">
              <div className="rounded-lg bg-white/35 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold">Brightness</span>
                  <span className="text-sm">{settings.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.brightness}
                  onChange={(event) => setSettings({ brightness: Number(event.target.value) })}
                  className="w-full accent-[var(--accent-color)]"
                />
              </div>
              <div className="rounded-lg bg-white/35 p-4">
                <div className="mb-3 font-semibold">Font Size</div>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSettings({ fontSize: size })}
                      className="rounded-lg px-4 py-2 text-sm capitalize"
                      style={{
                        background: settings.fontSize === size ? 'var(--accent-color)' : 'rgba(255,255,255,0.45)',
                        color: settings.fontSize === size ? '#fff' : '#1a3870',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'datetime' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-white/35 p-4">
                <div>
                  <div className="font-semibold">12-hour clock</div>
                  <div className="text-xs text-[#587397]">Updates taskbar and lock screen time.</div>
                </div>
                <Toggle
                  checked={settings.clockFormat === '12'}
                  onChange={(enabled) => setSettings({ clockFormat: enabled ? '12' : '24' })}
                />
              </div>
              <label className="block rounded-lg bg-white/35 p-4">
                <span className="mb-2 block font-semibold">Manual Time Offset</span>
                <input
                  type="number"
                  min="-12"
                  max="12"
                  value={settings.timeOffset}
                  onChange={(event) => setSettings({ timeOffset: Number(event.target.value) })}
                  className="w-32 rounded-lg border border-white/60 bg-white/60 px-3 py-2 outline-none"
                />
                <span className="ml-2 text-sm text-[#587397]">hours</span>
              </label>
            </div>
          )}

          {active === 'about' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-white/35 p-4">
                <div className="text-sm text-[#587397]">OS Name</div>
                <div className="text-xl font-semibold">Windows 12 Portfolio OS</div>
              </div>
              <div className="rounded-lg bg-white/35 p-4">
                <div className="text-sm text-[#587397]">Version</div>
                <div className="font-semibold">1.0.0</div>
              </div>
              <div className="rounded-lg bg-white/35 p-4">
                <div className="text-sm text-[#587397]">Developer</div>
                <div className="font-semibold">Your Name</div>
              </div>
              <button
                type="button"
                onClick={() => notify('You are already running the latest portfolio OS.', { duration: 3500 })}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{ background: 'var(--accent-color)' }}
              >
                Check for Updates
              </button>
            </div>
          )}
        </section>
      </div>
    </Widget>
  );
}
