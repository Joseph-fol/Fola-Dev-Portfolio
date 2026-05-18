import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(230, 242, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255, 255, 255, 0.9)',
          color: '#1a3870',
          fontSize: '14px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        success: {
          style: {
            borderLeft: '4px solid #1a6ef5',
          },
          icon: '✓',
          iconTheme: {
            primary: '#1a6ef5',
            secondary: 'rgba(230, 242, 255, 0.95)',
          },
        },
        error: {
          style: {
            borderLeft: '4px solid #e050a0',
          },
          icon: '✕',
          iconTheme: {
            primary: '#e050a0',
            secondary: 'rgba(230, 242, 255, 0.95)',
          },
        },
      }}
    />
  );
}
