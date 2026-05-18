import { motion } from 'framer-motion';
import useClock from '../hooks/useClock';

function RibbonLoops() {
  return (
    <>
      <svg
        className="absolute -left-44 top-1/2 h-[680px] w-[440px] -translate-y-1/2 pointer-events-none"
        viewBox="0 0 440 680"
        fill="none"
      >
        <g transform="translate(220 340) rotate(-16)">
          <ellipse cx="0" cy="0" rx="145" ry="245" stroke="#9b2472" strokeWidth="62" strokeLinecap="round" opacity="0.58" />
          <ellipse cx="-8" cy="-6" rx="138" ry="236" stroke="#c0308a" strokeWidth="54" strokeLinecap="round" opacity="0.9" />
          <ellipse cx="10" cy="-12" rx="128" ry="224" stroke="#e050a0" strokeWidth="42" strokeLinecap="round" opacity="0.95" />
          <ellipse cx="24" cy="-26" rx="108" ry="198" stroke="#f080c0" strokeWidth="18" strokeLinecap="round" opacity="0.62" />
        </g>
      </svg>

      <svg
        className="absolute -right-44 top-1/2 h-[680px] w-[440px] -translate-y-1/2 pointer-events-none"
        viewBox="0 0 440 680"
        fill="none"
      >
        <g transform="translate(220 340) rotate(18)">
          <ellipse cx="0" cy="0" rx="150" ry="245" stroke="#1c897f" strokeWidth="62" strokeLinecap="round" opacity="0.58" />
          <ellipse cx="8" cy="-6" rx="140" ry="236" stroke="#2fae9d" strokeWidth="54" strokeLinecap="round" opacity="0.88" />
          <ellipse cx="-8" cy="-14" rx="128" ry="224" stroke="#40c8b8" strokeWidth="42" strokeLinecap="round" opacity="0.95" />
          <ellipse cx="-24" cy="-28" rx="108" ry="198" stroke="#a5f3df" strokeWidth="18" strokeLinecap="round" opacity="0.7" />
        </g>
      </svg>
    </>
  );
}

export default function LockScreen({ onUnlock }) {
  const { formattedTime } = useClock();

  return (
    <motion.div
      onClick={onUnlock}
      initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #c5d8f0 0%, #d8e8f8 100%)',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <RibbonLoops />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          style={{
            color: '#1a3870',
            fontSize: 80,
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {formattedTime}
        </div>
        <div className="mt-4 text-base" style={{ color: '#6b7f9f' }}>
          Developer Portfolio
        </div>
        <div className="mt-10 os-pulse text-sm" style={{ color: '#587397' }}>
          Click anywhere to enter
        </div>
      </div>
    </motion.div>
  );
}
