export const BACKGROUNDS = [
  {
    id: 'default',
    name: 'Default',
    thumbnail: 'linear-gradient(135deg, #c5d8f0, #d8e8f8)',
    style: { background: 'linear-gradient(135deg, #c5d8f0 0%, #d8e8f8 100%)' },
    ribbons: { left: ['#9b2472', '#c0308a', '#e050a0', '#f080c0'], right: ['#1f8d83', '#2fae9d', '#40c8b8', '#a5f3df'] },
  },
  {
    id: 'tropical',
    name: 'Tropical Beach',
    thumbnail: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 65%, #f7d794 100%)',
    style: { background: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 66%, #f7d794 100%)' },
    ribbons: { left: ['#0077b6', '#00b4d8', '#48cae4', '#caf0f8'], right: ['#c28f2c', '#ffd166', '#f7d794', '#fff3b0'] },
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    thumbnail: 'linear-gradient(to bottom, #ff6b6b, #feca57, #48dbfb)',
    style: { background: 'linear-gradient(to bottom, #ff6b6b 0%, #feca57 48%, #48dbfb 100%)' },
    ribbons: { left: ['#b33939', '#ff6b6b', '#ff8787', '#ffc9c9'], right: ['#0e7490', '#06b6d4', '#48dbfb', '#a5f3fc'] },
  },
  {
    id: 'mountain',
    name: 'Mountain Peak',
    thumbnail: 'linear-gradient(160deg, #2c3e50, #4ca1af)',
    style: { background: 'linear-gradient(160deg, #2c3e50 0%, #4ca1af 100%)' },
    ribbons: { left: ['#1f2937', '#475569', '#94a3b8', '#e2e8f0'], right: ['#155e75', '#0891b2', '#67e8f9', '#cffafe'] },
  },
  {
    id: 'forest',
    name: 'Forest Mist',
    thumbnail: 'linear-gradient(135deg, #134e5e, #71b280)',
    style: { background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
    ribbons: { left: ['#064e3b', '#047857', '#34d399', '#bbf7d0'], right: ['#134e5e', '#0e7490', '#67e8f9', '#cffafe'] },
  },
  {
    id: 'aurora',
    name: 'Aurora Night',
    thumbnail: 'linear-gradient(160deg, #0f0c29, #302b63, #24243e)',
    style: {
      background:
        'radial-gradient(circle at 70% 20%, rgba(57, 255, 136, 0.25), transparent 28%), linear-gradient(160deg, #0f0c29, #302b63, #24243e)',
    },
    ribbons: { left: ['#321a70', '#6d28d9', '#a78bfa', '#ddd6fe'], right: ['#14532d', '#22c55e', '#86efac', '#dcfce7'] },
  },
  {
    id: 'desert',
    name: 'Desert Dunes',
    thumbnail: 'linear-gradient(160deg, #f7971e, #ffd200)',
    style: { background: 'linear-gradient(160deg, #f7971e 0%, #ffd200 100%)' },
    ribbons: { left: ['#9a3412', '#ea580c', '#fb923c', '#fed7aa'], right: ['#854d0e', '#ca8a04', '#fde047', '#fef9c3'] },
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    thumbnail: 'linear-gradient(135deg, #f8cdda, #1d2b64)',
    style: { background: 'linear-gradient(135deg, #f8cdda 0%, #1d2b64 100%)' },
    ribbons: { left: ['#9d174d', '#db2777', '#f9a8d4', '#fce7f3'], right: ['#172554', '#1d4ed8', '#93c5fd', '#dbeafe'] },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk City',
    thumbnail: 'linear-gradient(160deg, #0f0c29, #302b63)',
    style: {
      background:
        'radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.34), transparent 25%), radial-gradient(circle at 80% 65%, rgba(34, 211, 238, 0.34), transparent 24%), linear-gradient(160deg, #0f0c29, #302b63)',
    },
    ribbons: { left: ['#831843', '#db2777', '#ff3ea5', '#f9a8d4'], right: ['#155e75', '#0891b2', '#22d3ee', '#cffafe'] },
  },
  {
    id: 'arctic',
    name: 'Arctic Ice',
    thumbnail: 'linear-gradient(160deg, #e0eafc, #cfdef3)',
    style: { background: 'linear-gradient(160deg, #e0eafc 0%, #cfdef3 100%)' },
    ribbons: { left: ['#64748b', '#94a3b8', '#cbd5e1', '#f8fafc'], right: ['#0e7490', '#38bdf8', '#bae6fd', '#f0f9ff'] },
  },
  {
    id: 'volcanic',
    name: 'Volcanic',
    thumbnail: 'linear-gradient(160deg, #200122, #6f0000)',
    style: { background: 'linear-gradient(160deg, #200122 0%, #6f0000 100%)' },
    ribbons: { left: ['#450a0a', '#991b1b', '#ef4444', '#fecaca'], right: ['#431407', '#c2410c', '#fb923c', '#fed7aa'] },
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    thumbnail: 'linear-gradient(160deg, #0d0d0d, #1a1a2e, #16213e)',
    style: {
      background:
        'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 0 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.65) 0 1px, transparent 1px), linear-gradient(160deg, #0d0d0d, #1a1a2e, #16213e)',
      backgroundSize: '90px 90px, 130px 130px, auto',
    },
    ribbons: { left: ['#312e81', '#7c3aed', '#a78bfa', '#ddd6fe'], right: ['#0e7490', '#2563eb', '#38bdf8', '#bfdbfe'] },
  },
];

export const getBackground = (id) => BACKGROUNDS.find((background) => background.id === id) || BACKGROUNDS[0];
